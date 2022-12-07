import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useQuery, gql } from "@apollo/client";
import { Card, Row, Col, Spin, Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Navbar from "../src/components/navbar";
import ProductCard from "../src/components/cardProduct";

export default function Home() {
  const GET_LOCATIONS = gql`
    query Query {
      courses {
        id
        courseName
        coursePrice
        courseStripeId
        owner {
          id
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_LOCATIONS);

  return (
    <div>
      <Navbar />
      <div className={styles.wrapper}>
        {loading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
            className={styles.alignSpinner}
            size="large"
          />
        ) : (
          <>
            {error ? (
              <Alert
                message="Apollo error"
                description={error.message}
                type="error"
              />
            ) : (
              <Row gutter={[40, 40]}>
                {data?.courses.map((course) => (
                  <Col span={8} key={course.id}>
                    <ProductCard
                      productName={course.courseName}
                      productPrice={course.coursePrice}
                      StripeId={course.courseStripeId}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </div>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
