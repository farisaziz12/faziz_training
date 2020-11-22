import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import styles from "../styles/Home.module.css";

export default function NavigationBar() {
  const router = useRouter();

  return (
    <div style={{ zIndex: "1" }} className={styles.navbar}>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>FAZIZ TRAINING</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/services">Services</Nav.Link>
          </Nav>
          <Button variant="outline-primary">Login</Button>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
