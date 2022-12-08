import { gql, useQuery } from "@apollo/client";
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
  const CHECKOUT_SESSION = gql`
    query Query($stripeId: String) {
      checkout(StripeId: $stripeId)
    }
  `;
  const { data } = useQuery(CHECKOUT_SESSION, {
    variables: { stripeId: StripeId },
  });

  const handleClick = async () => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: data.checkout,
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
