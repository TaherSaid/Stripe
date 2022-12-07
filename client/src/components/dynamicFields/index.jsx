import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Input } from "antd";

function DynamicField() {
  return (
    <Form.List name="coursePrices">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <div key={field.key}>
                <Divider>Course prise {index + 1}</Divider>
                <Form.Item
                  name={[index, "coursPrice"]}
                  label={`Course prise ${index}`}
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Course price" />
                </Form.Item>

                {fields.length > 1 && (
                  <Button
                    type="danger"
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove Above Field
                  </Button>
                )}
              </div>
            ))}
            <Divider />
            <Form.Item>
              <Button
                type="ghost"
                onClick={() => add()}
                style={{ width: "60%" }}
              >
                <PlusOutlined /> Add a price
              </Button>
            </Form.Item>
          </div>
        );
      }}
    </Form.List>
  );
}

export default DynamicField;
