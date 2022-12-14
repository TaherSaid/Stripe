import React, { Component } from "react";
import styles from "./navbar.module.css";
import { Menu } from "antd";
import Link from "next/link";

function Navbar() {
  return (
    <nav className={styles.menuBar}>
      <div className={styles.logo}>
        <Link href="/">StripeTest</Link>
      </div>
      <div className={styles.menuCon}>
        <Menu mode="horizontal">
          <Menu.Item key="addCourse">
            <Link href="/add-course">Add course</Link>
          </Menu.Item>
          <Menu.Item key="checkoutWithoutProduct">
            <Link href="/checkout-without-product">
              Create a Checkout without products
            </Link>
          </Menu.Item>
          <Menu.Item key="addNewCustomer">
            <Link href="/add-customer">
              Add new customer
            </Link>
          </Menu.Item>
        </Menu>
      </div>
    </nav>
  );
}
export default Navbar;
