import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "react-bootstrap/Button";
import { auth } from "../config/auth-config";
import { resolveButtons } from "../cms";
import { generateClassName, generateKey } from "../functions";
import ListItemContent from "./ListItemContent";

export default function ListItem({ content, type }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [buttons, setButtons] = useState([]);

  const { link } = content;

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
    const id = type === "classes" ? content.class.id : content.id;

    resolveButtons(id, loggedIn, type, link).then((resolvedButtons) =>
      setButtons(resolvedButtons, ...buttons)
    );
  }, [loggedIn]);

  const renderName = (data) => {
    if (type === "classes") {
      const { start_time, name } = data.class;

      const time = Date.parse(start_time);

      return generateClassName(time, name);
    } else {
      return data.name;
    }
  };

  return (
    <div>
      <motion.li layout initial={{ borderRadius: 10 }}>
        <div style={{ display: "inline-flex" }}>
          <h5>{renderName(content)}</h5>
        </div>
        <AnimatePresence>
          {isOpen ? (
            <div>
              <ListItemContent
                type={type}
                key={generateKey()}
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
