import { gql, useQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "antd";

export async function getServerSideProps(context) {
  const { StripeId, ownerAccountId } = context.query;
  return {
    props: { StripeId, ownerAccountId },
  };
}

export default function Checkout({ StripeId }) {
  const stripePromise = loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`);
  const CHECKOUT_SESSION = gql`
    query Query($stripeId: String, $ownerAccountId: String) {
      checkout(StripeId: $stripeId, ownerAccountId: $ownerAccountId)
    }
  `;
  const {data} = useQuery(CHECKOUT_SESSION, {
    variables: { stripeId: StripeId, ownerAccountId },
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
