import { BadRequestException, Injectable } from '@nestjs/common';
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

  async createPayment(
    amount: number,
    method: string,
    details: Record<string, any>,
  ) {
    // Валідація методу
    const paymentService = this.paymentFactoryService.getPaymentService(method);
    if (!paymentService) {
      throw new BadRequestException('Unsupported payment method');
    }

    // Створення платежу
    const payment = await this.prismaService.payment.create({
      data: {
        amount,
        method,
        status: 'processing',
      },
    });

    // Запуск асинхронного процесу обробки
    this.processPayment(payment.id.toString(), paymentService);

    return {
      status: 'processing',
      paymentId: payment.id,
    };
  }

  private async processPayment(paymentId: string, paymentService: any) {
    const serviceName = paymentService.constructor.name;

    // Емітуємо початковий статус
    this.paymentStatusGateway.sendPaymentStatus(
      paymentId,
      'processing',
      serviceName,
    );

    let status = 'processing';

    // Обробка з оновленням кожні 3 секунди
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Очікування 3 секунди
      this.paymentStatusGateway.sendPaymentStatus(
        paymentId,
        status,
        serviceName,
      );
    }

    // Завершення через 10 секунд
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Додаткові 1 секунда
    status = 'successful';

    // Оновлення бази даних і надсилання статусу
    await this.prismaService.payment.update({
      where: { id: Number(paymentId) },
      data: { status },
    });

    this.paymentStatusGateway.sendPaymentStatus(paymentId, status, serviceName);
  }
}
