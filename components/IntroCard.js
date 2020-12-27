import React from "react";
import { Spring, animated, interpolate } from "react-spring/renderprops.cjs";
import Lottie from "react-lottie";
import { RECTANGLE, TRIANGLE } from "../content/shapes";
import { defaultOption } from "../functions";

const styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    willChange: "background",
  },
  shape: { width: 300, height: 300, willChange: "transform" },
};

export default function IntroCard({ showIntro, showInfo, content }) {
  return (
    <Spring
      native
      from={{ fill: "black" }}
      to={{
        fill: showIntro ? "#add8e6" : "#F0F0F0",
        rotate: showIntro ? "0deg" : "180deg",
        scale: showIntro ? 1.05 : 0.3,
        shape: showIntro ? RECTANGLE : TRIANGLE,
      }}
    >
      {({ toggle, backgroundColor, fill, rotate, scale, shape }) => (
        <animated.div style={{ ...styles.container, backgroundColor }}>
          {showIntro && (
            <div
              style={{
                textAlign: "center",
                position: "absolute",
                zIndex: "1",
                color: "black",
                maxWidth: "290px",
              }}
            >
              {showInfo && (
                <>
                  <h2>{content.title}</h2>
                  <Spring
                    from={{ number: 0 }}
                    to={{ number: content.statNumber }}
                  >
                    {(props) => (
                      <h1>
                        {props.number.toFixed(0)}
                        {content.plus && "+"}
                      </h1>
                    )}
                  </Spring>

                  <Lottie
                    options={defaultOption(content.lottie)}
                    height={content.lottieHeight}
                    width={content.LottieWidth}
                  />
                </>
              )}
            </div>
          )}
          <animated.svg
            style={{
              ...styles.shape,
              fill,
              transform: interpolate(
                [rotate, scale],
                (r, s) => `rotate3d(0,1,0,${r}) scale(${s})`
              ),
            }}
            version="1.1"
            viewBox="0 0 400 400"
          >
            <g style={{ cursor: "pointer" }} fillRule="evenodd">
              <animated.path id="path-1" d={shape} />
            </g>
          </animated.svg>
        </animated.div>
      )}
    </Spring>
  );
}
