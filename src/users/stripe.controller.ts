import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('createPayment')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string },
  ) {
    const paymentIntent = await this.stripeService.createPaymentIntent(
      body.amount,
      body.currency,
    );
    return { clientSecret: paymentIntent.client_secret };
  }
}
