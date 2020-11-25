import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "react-bootstrap/Button";
import ListItemContent from "./ListItemContent";

export default function ListItem({ content }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = (state) => setIsOpen(state);

  return (
    <div>
      <motion.li layout initial={{ borderRadius: 10 }}>
        <div style={{ display: "inline-flex" }}>
          <h5>{content.name}</h5>
        </div>
        <AnimatePresence>
          {isOpen ? (
            <div onClick={() => toggleOpen(false)}>
              <ListItemContent key={content.id} content={content} />
            </div>
          ) : (
            <Button
              style={{ display: "flex" }}
              onClick={() => toggleOpen(true)}
            >
              More Info
            </Button>
          )}
        </AnimatePresence>
      </motion.li>
    </div>
  );
}
