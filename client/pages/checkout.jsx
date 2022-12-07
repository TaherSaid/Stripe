import { loadStripe } from "@stripe/stripe-js";
import { Button } from "antd";

export async function getServerSideProps(context) {
  const { StripeId } = context.query;
  return {
    props: { StripeId },
  };
}
const stripePromise = loadStripe(
  `pk_test_51M9FZvLv1GvWMcZ2SHCVJJo0McI2g7E0q5ur85WH0eJDR8KusMUsBlsOGN11DWJD895UwBKEYnQl7RXipsAE49P500w8inn12T`
);

export default function Checkout({ StripeId }) {
  const handleClick = async (event) => {
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
