import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1M9Fv5Lv1GvWMcZ2pN67828g",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3001/checkout",
  });
  res.status(200).json({ sessionId: session.id });
}
