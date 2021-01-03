import React, { useState, useEffect } from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import { generateKey } from "../functions";
import ListItem from "./ListItem";
import styles from "../styles/Home.module.css";

export default function ExpandableList({ list, listTitle, type }) {
  return (
    <div>
      <h1 style={{ marginTop: "8%" }}>{listTitle}</h1>
      <AnimateSharedLayout>
        <motion.ul layout initial={{ borderRadius: 25 }}>
          {list ? (
            list.map((item) => (
              <ListItem key={generateKey()} content={item} type={type} />
            ))
          ) : (
            <h2 className={styles.center} style={{ color: "black" }}>
              None
            </h2>
          )}
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  );
}
