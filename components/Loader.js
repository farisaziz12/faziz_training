import React from "react";
import Lottie from "react-lottie";
import { defaultOption } from "../functions";
import loadingSpinner from "../lotties/fitness-loading-spinner.json";

export default function Loader() {
  return (
    <div>
      <Lottie
        options={defaultOption(loadingSpinner)}
        height={100}
        width={100}
      />
      <h1>Loading...</h1>
    </div>
  );
}
