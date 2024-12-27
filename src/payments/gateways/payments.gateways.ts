import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/ws/payments',
  cors: { origin: '*' }, // for development purposes
})
export class PaymentStatusGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const { paymentId } = client.handshake.query;

    if (!paymentId) {
      client.disconnect();
      console.log(`Client disconnected due to missing paymentId`);
      return;
    }

    client.join(paymentId);
    console.log(`Client ${client.id} joined room: ${paymentId}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendPaymentStatus(paymentId: string, status: string, service: string) {
    this.server.to(paymentId).emit('paymentStatus', { status, service });
  }
}
