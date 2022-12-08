import { gql, useMutation } from "@apollo/client";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import DynamicField from "../src/components/dynamicFields";
import Navbar from "../src/components/navbar";
import styles from "../styles/Home.module.css";

const AddCourse = () => {
  const router = useRouter();
  const ADD_COURSE = gql`
    mutation Mutation($courseName: String, $coursePrice: [String]) {
      createCourse(courseName: $courseName, coursePrice: $coursePrice) {
        id
        courseName
        coursePrice
      }
    }
  `;
  const [addTodo] = useMutation(ADD_COURSE);
  const onFinish = (e) => {
    try {
      const coursePrices = e?.coursePrices?.map((coursePrise) => {
        return coursePrise.coursPrice;
      });
      addTodo({
        variables: {
          courseName: e.courseName,
          coursePrice: coursePrices,
        },
      }).then(() => {
        router.push("/");
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
          <DynamicField />
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

export default AddCourse;
