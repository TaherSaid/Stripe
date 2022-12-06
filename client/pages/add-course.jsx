import React from "react";
import { Button, Form, Input } from "antd";
import styles from "../styles/Home.module.css";
import { gql, useMutation } from "@apollo/client";
import Navbar from "../src/components/navbar";

const AddCourse = () => {
  const ADD_TODO = gql`
    mutation Mutation($courseName: String, $coursePrice: String) {
      createCourse(courseName: $courseName, coursePrice: $coursePrice) {
        id
        courseName
        coursePrice
      }
    }
  `;
  const [addTodo, { data, loading, error }] = useMutation(ADD_TODO);
  const onFinish = (e) => {
    try {
      console.log(e);
      addTodo({
        variables: { courseName: e.courseName, coursePrice: e.coursePrice },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Navbar />

      <div className={styles.wrapper}>
        <h1>Add new course</h1>
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
            label="Course name"
            name="courseName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Course price"
            name="coursePrice"
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
              add
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddCourse;
