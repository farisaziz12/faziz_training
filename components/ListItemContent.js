import React, { useState, useEffect } from "react";
import { auth } from "../config/auth-config";
import { resolveButtons } from "../cms";
import { generateKey } from "../functions";
import { motion } from "framer-motion";
import styles from "../styles/Home.module.css";

export default function ListItemContent({ content }) {
  const { description, display_price, id } = content;

  const [buttons, setButtons] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

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

  useEffect(() => {
    resolveButtons(id, loggedIn).then((resolvedButtons) =>
      setButtons(resolvedButtons, ...buttons)
    );
  }, [loggedIn]);

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
        {buttons.map((Button) => (
          <Button key={generateKey()} />
        ))}
      </div>
    </div>
  );
}
