import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('Stripe secret key not found in environment variables');
    }

    console.log('Stripe Key:', stripeKey);

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-10-29.clover',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });
  }
}
