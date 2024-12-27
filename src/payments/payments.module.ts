import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentStatusGateway } from './gateways/payments.gateways';
import { PrismaService } from 'src/prisma/prisma.service';
import { VisaPaymentService } from './services/visa-payment.service';
import { MasterCardPaymentService } from './services/mastercard-payment.service';
import { PayPalPaymentService } from './services/paypal-payment.service';
import { PaymentFactoryService } from './services/payment-factory.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentStatusGateway,
    PrismaService,
    VisaPaymentService,
    MasterCardPaymentService,
    PayPalPaymentService,
    PaymentFactoryService,
  ],
})
export class PaymentsModule {}
