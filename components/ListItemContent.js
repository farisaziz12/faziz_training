import React from "react";
import { generateKey } from "../functions";
import { motion } from "framer-motion";
import {
  dateParse,
  renderEmptyDiv,
  getDuration,
  handleDisplayCapacity,
} from "../functions";
import styles from "../styles/Home.module.css";

export default function ListItemContent({
  content,
  type,
  toggleOpen,
  buttons,
}) {
  const {
    description,
    display_price,
    activated_date,
    expiration_date,
    amount_left,
  } = content;

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
    } else if (type === "classes") {
      const {
        start_time,
        end_time,
        location,
        coach,
        capacity,
        athletes,
      } = content.class;
      return (
        <div>
          <strong>Coach: </strong>
          <p className={styles["p-text"]}>{coach?.name}</p>
          <strong>Location: </strong>
          <p className={styles["p-text"]}>{location?.name}</p>
          <p className={styles["p-text"]}>
            <strong>Duration: </strong>
            {getDuration(start_time, end_time)}
          </p>
          {handleDisplayCapacity(athletes.length, capacity)}
        </div>
      );
    } else {
      renderEmptyDiv();
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
