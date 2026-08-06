export class RegisterDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  businessName?: string;
}

export class LoginDto {
  emailOrPhone: string;
  password: string;
}

export class VerifyOtpDto {
  phone: string;
  otp: string;
}

export class RefreshTokenDto {
  refreshToken: string;
}

export class ForgotPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  token: string;
  newPassword: string;
}

export class Enable2FADto {
  enabled: boolean;
}

export class SocialLoginDto {
  provider: string;
  token: string;
}
