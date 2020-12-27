import React, { useState, useEffect } from "react";
import { Transition, animated } from "react-spring/renderprops.cjs";
import { Zoom } from "react-slideshow-image";
import Lottie from "react-lottie";
import Plx from "react-plx";
import FadeIn from "react-fade-in";
import LazyLoad from "react-lazyload";
import Card from "react-bootstrap/Card";
import IntroCard from "../components/IntroCard";
import Bio from "./Bio";
import { introContent } from "../content/introContent";
import { defaultOption } from "../functions";
import { introParallaxData } from "../content/parallaxData";
import { testimonials } from "../content/testimonials";
import downArrow from "../lotties/down-arrow.json";
import styles from "../styles/Home.module.css";
import "react-slideshow-image/dist/styles.css";

export default function Intro({ showIntro }) {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowInfo(true);
    }, 2000);
  }, []);

  return (
    <div>
      <Plx parallaxData={introParallaxData}>
        <Transition
          native
          items={true}
          from={{ overflow: "hidden", height: 0 }}
          enter={[{ height: "auto" }]}
          leave={{ height: 0 }}
        >
          {(show) =>
            show &&
            ((props) => (
              <animated.div style={props}>
                <h1 style={{ textAlign: "center" }}>Train with me</h1>
                <FadeIn delay={400}>
                  <Zoom
                    autoplay={true}
                    arrows={false}
                    duration={12000}
                    scale={0.4}
                    className={styles.slider}
                  >
                    {testimonials.map((testimonial) => (
                      <Card body>
                        <div className={styles["testimonial-card"]}>
                          <p className={styles.quote}>"{testimonial.quote}"</p>
                          <h6 className={styles["client-name"]}>
                            -{testimonial.client}
                          </h6>
                        </div>
                      </Card>
                    ))}
                  </Zoom>
                </FadeIn>
                <Lottie
                  options={defaultOption(downArrow)}
                  height={50}
                  width={50}
                />
              </animated.div>
            ))
          }
        </Transition>
        <LazyLoad once>
          <FadeIn className={styles.center} delay={750}>
            <img
              className={styles["profile-img"]}
              alt=""
              src="/images/faziz-training.jpg"
            />
            <h1>Faris Aziz</h1>
          </FadeIn>
        </LazyLoad>
        <div className={styles["intro-container"]}>
          {introContent.map((content) => (
            <IntroCard
              key={content.title}
              showInfo={showInfo}
              showIntro={showIntro}
              content={content}
            />
          ))}
        </div>
        {showIntro && (
          <LazyLoad once>
            <Bio />
          </LazyLoad>
        )}
      </Plx>
    </div>
  );
}
