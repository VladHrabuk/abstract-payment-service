import { Injectable } from '@nestjs/common';
import { VisaPaymentService } from './visa-payment.service';
import { MasterCardPaymentService } from './mastercard-payment.service';
import { PayPalPaymentService } from './paypal-payment.service';
import { AbstractPaymentService } from './abstract-payment.service';

@Injectable()
export class PaymentFactoryService {
  constructor(
    private readonly visaPaymentService: VisaPaymentService,
    private readonly masterCardPaymentService: MasterCardPaymentService,
    private readonly payPalPaymentService: PayPalPaymentService,
  ) {}

  getPaymentService(method: string): AbstractPaymentService {
    switch (method) {
      case 'visa':
        return this.visaPaymentService;
      case 'mastercard':
        return this.masterCardPaymentService;
      case 'paypal':
        return this.payPalPaymentService;
      default:
        throw new Error('Unsupported payment method');
    }
  }
}
