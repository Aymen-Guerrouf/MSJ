import crypto from 'crypto';

// Your Chargily Secret Key
const apiSecretKey = 'test_sk_Fje5EhFwyGTGqk4M6et3Jxxxxxxxxxxxx';

export default async (req, res) => {
  const signature = req.get('signature');
  const payload = JSON.stringify(req.body);

  if (!signature) return res.sendStatus(400);

  const computedSignature = crypto.createHmac('sha256', apiSecretKey)
    .update(payload)
    .digest('hex');

  if (computedSignature !== signature) return res.sendStatus(403);

  const event = req.body;

  switch (event.type) {
    case 'checkout.paid':
      const checkout = event.data;
      // TODO: Update your database: mark order as paid
      break;
    case 'checkout.failed':
      const failedCheckout = event.data;
      // TODO: Update your database: mark order as failed
      break;
  }

  res.sendStatus(200); // acknowledge the webhook
};
