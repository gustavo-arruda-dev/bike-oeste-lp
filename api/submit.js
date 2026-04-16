// Vercel Serverless Function — POST /api/submit
// Configure LEADS_WEBHOOK_URL nas variáveis de ambiente do Vercel

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nome, whatsapp, empresa, cidade } = req.body || {};

  if (!nome || !whatsapp || !empresa || !cidade) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
  }

  const lead = {
    nome,
    whatsapp,
    empresa,
    cidade,
    timestamp: new Date().toISOString(),
    source: 'LP Bike Oeste',
  };

  console.log('[LEAD]', JSON.stringify(lead));

  // ── Opcional: webhook (n8n, Zapier, Make) ──
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error('[WEBHOOK ERROR]', err.message);
    }
  }

  return res.status(200).json({ success: true });
};
