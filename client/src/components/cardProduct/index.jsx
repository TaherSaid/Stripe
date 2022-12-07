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
      actions={productPrice.map((price, index) => {
        return (
          <Link
            href={{
              pathname: "/checkout",
              query: { StripeId: StripeId[index] },
            }}
            key="checkout"
          >
            {`$ ${price}`}
          </Link>
        );
      })}
    >
      <Card.Meta
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
        title={productName}
      />
    </Card>
  );
};

export default ProductCard;
