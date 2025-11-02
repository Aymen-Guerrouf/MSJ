//we will use the api chargily key for the payment
import fetch from 'node-fetch';
import config from '../config/index.js';

export const createCheckout = async (req, res) => {
  try {
    const { amount } = req.body; // drahm yb3thhom mn front
    console.log(req.body, config.CHARGILY_API_KEY);

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.CHARGILY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'dzd',
        success_url: 'https://your-cool-website.com/payments/success',
      }),
    };
    console.log(options.body);

    const response = await fetch('https://pay.chargily.net/test/api/v2/checkouts', options);
    const data = await response.json();

    res.json(data); // send payment link / info back to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};
