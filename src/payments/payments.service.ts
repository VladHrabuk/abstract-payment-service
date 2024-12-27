import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentFactoryService } from './services/payment-factory.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentStatusGateway } from './gateways/payments.gateways';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentFactoryService: PaymentFactoryService,
    private readonly prismaService: PrismaService,
    private readonly paymentStatusGateway: PaymentStatusGateway,
  ) {}

  async getAllPayments() {
    return this.prismaService.payment.findMany();
  }

  async getPaymentById(id: string) {
    const payment = await this.prismaService.payment.findUnique({
      where: { id: Number(id) },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async createPayment(
    amount: number,
    method: string,
    details: Record<string, any>,
  ) {
    const paymentService = this.paymentFactoryService.getPaymentService(method);
    if (!paymentService) {
      throw new BadRequestException('Unsupported payment method');
    }

    const payment = await this.prismaService.payment.create({
      data: {
        amount,
        method,
        status: 'processing',
      },
    });

    this.processPayment(payment.id.toString(), paymentService);

    return {
      status: 'processing',
      paymentId: payment.id,
    };
  }

  private async processPayment(paymentId: string, paymentService: any) {
    const serviceName = paymentService.constructor.name;

    this.paymentStatusGateway.sendPaymentStatus(
      paymentId,
      'processing',
      serviceName,
    );

    let status = 'processing';

    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      this.paymentStatusGateway.sendPaymentStatus(
        paymentId,
        status,
        serviceName,
      );
    }
    status = 'successful';

    await this.prismaService.payment.update({
      where: { id: Number(paymentId) },
      data: { status },
    });

    this.paymentStatusGateway.sendPaymentStatus(paymentId, status, serviceName);
  }
}
