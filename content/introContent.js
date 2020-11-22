import benchPress from "../lotties/bench-press.json";
import books from "../lotties/books.json";
import workout from "../lotties/workout.json";

export const introContent = [
  {
    title: "Class Attendances:",
    statNumber: 900,
    plus: true,
    lottie: workout,
    lottieHeight: 130,
    lottieWidth: 130,
  },
  {
    title: "Health & Fitness Certificates:",
    statNumber: 9,
    plus: false,
    lottie: books,
    lottieHeight: 130,
    lottieWidth: 250,
  },
  {
    title: "Hours of Training Experience:",
    statNumber: 2500,
    plus: true,
    lottie: benchPress,
    lottieHeight: 125,
    lottieWidth: 125,
  },
];
