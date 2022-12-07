import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  let price;
  const { courseName, coursePrices } = req.body;
  try {
    const product = await stripe.products.create({
      name: courseName,
    });
    price = await Promise.all(
      coursePrices.map(async (coursePrice) => {
        const stripePrice = await stripe.prices.create({
          unit_amount: coursePrice,
          currency: "usd",
          product: product.id,
        });
        return stripePrice.id;
      })
    );
  } catch (error) {
    res.status(400).json({ error: "Enable to add new product " });
  }
  res.status(200).json({ price });
}
