import { gql, useLazyQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { Button, Form, Input } from "antd";
import React from "react";
import Navbar from "../src/components/navbar";
import styles from "../styles/Home.module.css";

const CheckoutWithoutProduct = () => {
  const stripePromise = loadStripe(
    `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
  );
  const CHECKOUT_SESSION_WITHOUT_PRODUCT = gql`
    query Query($totalPrice: String) {
      checkoutWithoutProducts(totalPrice: $totalPrice)
    }
  `;
  const [checkoutWithoutProduct] = useLazyQuery(
    CHECKOUT_SESSION_WITHOUT_PRODUCT
  );
  const onFinish = async (e) => {
    try {
      const { data } = await checkoutWithoutProduct({
        variables: {
          ...e,
        },
      });
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: data.checkoutWithoutProducts,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className={styles.wrapper}>
        <h1>Use Checkout without creating products and prices in Stripe.</h1>
        <Form
          labelCol={{
            flex: "110px",
          }}
          labelAlign="left"
          labelWrap
          wrapperCol={{
            flex: 1,
          }}
          colon={false}
          onFinish={onFinish}
        >
          <Form.Item
            label="Total price"
            name="totalPrice"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label=" ">
            <Button type="primary" htmlType="submit">
              Checkout
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CheckoutWithoutProduct;
