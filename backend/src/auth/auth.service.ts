import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { PrismaService } from '../common/prisma.service';
import { RedisService } from '../common/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LoginDto, RegisterDto, VerifyOtpDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, Enable2FADto } from './dto';
import { User, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
    private notificationsService: NotificationsService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: User; token: string }> {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
    });
    if (existing) throw new ConflictException('Email or phone already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role || UserRole.CUSTOMER,
        status: UserStatus.PENDING_VERIFICATION,
      },
    });

    // Create role-specific profile
    if (user.role === UserRole.CUSTOMER) {
      await this.prisma.customerProfile.create({ data: { userId: user.id } });
    } else if (user.role === UserRole.VENDOR) {
      await this.prisma.vendorProfile.create({
        data: { userId: user.id, businessName: dto.businessName || dto.firstName, businessType: 'OTHER' },
      });
    }

    // Create wallet
    await this.prisma.wallet.create({ data: { userId: user.id } });

    // Send OTP
    await this.sendOtp(user.phone);

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async login(dto: LoginDto): Promise<{ user: User; token: string; requires2FA?: boolean }> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }] },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.status === UserStatus.SUSPENDED) throw new UnauthorizedException('Account suspended');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (user.twoFactorEnabled) {
      return { user: this.sanitizeUser(user), token: '', requires2FA: true };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = this.generateToken(user);
    return { user: this.sanitizeUser(user), token };
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ token: string }> {
    const key = `otp:${dto.phone}`;
    const storedOtp = await this.redisService.get(key);
    if (!storedOtp || storedOtp !== dto.otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    await this.redisService.del(key);

    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) throw new BadRequestException('User not found');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true, status: UserStatus.ACTIVE },
    });

    const token = this.generateToken(user);
    return { token };
  }

  async sendOtp(phone: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.set(`otp:${phone}`, otp, 300); // 5 minutes
    await this.notificationsService.sendSms(phone, `Your Nexora AI verification code is: ${otp}. Valid for 5 minutes.`);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<{ token: string }> {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      const token = this.generateToken(user);
      return { token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return; // Don't reveal if email exists
    const token = this.jwtService.sign({ sub: user.id, type: 'password_reset' }, { expiresIn: '1h' });
    await this.redisService.set(`password_reset:${user.id}`, token, 3600);
    await this.notificationsService.sendEmail(user.email, 'Password Reset', `Reset link: ${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const payload = this.jwtService.verify(dto.token, { secret: this.configService.get('JWT_SECRET') });
    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({ where: { id: payload.sub }, data: { password: hashedPassword } });
    await this.redisService.del(`password_reset:${payload.sub}`);
  }

  async enable2FA(userId: string, dto: Enable2FADto): Promise<{ secret: string; qrCode: string }> {
    const secret = speakeasy.generateSecret({ name: 'Nexora AI' });
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32, twoFactorEnabled: true },
    });
    const qrCode = `otpauth://totp/NexoraAI:${userId}?secret=${secret.base32}&issuer=NexoraAI`;
    return { secret: secret.base32, qrCode };
  }

  async verify2FA(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) return false;
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, role: user.role, phone: user.phone };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User): any {
    const { password, twoFactorSecret, ...rest } = user as any;
    return rest;
  }
}
