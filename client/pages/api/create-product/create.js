import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  let price;
  try {
    const product = await stripe.products.create({
      name: req.body.courseName,
    });
    price = await stripe.prices.create({
      unit_amount: req.body.coursePrice,
      currency: "usd",
      product: product.id,
    });
  } catch (error) {
    res.status(400).json({ error: "enable to add new product " });
  }
  res.status(200).json({ priceId: price.id });
}
