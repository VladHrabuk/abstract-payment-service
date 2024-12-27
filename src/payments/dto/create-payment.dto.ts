import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class PaymentDetailsDto {
  @ApiProperty({
    type: String,
    description: 'Card number for payment',
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty({
    type: String,
    description: 'Expiry date of the card in MM/YY format',
    example: '12/25',
  })
  @IsString()
  @IsNotEmpty()
  expiryDate: string;

  @ApiProperty({
    type: String,
    description: 'CVV code of the card',
    example: '123',
  })
  @IsString()
  @IsNotEmpty()
  cvv: string;
}

export class CreatePaymentDto {
  @ApiProperty({
    type: Number,
    description: 'Amount for the payment',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: ['visa', 'mastercard', 'paypal'],
    description: 'Payment method',
    example: 'visa',
  })
  @IsEnum(['visa', 'mastercard', 'paypal'], {
    message:
      'method must be one of the following values: visa, mastercard, paypal',
  })
  @IsNotEmpty()
  method: 'visa' | 'mastercard' | 'paypal';

  @ApiProperty({
    type: PaymentDetailsDto,
    description: 'Details of the payment method',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  details: PaymentDetailsDto;
}
