import crypto from 'crypto';

// Configuración de Supabase (usa service role key, no anon key)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const FOUNDERS_LIMIT = 500;

export default async function handler(req, res) {
    // Solo aceptar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('📨 Webhook recibido de Lemon Squeezy');
    console.log('📋 Headers recibidos:', JSON.stringify(req.headers, null, 2));

    // Verificar signature de Lemon Squeezy (seguridad)
    // Lemon Squeezy puede enviar el header como 'X-Signature' o 'x-signature'
    const signature = req.headers['x-signature'] || req.headers['X-Signature'];
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    
    console.log('🔑 Signature recibida:', signature ? 'Presente' : 'Ausente');
    console.log('🔐 Secret configurado:', secret ? 'Presente' : 'Ausente');
    
    if (!signature || !secret) {
        console.error('❌ Falta signature o secret');
        console.error('Signature:', signature);
        console.error('Secret exists:', !!secret);
        return res.status(401).json({ error: 'Missing signature or secret' });
    }
    
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(req.body)).digest('hex');
    
    console.log('🔍 Digest calculado:', digest);
    console.log('🔍 Signature recibida:', signature);
    
    if (signature !== digest) {
        console.error('❌ Signature inválida');
        return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('✅ Signature verificada');

    const event = req.body;
    const eventName = event.meta?.event_name;

    console.log('📋 Evento:', eventName);

    try {
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
        return res.status(500).json({ error: error.message });
    }
}

// Función helper para llamar a Supabase
async function supabaseRequest(endpoint, method = 'POST', body = null) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    
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
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Supabase error: ${error}`);
    }

    return response.json();
}

// Contar fundadoras actuales
async function countFounders() {
    try {
        const url = `${SUPABASE_URL}/rest/v1/rpc/count_founders`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_SERVICE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error llamando count_founders');
            return 0;
        }

        const count = await response.json();
        return count || 0;
    } catch (error) {
        console.error('Error contando fundadoras:', error);
        return 0;
    }
}

// CREAR SUSCRIPCIÓN
async function handleSubscriptionCreated(event) {
    const { data } = event;
    
    console.log('🆕 Nueva suscripción:', data.id);
    
    // Extraer custom data (user_id y plan_type del checkout)
    const customData = data.attributes.first_subscription_item?.custom_data || {};
    const userId = customData.user_id;
    const planType = customData.plan_type || 'monthly';
    
    if (!userId) {
        console.error('❌ No se encontró user_id en custom_data');
        return;
    }

    console.log('👤 Usuario:', userId, 'Plan:', planType);
    
    // Contar fundadoras actuales
    const foundersCount = await countFounders();
    const isFounder = foundersCount < FOUNDERS_LIMIT;
    
    console.log('👥 Fundadoras actuales:', foundersCount, '→ Es fundadora:', isFounder);
    
    // Calcular precio (viene en centavos)
    const priceInCents = data.attributes.first_subscription_item?.price || 0;
    const price = parseFloat(priceInCents) / 100;
    
    // Preparar datos para insertar
    const subscriptionData = {
        user_id: userId,
        lemon_squeezy_subscription_id: data.id.toString(),
        lemon_squeezy_variant_id: data.attributes.variant_id.toString(),
        plan_type: planType,
        plan_price: price,
        currency: data.attributes.currency_code || 'USD',
        status: data.attributes.status,
        is_founder: isFounder,
        current_period_start: data.attributes.created_at,
        current_period_end: data.attributes.renews_at
    };

    console.log('💾 Guardando en Supabase...');
    
    // Guardar en Supabase
    await supabaseRequest('subscriptions', 'POST', subscriptionData);
    
    console.log('✅ Suscripción guardada exitosamente');
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

    console.log('💾 Actualizando en Supabase...');
    
    // Actualizar en Supabase
    await supabaseRequest(
        `subscriptions?lemon_squeezy_subscription_id=eq.${data.id}`,
        'PATCH',
        updateData
    );
    
    console.log('✅ Suscripción actualizada');
}

// CANCELAR SUSCRIPCIÓN
async function handleSubscriptionCancelled(event) {
    const { data } = event;
    
    console.log('❌ Cancelando suscripción:', data.id);
    
    const updateData = {
        status: 'cancelled',
        updated_at: new Date().toISOString()
    };

    console.log('💾 Actualizando en Supabase...');
    
    // Actualizar en Supabase
    await supabaseRequest(
        `subscriptions?lemon_squeezy_subscription_id=eq.${data.id}`,
        'PATCH',
        updateData
    );
    
    console.log('✅ Suscripción cancelada');
}

// PAGO EXITOSO
async function handlePaymentSuccess(event) {
    const { data } = event;
    
    console.log('💰 Pago exitoso para suscripción:', data.attributes.subscription_id);
    
    // Actualizar fecha de renovación
    const updateData = {
        current_period_end: data.attributes.renews_at,
        updated_at: new Date().toISOString()
    };

    await supabaseRequest(
        `subscriptions?lemon_squeezy_subscription_id=eq.${data.attributes.subscription_id}`,
        'PATCH',
        updateData
    );
    
    console.log('✅ Fechas actualizadas');
}
