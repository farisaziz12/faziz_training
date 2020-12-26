import React, { useState, useEffect } from "react";
import RevolutCheckout from "@revolut/checkout";
import { useRouter } from "next/router";
import FadeIn from "react-fade-in";
import Jumbotron from "react-bootstrap/Jumbotron";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getCountryData } from "../functions";
import { post } from "../network";
import {
  getUser,
  getOrder,
  handleCompletedOrder,
  handleDeleteCart,
} from "../cms";
import styles from "../styles/Home.module.css";

export default function Checkout({ orderId, setOrderId }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const router = useRouter();

  const finishOrder = async (id) => {
    try {
      const order = await post(`/api/orders/${id}/finish`, {});
      const orderDetails = await order.json();

      window.localStorage.removeItem("orderId");
      await handleCompletedOrder(orderDetails.id);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const order = await getOrder(orderId);
      const { public_id: token } = order.data.payment;
      const RC = await RevolutCheckout(token, "sandbox");

      RC.payWithPopup({
        name: fullName,
        email: email,
        phone: phone,
        billingAddress: {
          countryCode: country,
          region: region,
          city: city,
          streetLine1: addressLine1,
          streetLine2: addressLine2,
          postcode: postalCode,
        },
        onSuccess() {
          finishOrder(order.id);
          setTimeout(RC.destroy, 500);
        },
        onError() {
          setOrderId(undefined);
        },
        onCancel() {
          setOrderId(undefined);
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAutofill = async () => {
    const userInfo = await getUser();
    const { first_name, last_name, email, phone } = userInfo;
    setFullName(first_name + " " + last_name);
    setEmail(email);
    setPhone(phone);
  };

  return (
    <div>
      <FadeIn delay={650}>
        <h1 style={{ textAlign: "center" }}>Checkout</h1>

        <Jumbotron fluid className={styles.jumbotron}>
          <Form onSubmit={handleSubmit} className={styles.checkout}>
            <div>
              <h2>Contact Info</h2>{" "}
              <Button variant="primary" onClick={handleAutofill}>
                Autofill contact
              </Button>
            </div>
            <hr />
            <Form.Group controlId="formBasicName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Smith"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter phone"
              />
            </Form.Group>
            <h2>Billing Address</h2>
            <hr />
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Country</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                as="select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select Country</option>
                {getCountryData().map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBasicRegion">
              <Form.Label>Region</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                required
                placeholder="Region"
              />
            </Form.Group>
            <Form.Group controlId="formBasicCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="City"
              />
            </Form.Group>
            <Form.Group controlId="formBasicAddress1">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                placeholder="Street, house number"
              />
            </Form.Group>
            <Form.Group controlId="formBasicAddress2">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apartment, building"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPostal">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                className={styles["p-text"]}
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                placeholder="Postal Code"
              />
            </Form.Group>
            <Button className={styles.center} variant="primary" type="submit">
              Pay
            </Button>
          </Form>
        </Jumbotron>
      </FadeIn>
    </div>
  );
}
