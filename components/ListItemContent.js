import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../config/auth-config";
import { motion } from "framer-motion";
import Button from "react-bootstrap/Button";
import styles from "../styles/Home.module.css";

export default function ListItemContent({ content }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const { description, display_price, id } = content;
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

  return (
    <div>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <p className={styles["p-text"]}>{description}</p>
        <p>{display_price}</p>
      </motion.div>
      <div className={styles["button-group"]}>
        <Button
          className={styles.center}
          onClick={() => router.push(`/contact-form?id=${id}`)}
        >
          Enquire
        </Button>
        <Button
          variant="success"
          className={styles.center}
          onClick={() => router.push(loggedIn ? `/buy?id=${id}` : "/login")}
        >
          Buy
        </Button>
      </div>
    </div>
  );
}
