import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "react-bootstrap/Button";
import { auth } from "../config/auth-config";
import { resolveButtons } from "../cms";
import ListItemContent from "./ListItemContent";

export default function ListItem({ content, type }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [buttons, setButtons] = useState([]);

  const { id, link, name } = content;

  const toggleOpen = (state) => setIsOpen(state);

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

  return (
    <div>
      <motion.li layout initial={{ borderRadius: 10 }}>
        <div style={{ display: "inline-flex" }}>
          <h5>{name}</h5>
        </div>
        <AnimatePresence>
          {isOpen ? (
            <div>
              <ListItemContent
                type={type}
                key={id}
                content={content}
                toggleOpen={toggleOpen}
                buttons={buttons}
              />
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
