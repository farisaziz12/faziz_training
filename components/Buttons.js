import React from "react";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export const EnquireButton = (loggedInState, id) => {
  const router = useRouter();
  return (
    <Button
      className={styles.center}
      onClick={() => router.push(`/contact-form?id=${id}`)}
    >
      Enquire
    </Button>
  );
};

export const BuyButton = (loggedInState, id) => {
  const router = useRouter();
  return (
    <Button
      variant="success"
      className={styles.center}
      onClick={() => router.push(loggedInState ? `/buy?id=${id}` : "/login")}
    >
      Buy
    </Button>
  );
};
