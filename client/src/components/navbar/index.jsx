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
          <Menu.Item key="mail">
            <a href="/add-course">Add course</a>
          </Menu.Item>
        </Menu>
      </div>
    </nav>
  );
}
export default Navbar;
