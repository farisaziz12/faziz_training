import React from "react";
import FadeIn from "react-fade-in";
import styles from "../styles/Home.module.css";
import { bioContent, experience } from "../content/bioContent";

export default function Bio() {
  return (
    <FadeIn className={styles.center} delay={200}>
      <h1>More About Me</h1>
      <div className={styles["bio-card"]}>
        <div>
          <img
            className={styles["bio-img"]}
            src="/images/handstand.jpg"
            alt=""
          />
        </div>
        <div>
          <p className={styles["p-text"]}>{bioContent}</p>
        </div>{" "}
      </div>
    </FadeIn>
  );
}
