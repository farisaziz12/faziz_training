import React, { useState, useEffect } from "react";
import FadeIn from "react-fade-in";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { generateTotal, generateKey, removeURLParams } from "../functions";
import { getServiceDetails, getCart, updateCart, getUser } from "../cms";
import { post } from "../network";
import styles from "../styles/Home.module.css";

export default function Cart({ serviceId, setOrderId }) {
  const [cart, setCart] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const itemIds = cart?.cart_items
      ? cart.cart_items.map((item) => item.id)
      : [];

    if (serviceId && !itemIds.includes(parseInt(serviceId))) {
      try {
        const service = await getServiceDetails(serviceId);
        const newItem = { service, context: "add" };
        const updatedCart = await updateCart(newItem);

        setCart(updatedCart);
        setLoading(false);
        if (serviceId) {
          removeURLParams();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const savedCart = await getCart();

      setCart(savedCart);
      setLoading(false);
    }
  }, [serviceId]);

  const handleCheckoutClick = async () => {
    const createOrder = async (cartId, userId, savedOrderId) => {
      const response = await post("/api/orders", {
        cartId,
        userId,
        savedOrderId,
      });

      const order = await response.json();
      if (order.id) {
        window.localStorage.setItem("orderId", order.id);
        setOrderId(order.id);
      }
    };

    try {
      if (cart) {
        const user = await getUser();
        const savedOrderId = window.localStorage.getItem("orderId");
        createOrder(cart.id, user.id, parseInt(savedOrderId));
      }
    } catch (error) {
      console.log(error);
      createOrder(cart.id, user.id, undefined);
    }
  };

  const handleRemoveItem = async (service) => {
    const itemToRemove = { service, context: "remove" };
    const updatedCart = await updateCart(itemToRemove);
    setCart(updatedCart);
  };

  return (
    <div>
      <FadeIn delay={650}>
        <h1 style={{ textAlign: "center" }}>
          Cart {cart?.cart_items[0] ? "" : "Empty"}
        </h1>

        <Jumbotron
          fluid
          style={!cart?.cart_items[0] ? { background: "none" } : {}}
        >
          <Container className={styles.jumbotron}>
            {cart?.cart_items[0] ? (
              <>
                <h1>
                  Total:{" "}
                  {cart?.cart_items &&
                    !loading &&
                    generateTotal(cart.cart_items) + " CHF"}
                </h1>
                <ul>
                  {cart &&
                    cart.cart_items?.map((item) => {
                      return (
                        <li
                          key={generateKey(item.id)}
                          className={styles["cart-item"]}
                        >
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveItem(item)}
                          >
                            X
                          </Button>
                          <h6>{item.name}</h6>
                          <h6>{item.display_price}</h6>
                        </li>
                      );
                    })}
                </ul>
                <Button
                  className={styles.center}
                  style={{ marginTop: "5%" }}
                  onClick={handleCheckoutClick}
                  variant="primary"
                  disabled={cart.cart_items[0] ? false : true}
                >
                  Checkout
                </Button>
              </>
            ) : loading ? (
              <Spinner
                className={styles.center}
                animation="border"
                variant="primary"
              />
            ) : (
              <Button
                className={styles.center}
                href="/services"
                variant="primary"
              >
                Browse Services
              </Button>
            )}
          </Container>
        </Jumbotron>
      </FadeIn>
    </div>
  );
}
