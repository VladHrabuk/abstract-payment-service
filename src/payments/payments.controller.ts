import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getAllPayments() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  async getPaymentById(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const { amount, method, details } = createPaymentDto;
    return this.paymentsService.createPayment(amount, method, details);
  }
}
