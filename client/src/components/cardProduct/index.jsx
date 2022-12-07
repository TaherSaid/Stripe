import { ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ productPrice, productName, StripeId }) => {
  return (
    <Card
      cover={
        <Image
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          width={300}
          height={300}
        />
      }
      actions={[
        <Link
          href={{
            pathname: "/checkout",
            query: { StripeId },
          }}
          key="checkout"
        >
          <ShoppingCartOutlined />
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={productName}
        description={`$ ${productPrice}`}
      />
    </Card>
  );
};

export default ProductCard;
