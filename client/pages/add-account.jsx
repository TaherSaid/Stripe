import { gql, useMutation } from "@apollo/client";
import { Alert, Button, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../src/components/navbar";
import styles from "../styles/Home.module.css";

const { Option } = Select;

const AddAccount = () => {
  const [message, setMessage] = useState();
  const router = useRouter();

  const CREATE_ACCOUNT = gql`
    mutation Mutation(
      $firstName: String
      $lastName: String
      $email: String
      $tel: String
      $role: String
      $businessType: String
    ) {
      createAccount(
        firstName: $firstName
        lastName: $lastName
        email: $email
        tel: $tel
        role: $role
        businessType: $businessType
      )
    }
  `;
  const [createAccount] = useMutation(CREATE_ACCOUNT);
  const onFinish = async (e) => {
    try {
      const { data } = await createAccount({ variables: { ...e } });
      router.push(data.createAccount);
        setMessage("Your account created successfully");
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
            label="Account type"
            rules={[
              {
                required: true,
                message: "Please select account type!",
              },
            ]}
          >
            <Select placeholder="select account type">
              <Option value="member">Memeber</Option>
              <Option value="expert">Expert</Option>
            </Select>
          </Form.Item>

          {/* business type it can be : 
                - individual
                - company
                - non_profit
                - government_entity (US only) */}
          <Form.Item
            name="businessType"
            label="Business ype"
            rules={[
              {
                required: true,
                message: "Please select your business type!",
              },
            ]}
          >
            <Select placeholder="select your business type">
              <Option value="individual">Individual</Option>
              <Option value="company">Company</Option>
              <Option value="non_profit">Non profit</Option>
              <Option value="government_entity">
                Government entity (Available only in US)
              </Option>
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

export default AddAccount;
