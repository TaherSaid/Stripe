import { gql, useQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "antd";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const { StripeId, ownerAccountId } = context.query;
  return {
    props: { StripeId, ownerAccountId },
  };
}

export default function Checkout({ StripeId, ownerAccountId }) {
  const stripePromise = loadStripe(
    `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
  );
  const CHECKOUT_SESSION = gql`
    query Query($stripeId: String, $ownerAccountId: String) {
      checkout(StripeId: $stripeId, ownerAccountId: $ownerAccountId)
    }
  `;

  const CHECKOUT_SESSION_ID = gql`
    query Query($sessionId: String) {
      retrieveCheckoutSession(sessionId: $sessionId)
    }
  `;
  const retrieveCheckoutSession = useQuery(CHECKOUT_SESSION_ID, {
    variables: { sessionId: "sessionId" },
  });
  const { data } = useQuery(CHECKOUT_SESSION, {
    variables: { stripeId: StripeId, ownerAccountId },
  });

  console.log("retrieve checkout session =>", retrieveCheckoutSession.data);
  console.log(
    "retrieve checkout session error =>",
    retrieveCheckoutSession.error
  );

  const handleClick = async () => {
    const stripe = await stripePromise;
    try {
      await stripe.redirectToCheckout({
        sessionId: data?.checkout,
      });
    } catch (error) {
      console.log("checkout error =>", error);
    }
  };

  useEffect(() => {
    console.log("checkout data =>", data);
  }, [data]);

  return (
    <div>
      <h1>Checkout</h1>
      <Button type="link" onClick={handleClick}>
        Checkout
      </Button>
    </div>
  );
}
