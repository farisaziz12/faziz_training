import React, { useState, useEffect } from "react";
import { auth } from "../config/auth-config";
import { resolveButtons } from "../cms";
import { generateKey } from "../functions";
import { motion } from "framer-motion";
import { dateParse } from "../functions";
import styles from "../styles/Home.module.css";

export default function ListItemContent({ content, type, toggleOpen }) {
  const {
    description,
    display_price,
    id,
    service_id,
    activated_date,
    expiration_date,
    link,
    amount_left,
  } = content;

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
    resolveButtons(id, loggedIn, type, link).then((resolvedButtons) =>
      setButtons(resolvedButtons, ...buttons)
    );
  }, [loggedIn]);

  const renderDetails = () => {
    if (type === "service") {
      return (
        <>
          <p className={styles["p-text"]}>{description}</p>
          <p>{display_price}</p>
        </>
      );
    } else if (type === "active-service") {
      return (
        <div>
          <strong>Activated Date: </strong>
          <p className={styles["p-text"]}>{dateParse(activated_date)}</p>
          <strong>Expiration Date: </strong>
          <p className={styles["p-text"]}>{dateParse(expiration_date)}</p>
          <p className={styles["p-text"]}>
            <strong>Remaining: </strong>
            {amount_left}
          </p>
        </div>
      );
    } else {
      return <div style={{ display: "none" }}></div>;
    }
  };

  return (
    <div>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => toggleOpen(false)}
      >
        {renderDetails()}
      </motion.div>
      <div className={styles["button-group"]}>
        {buttons.map((Button) => (
          <Button key={generateKey()} />
        ))}
      </div>
    </div>
  );
}
