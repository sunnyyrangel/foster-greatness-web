import { NextRequest, NextResponse } from 'next/server';
import { getStripe, calculateProcessingFee } from '@/lib/stripe';
import { giftRecipients } from '@/app/(site)/holiday-gift-drive-2025/data/giftRecipients';

export async function POST(request: NextRequest) {
  try {
    const { giftId, coverFee, donorEmail } = await request.json();

    // Find the gift recipient
    const recipient = giftRecipients.find(r => r.id === giftId);
    if (!recipient) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    if (recipient.purchased) {
      return NextResponse.json({ error: 'This gift has already been sponsored' }, { status: 400 });
    }

    // Calculate total amount
    const baseAmount = recipient.giftPrice;
    const fee = coverFee ? calculateProcessingFee(baseAmount) : 0;
    const totalAmount = Math.round((baseAmount + fee) * 100); // Convert to cents

    const stripe = getStripe();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Gift for ${recipient.name}: ${recipient.giftTitle}`,
              description: recipient.giftDescription,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fostergreatness.co'}/holiday-gift-drive-2025/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.fostergreatness.co'}/holiday-gift-drive-2025`,
      metadata: {
        giftId: recipient.id,
        recipientName: recipient.name,
        giftTitle: recipient.giftTitle,
        coverFee: coverFee ? 'true' : 'false',
        donorEmail: donorEmail || '',
      },
      ...(donorEmail && { customer_email: donorEmail }),
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
