import React from "react";
import { Button, Form, Input } from "antd";
import Navbar from "../src/components/navbar";
import { loadStripe } from "@stripe/stripe-js";
import styles from "../styles/Home.module.css";

const CheckoutWithoutProduct = () => {
  const stripePromise = loadStripe(`${process.env.STRIPE_PUBLIC_KEY}`);
  const onFinish = async (e) => {
    try {
      const res = await fetch("./api/checkout-without-product/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...e }),
      });
      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
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
