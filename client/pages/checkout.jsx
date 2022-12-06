import { loadStripe } from "@stripe/stripe-js";
import { Button } from "antd";

const stripePromise = loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`);

export default function Checkout() {
  const handleClick = async (event) => {
    const { sessionId } = await fetch("./api/checkout/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    }).then((res) => res.json());
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });
  };
  return (
    <div>
      <h1>Checkout</h1>
      <Button type="link" onClick={handleClick}>
        Checkout
      </Button>
    </div>
  );
}
