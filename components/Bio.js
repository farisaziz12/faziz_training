import React from "react";
import FadeIn from "react-fade-in";
import LazyLoad from "react-lazyload";
import { bioContent } from "../content/bioContent";
import styles from "../styles/Home.module.css";

export default function Bio() {
  return (
    <FadeIn className={styles.center} delay={200}>
      <h1>More About Me</h1>
      <div className={styles["bio-card"]}>
        <div>
          <LazyLoad>
            <FadeIn delay={500}>
              <img
                className={styles["bio-img"]}
                src="/images/handstand.jpg"
                alt=""
              />
            </FadeIn>
          </LazyLoad>
        </div>
        <div>
          <p className={styles["p-text"]}>{bioContent}</p>
        </div>{" "}
      </div>
    </FadeIn>
  );
}
