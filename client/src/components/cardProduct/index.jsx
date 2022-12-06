import { ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import Image from "next/image";
import React from "react";

const ProductCard = ({ productPrice, productName }) => {
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
        <a href="/checkout" key="checkout">
          <ShoppingCartOutlined />
        </a>,
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
