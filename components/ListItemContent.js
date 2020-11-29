import React from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import { motion } from "framer-motion";
import styles from "../styles/Home.module.css";

export default function ListItemContent({ content }) {
  const { description, display_price, id } = content;
  const router = useRouter();
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
      <Button
        className={styles.center}
        onClick={() => router.push(`/contact-form?id=${id}`)}
      >
        Enquire
      </Button>
    </div>
  );
}
