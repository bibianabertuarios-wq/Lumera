const signature = req.headers['x-signature'];
const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

if (!signature || !secret) {
  return res.status(401).json({ error: 'Missing signature or secret' });
}

const rawBodyBuffer = await getRawBody(req);

const digest = crypto
  .createHmac('sha256', secret)
  .update(rawBodyBuffer)
  .digest();

const signatureBuffer = Buffer.from(signature, 'hex');

if (
  signatureBuffer.length !== digest.length ||
  !crypto.timingSafeEqual(signatureBuffer, digest)
) {
  console.error('❌ Invalid signature');
  return res.status(401).json({ error: 'Invalid signature' });
}

const event = JSON.parse(rawBodyBuffer.toString('utf8'));

