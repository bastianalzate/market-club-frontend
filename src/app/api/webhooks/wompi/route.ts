import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Wompi webhook received');
    
    // Obtener el body del request
    const body = await request.json();
    console.log('📦 Webhook payload:', JSON.stringify(body, null, 2));
    
    // Verificar la firma del webhook (IMPORTANTE para seguridad)
    const signature = headers().get('x-wompi-signature');
    if (!signature) {
      console.error('❌ Missing webhook signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }
    
    // TODO: Implementar verificación de firma con tu clave secreta
    // const isValidSignature = verifyWompiSignature(body, signature);
    // if (!isValidSignature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    
    const { event, data } = body;
    
    switch (event) {
      case 'transaction.updated':
        await handleTransactionUpdate(data);
        break;
        
      case 'transaction.created':
        console.log('📝 Transaction created:', data.transaction.id);
        break;
        
      default:
        console.log('ℹ️ Unknown event type:', event);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleTransactionUpdate(data: any) {
  const { transaction } = data;
  const { id, status, reference, amount_in_cents } = transaction;
  
  console.log(`🔄 Transaction ${id} status: ${status}`);
  
  switch (status) {
    case 'APPROVED':
      await handleApprovedPayment(id, reference, amount_in_cents);
      break;
      
    case 'DECLINED':
      await handleDeclinedPayment(id, reference);
      break;
      
    case 'VOIDED':
      await handleVoidedPayment(id, reference);
      break;
      
    default:
      console.log(`ℹ️ Transaction ${id} status: ${status} (no action needed)`);
  }
}

async function handleApprovedPayment(transactionId: string, reference: string, amount: number) {
  try {
    console.log(`✅ Payment approved: ${transactionId}, reference: ${reference}`);
    
    // Verificar si es una orden regular o suscripción
    if (reference.includes('ORDER_')) {
      // Es una orden regular
      await confirmOrder(transactionId, reference);
    } else if (reference.includes('SUBSCRIPTION_')) {
      // Es una suscripción
      await confirmSubscription(transactionId, reference);
    }
    
  } catch (error) {
    console.error('❌ Error handling approved payment:', error);
  }
}

async function handleDeclinedPayment(transactionId: string, reference: string) {
  try {
    console.log(`❌ Payment declined: ${transactionId}, reference: ${reference}`);
    
    // Marcar la orden/suscripción como fallida
    await markPaymentAsFailed(reference, transactionId, 'declined');
    
  } catch (error) {
    console.error('❌ Error handling declined payment:', error);
  }
}

async function handleVoidedPayment(transactionId: string, reference: string) {
  try {
    console.log(`🚫 Payment voided: ${transactionId}, reference: ${reference}`);
    
    // Marcar la orden/suscripción como cancelada
    await markPaymentAsFailed(reference, transactionId, 'voided');
    
  } catch (error) {
    console.error('❌ Error handling voided payment:', error);
  }
}

// Funciones que debes implementar en tu backend
async function confirmOrder(transactionId: string, reference: string) {
  // TODO: Llamar a tu API para confirmar la orden
  const response = await fetch(`${process.env.API_URL}/orders/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
    },
    body: JSON.stringify({
      transaction_id: transactionId,
      reference: reference,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to confirm order');
  }
}

async function confirmSubscription(transactionId: string, reference: string) {
  // TODO: Llamar a tu API para confirmar la suscripción
  const response = await fetch(`${process.env.API_URL}/subscriptions/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
    },
    body: JSON.stringify({
      transaction_id: transactionId,
      reference: reference,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to confirm subscription');
  }
}

async function markPaymentAsFailed(reference: string, transactionId: string, reason: string) {
  // TODO: Llamar a tu API para marcar el pago como fallido
  const response = await fetch(`${process.env.API_URL}/payments/mark-failed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_SECRET_KEY}`,
    },
    body: JSON.stringify({
      reference: reference,
      transaction_id: transactionId,
      reason: reason,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to mark payment as failed');
  }
}

