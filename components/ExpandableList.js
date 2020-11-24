import React from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import ListItem from "./ListItem";

export default function ExpandableList({ list, listTitle }) {
  return (
    <div>
      <h1 style={{ marginTop: "8%" }}>{listTitle}</h1>
      <AnimateSharedLayout>
        <motion.ul layout initial={{ borderRadius: 25 }}>
          {list.map((item) => (
            <ListItem key={item.id} content={item} />
          ))}
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  );
}
