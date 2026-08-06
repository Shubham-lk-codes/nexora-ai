import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'delivery', cors: { origin: '*' } })
export class DeliveryGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('DeliveryGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() orderId: string, @ConnectedSocket() client: Socket) {
    client.join(`order:${orderId}`);
    return { success: true };
  }

  @SubscribeMessage('location-update')
  handleLocationUpdate(@MessageBody() data: { orderId: string; lat: number; lng: number }) {
    this.server.to(`order:${data.orderId}`).emit('partner-location', { lat: data.lat, lng: data.lng });
  }

  emitOrderStatus(orderId: string, status: string) {
    this.server.to(`order:${orderId}`).emit('status-update', { status, timestamp: new Date() });
  }
}
