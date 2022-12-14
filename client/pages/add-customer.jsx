import { Alert, Button, Form, Input, Select } from "antd";
import Navbar from "../src/components/navbar";
import styles from "../styles/Home.module.css";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const { Option } = Select;

const AddCustomer = () => {
  const [message, setMessage] = useState();
  const CREATE_CUSTOMER = gql`
    mutation Mutation(
      $firstName: String
      $lastName: String
      $email: String
      $tel: String
      $role: String
    ) {
      createCustomer(
        firstName: $firstName
        lastName: $lastName
        email: $email
        tel: $tel
        role: $role
      )
    }
  `;
  const [createCustomerAccount] = useMutation(CREATE_CUSTOMER);
  const onFinish = async (e) => {
    try {
      const { data } = await createCustomerAccount({ variables: { ...e } });
      setMessage(data?.createCustomer);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />

      {message && (
        <Alert
          message="Success"
          description={message}
          type="success"
          showIcon
        />
      )}
      <div className={styles.wrapper}>
        <h1>Create new account </h1>
        <Form
          labelCol={{
            flex: "180px",
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
            label="First name"
            name="firstName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="select your gender">
              <Option value="member">Memeber</Option>
              <Option value="expert">Expert</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tel"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "60%" }}>
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddCustomer;
