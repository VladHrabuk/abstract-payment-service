import { Injectable } from '@nestjs/common';
import { AbstractPaymentService } from './abstract-payment.service';

@Injectable()
export class VisaPaymentService extends AbstractPaymentService {
  async processPayment(
    amount: number,
    details: Record<string, string>,
  ): Promise<{ status: string }> {
    console.log('Processing Visa payment...', details);
    await this.simulatePayment();
    return { status: 'successful' };
  }

  private simulatePayment() {
    return new Promise((resolve) => setTimeout(resolve, 20000));
  }
}
