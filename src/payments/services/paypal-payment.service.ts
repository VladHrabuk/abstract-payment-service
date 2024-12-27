import { Injectable } from '@nestjs/common';
import { AbstractPaymentService } from './abstract-payment.service';

@Injectable()
export class PayPalPaymentService extends AbstractPaymentService {
  async processPayment(
    amount: number,
    details: Record<string, any>,
  ): Promise<{ status: string }> {
    console.log('Processing PayPal payment...', details);
    await this.simulatePayment();
    return { status: 'failed' };
  }

  private simulatePayment() {
    return new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
