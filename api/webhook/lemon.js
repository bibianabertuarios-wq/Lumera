import crypto from 'crypto';

// Configuración de Supabase (usa service role key, no anon key)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const FOUNDERS_LIMIT = 500;

// CRÍTICO: Deshabilitar body parsing automático de Vercel
export const config = {
  api: {
    bodyParser: false
  }
};

// Helper para leer el body raw
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(data);
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
    // Solo aceptar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('📨 Webhook recibido de Lemon Squeezy');
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));

    // 🔍 DIAGNÓSTICO (puedes quitar esto después)
    console.log('🔍 DIAGNÓSTICO:');
    console.log('🔐 Secret exists:', !!process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
    console.log('🔐 Secret length:', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET?.length);
    console.log('🔐 Secret first 10 chars:', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET?.substring(0, 10));

    try {
        // Leer body raw
        const rawBody = await getRawBody(req);
        console.log('📦 Body recibido (primeros 200 chars):', rawBody.substring(0, 200));

        // Verificar signature
        const signature = req.headers['x-signature'];
        const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
        
        console.log('🔑 Signature:', signature ? 'Presente' : 'Ausente');
        console.log('🔐 Secret:', secret ? 'Presente' : 'Ausente');
        
        if (!signature || !secret) {
            console.error('❌ Falta signature o secret');
            return res.status(401).json({ error: 'Missing signature or secret' });
        }
        
        // Verificar signature con body RAW
        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');
        
        console.log('🔍 Digest calculado:', digest);
        console.log('🔍 Signature recibida:', signature);
        
        if (signature !== digest) {
            console.error('❌ Signature inválida');
            console.error('Body usado para verificar:', rawBody.substring(0, 100));
            return res.status(401).json({ error: 'Invalid signature' });
        }

        console.log('✅ Signature verificada');

        // Parsear JSON DESPUÉS de verificar signature
        const event = JSON.parse(rawBody);
        const eventName = event.meta?.event_name;

        console.log('📋 Evento:', eventName);
        console.log('📄 Event data:', JSON.stringify(event.data, null, 2));

        switch (eventName) {
            case 'subscription_created':
                await handleSubscriptionCreated(event);
                break;
            case 'subscription_updated':
                await handleSubscriptionUpdated(event);
                break;
            case 'subscription_cancelled':
                await handleSubscriptionCancelled(event);
                break;
            case 'subscription_payment_success':
                await handlePaymentSuccess(event);
                break;
            default:
                console.log('ℹ️ Evento no manejado:', eventName);
        }
        
        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Error procesando webhook:', error);
        console.error('Stack:', error.stack);
        return res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Función helper para llamar a Supabase
async function supabaseRequest(endpoint, method = 'POST', body = null) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    
    console.log(`🔗 Supabase ${method} ${endpoint}`);
    console.log('📦 Body:', JSON.stringify(body, null, 2));
    
    const options = {
        method,
        headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const responseText = await response.text();
    
    console.log('📡 Supabase response status:', response.status);
    console.log('📡 Supabase response:', responseText);
    
    if (!response.ok) {
        throw new Error(`Supabase error (${response.status}): ${responseText}`);
    }

    return responseText ? JSON.parse(responseText) : null;
}

// Contar fundadoras actuales
async function countFounders() {
    try {
        const url = `${SUPABASE_URL}/rest/v1/rpc/count_founders`;
        
        console.log('🔢 Contando fundadoras...');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('❌ Error llamando count_founders:', error);
            return 0;
        }

        const count = await response.json();
        console.log('✅ Fundadoras actuales:', count);
        return count || 0;
    } catch (error) {
        console.error('❌ Error contando fundadoras:', error);
        return 0;
    }
}

// CREAR SUSCRIPCIÓN
async function handleSubscriptionCreated(event) {
    const { data } = event;
    
    console.log('🆕 Nueva suscripción:', data.id);
    console.log('📄 Attributes:', JSON.stringify(data.attributes, null, 2));
    
    // Extraer custom data
    const customData = event.meta?.custom_data || {};
    const userId = customData.user_id;
    const planType = customData.plan_type || 'monthly';
    
    console.log('📦 Custom data:', customData);
    
    if (!userId) {
        console.error('❌ No se encontró user_id en custom_data');
        console.error('❌ Meta completo:', event.meta);
        throw new Error('user_id not found in custom_data');
    }

    console.log('👤 Usuario:', userId, 'Plan:', planType);
    
    // Contar fundadoras actuales
    const foundersCount = await countFounders();
    const isFounder = foundersCount < FOUNDERS_LIMIT;
    
    console.log('👥 Fundadoras:', foundersCount, '→ Es fundadora:', isFounder);
    
    // Calcular precio
    const priceInCents = data.attributes.first_subscription_item?.price || 0;
    const price = parseFloat(priceInCents) / 100;
    
    // Preparar datos
    const subscriptionData = {
        user_id: userId,
        lemon_squeezy_subscription_id: data.id.toString(),
        lemon_squeezy_variant_id: data.attributes.variant_id.toString(),
        plan_type: planType,
        plan_price: price,
        currency: data.attributes.currency || 'USD',
        status: data.attributes.status,
        is_founder: isFounder,
        current_period_start: data.attributes.created_at,
        current_period_end: data.attributes.renews_at
    };

    console.log('💾 Guardando en Supabase...');
    console.log('📦 Data a guardar:', subscriptionData);
    
    // Guardar en Supabase
    const result = await supabaseRequest('subscriptions', 'POST', subscriptionData);
    
    console.log('✅ Suscripción guardada:', result);
}

// ACTUALIZAR SUSCRIPCIÓN
async function handleSubscriptionUpdated(event) {
    const { data } = event;
    
    console.log('🔄 Actualizando suscripción:', data.id);
    
    const updateData = {
        status: data.attributes.status,
        current_period_start: data.attributes.created_at,
        current_period_end: data.attributes.renews_at,
        updated_at: new Date().toISOString()
    };

    console.log('💾 Datos a actualizar:', updateData);
    
    const result = await supabaseRequest(
        `subscriptions?lemon_squeezy_subscription_id=eq.${data.id}`,
        'PATCH',
        updateData
    );
    
    console.log('✅ Suscripción actualizada:', result);
}

// CANCELAR SUSCRIPCIÓN
async function handleSubscriptionCancelled(event) {
    const { data } = event;
    
    console.log('❌ Cancelando suscripción:', data.id);
    
    const updateData = {
        status: 'cancelled',
        updated_at: new Date().toISOString()
    };

    const result = await supabaseRequest(
        `subscriptions?lemon_squeezy_subscription_id=eq.${data.id}`,
        'PATCH',
        updateData
    );
    
    console.log('✅ Suscripción cancelada:', result);
}

// PAGO EXITOSO
async function handlePaymentSuccess(event) {
    const { data } = event;
    
    console.log('💰 Pago exitoso para suscripción:', data.attributes.subscription_id);
    
    const updateData = {
        current_period_end: data.attributes.renews_at,
        updated_at: new Date().toISOString()
    };

    const result = await supabaseRequest(
        `subscriptions?lemon_squeezy_subscription_id=eq.${data.attributes.subscription_id}`,
        'PATCH',
        updateData
    );
    
    console.log('✅ Fechas actualizadas:', result);
}

