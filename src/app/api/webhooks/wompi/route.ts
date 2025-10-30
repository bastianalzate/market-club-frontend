import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Wompi webhook received');
    console.log('🕐 Timestamp:', new Date().toISOString());
    
    // Obtener el body del request
    const body = await request.json();
    console.log('📦 Webhook payload:', JSON.stringify(body, null, 2));
    
    // Log de headers importantes
    const headersList = await headers();
    const signature = headersList.get('x-wompi-signature');
    const userAgent = headersList.get('user-agent');
    const contentType = headersList.get('content-type');
    
    console.log('🔐 Webhook signature:', signature);
    console.log('🌐 User agent:', userAgent);
    console.log('📄 Content type:', contentType);
    
    // Verificar la firma del webhook (IMPORTANTE para seguridad)
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
    
    console.log('🎯 Processing event:', event);
    console.log('📊 Event data:', JSON.stringify(data, null, 2));
    
    switch (event) {
      case 'transaction.updated':
        console.log('🔄 Processing transaction update...');
        await handleTransactionUpdate(data);
        break;
        
      case 'transaction.created':
        console.log('📝 Transaction created:', data.transaction.id);
        console.log('💰 Transaction amount:', data.transaction.amount_in_cents);
        console.log('🔗 Transaction reference:', data.transaction.reference);
        break;
        
      default:
        console.log('ℹ️ Unknown event type:', event);
        console.log('📋 Full event data:', JSON.stringify(data, null, 2));
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
    console.log(`💰 Amount: ${amount} centavos`);
    
    // Verificar si es una orden regular o suscripción
    if (reference.includes('ORDER_')) {
      // Es una orden regular
      console.log(`🛒 Processing order payment for reference: ${reference}`);
      await confirmOrder(transactionId, reference);
    } else if (reference.includes('SUBSCRIPTION_')) {
      // Es una suscripción
      console.log(`📋 Processing subscription payment for reference: ${reference}`);
      await confirmSubscription(transactionId, reference);
    } else {
      console.log(`⚠️ Unknown reference format: ${reference}`);
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
  console.log(`🔍 Confirming order with transaction_id: ${transactionId}, reference: ${reference}`);
  
  // Usar la URL correcta del backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  console.log(`🔗 Using API URL: ${API_URL}`);
  
  try {
    // Primero intentar buscar por reference
    console.log(`🔍 Step 1: Searching order by reference: ${reference}`);
    let response = await fetch(`${API_URL}/orders/confirm-by-reference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: reference,
        transaction_id: transactionId,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Order confirmed by reference: ${reference}`, data);
      return;
    }
    
    const error1 = await response.text();
    console.log(`⚠️ Confirm by reference failed (${response.status}): ${error1}`);
    
    // Si no funciona por reference, intentar por transaction_id
    console.log(`🔍 Step 2: Searching order by transaction_id: ${transactionId}`);
    response = await fetch(`${API_URL}/orders/confirm-by-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        reference: reference,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Order confirmed by transaction_id: ${transactionId}`, data);
      return;
    }
    
    const error2 = await response.text();
    console.log(`⚠️ Confirm by transaction failed (${response.status}): ${error2}`);
    
    // Si ninguno funciona, intentar el endpoint original
    console.log(`🔍 Step 3: Trying original confirm endpoint`);
    response = await fetch(`${API_URL}/orders/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        reference: reference,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ All confirmation methods failed. Last error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to confirm order. Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Order confirmed using original endpoint`, data);
    
  } catch (error) {
    console.error(`❌ Error confirming order:`, error);
    throw error;
  }
}

async function confirmSubscription(transactionId: string, reference: string) {
  console.log(`🔍 Confirming subscription with transaction_id: ${transactionId}, reference: ${reference}`);
  
  // Usar la URL correcta del backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  console.log(`🔗 Using API URL: ${API_URL}`);
  
  try {
    // Primero intentar buscar por reference
    console.log(`🔍 Step 1: Searching subscription by reference: ${reference}`);
    let response = await fetch(`${API_URL}/subscriptions/confirm-by-reference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: reference,
        transaction_id: transactionId,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Subscription confirmed by reference: ${reference}`, data);
      return;
    }
    
    const error1 = await response.text();
    console.log(`⚠️ Confirm subscription by reference failed (${response.status}): ${error1}`);
    
    // Si no funciona por reference, intentar por transaction_id
    console.log(`🔍 Step 2: Searching subscription by transaction_id: ${transactionId}`);
    response = await fetch(`${API_URL}/subscriptions/confirm-by-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        reference: reference,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Subscription confirmed by transaction_id: ${transactionId}`, data);
      return;
    }
    
    const error2 = await response.text();
    console.log(`⚠️ Confirm subscription by transaction failed (${response.status}): ${error2}`);
    
    // Si ninguno funciona, intentar el endpoint original
    console.log(`🔍 Step 3: Trying original subscription confirm endpoint`);
    response = await fetch(`${API_URL}/subscriptions/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        reference: reference,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ All subscription confirmation methods failed. Last error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to confirm subscription. Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Subscription confirmed using original endpoint`, data);
    
  } catch (error) {
    console.error(`❌ Error confirming subscription:`, error);
    throw error;
  }
}

async function markPaymentAsFailed(reference: string, transactionId: string, reason: string) {
  // Usar la URL correcta del backend
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  console.log(`🔗 Using API URL: ${API_URL}`);
  console.log(`⚠️ Marking payment as failed: ${transactionId}, reference: ${reference}, reason: ${reason}`);
  
  try {
    const response = await fetch(`${API_URL}/payments/mark-failed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference: reference,
        transaction_id: transactionId,
        reason: reason,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to mark payment as failed (${response.status}): ${errorText}`);
      throw new Error('Failed to mark payment as failed');
    }
    
    const data = await response.json();
    console.log(`✅ Payment marked as failed successfully`, data);
  } catch (error) {
    console.error(`❌ Error marking payment as failed:`, error);
    throw error;
  }
}

