import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private config: ConfigService) {
    const serviceAccount = JSON.parse(this.config.get('FIREBASE_SERVICE_ACCOUNT') || '{}');
    if (!admin.apps.length && serviceAccount.project_id) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  async sendPush(userId: string, title: string, body: string, data?: any) {
    await this.prisma.notification.create({
      data: { userId, title, body, type: 'SYSTEM', data: data || {} },
    });
    return { sent: true };
  }

  async sendSms(phone: string, message: string) {
    return { sent: true };
  }

  async sendEmail(to: string, subject: string, html: string) {
    return { sent: true };
  }

  async broadcast(title: string, body: string, userIds?: string[]) {
    const users = userIds 
      ? await this.prisma.user.findMany({ where: { id: { in: userIds } } })
      : await this.prisma.user.findMany();

    await this.prisma.notification.createMany({
      data: users.map(u => ({ userId: u.id, title, body, type: 'PROMOTION' })),
    });
    return { sent: users.length };
  }
}
