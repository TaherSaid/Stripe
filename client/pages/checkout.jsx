import { loadStripe } from "@stripe/stripe-js";
import { Button } from "antd";

export async function getServerSideProps(context) {
  const { StripeId } = context.query;
  return {
    props: { StripeId },
  };
}

export default function Checkout({ StripeId }) {
  const stripePromise = loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`);
  const handleClick = async () => {
    const response = await fetch("./api/checkout/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ StripeId }),
    });
    const { sessionId } = await response.json();

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({ sessionId });
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
