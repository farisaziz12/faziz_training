import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/auth-config";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import styles from "../styles/Home.module.css";

export default function NavigationBar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(async () => {
    try {
      const user = await auth.getCurrentUser();
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const resp = await auth.signOut();
      if (resp.success) {
        setLoggedIn(false);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
          {loggedIn ? (
            <Nav className="mr-auto" className={styles["nav-container"]}>
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item href="/active-services">
                  Active Services
                </NavDropdown.Item>
              </NavDropdown>
              <Button onClick={handleLogout} variant="outline-secondary">
                Logout
              </Button>
            </Nav>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              variant="outline-primary"
            >
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
