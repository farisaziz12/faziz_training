require("datejs");
import groupBy from "lodash.groupby";
import { getData } from "country-list";

// CHECKER FUNCTIONS

export const changeQuantity = (newQuantity, limit) => {
  const nq = parseInt(newQuantity);
  if (nq > -1 && nq <= limit) {
    return nq;
  } else {
    return 0;
  }
};

// DOM/WINDOW FUNCTIONS

export const removeURLParams = () => {
  const url = new URL(window.location.href);
  const { origin, pathname } = url;
  window.location.replace(origin + pathname);
};

// GETTER FUNCTIONS

export const getCountryData = () => {
  const data = getData();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

// RESPONSE GENERATOR FUNCTIONS

export const generateCartDescription = (cart) => {
  return cart.map((item) => item.name).join(", ");
};

export const generateKey = (id) => {
  const ID = id ? id : 1;
  return Math.floor(Math.random() * 10000 * ID);
};

export const generateTotal = (items, multiplicationFactor) => {
  const total = items.reduce((acc, curr) => (curr.price += acc), 0);
  const totalAdjustment = multiplicationFactor ? multiplicationFactor : 1;
  const adjustedTotal = total * totalAdjustment;
  return adjustedTotal;
};

export const generateClassList = (classes) => {
  const classesArr = classes.map((classData) => {
    const { date } = classData;
    return {
      day: dayAndDate(date),
      class: classData,
    };
  });

  return groupClassesByDay(classesArr);
};

export const groupClassesByDay = (classes) => {
  const groupedClassesObj = groupBy(classes, "day");
  const classesArr = [];

  for (const key in groupedClassesObj) {
    if (Object.hasOwnProperty.call(groupedClassesObj, key)) {
      const classesData = groupedClassesObj[key];
      const sortedClasses = classesData.sort(
        (a, b) =>
          Date.parse(a.class.start_time) - Date.parse(b.class.start_time)
      );

      classesArr.push({
        date: key,
        classes: sortedClasses,
      });
    }
  }

  return classesArr;
};

export const defaultOption = (animation) => {
  return {
    loop: true,
    autoplay: true,
    animationData: animation,
  };
};

export const generateDateRangeQuery = (startDate, endDate) => {
  const dates = getDates(startDate, endDate);
  const query = [];

  for (let index = 0; index < dates.length; index++) {
    const date = dates[index];
    if (index === 0) {
      query.push("?_where[date]=" + date);
    } else {
      query.push("_where[date]=" + date);
    }
  }

  return query.join("&");
};

export const getDates = (startDate, endDate) => {
  const dates = [];
  let date = startDate;
  let i = 0;

  while (date !== endDate && i !== 10) {
    dates.push(date);
    date = Date.parse(date).addDays(1).toString("yyyy-MM-dd");
    i++;
  }
  dates.push(Date.parse(date).addDays(1).toString("yyyy-MM-dd"));

  return dates;
};

// DATE AND TIME FUNCTIONS

export const getToday = () => {
  return Date.today();
};

export const getFutureDate = (days) => {
  return Date.today().addDays(days);
};

export const dateParse = (date) => {
  return Date.parse(date).toString("dd-MMM-yyyy");
};

export const getDayName = (date) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayNo = new Date(date).getDay();
  return dayNames[dayNo];
};

export const dayAndDate = (date) => {
  return getDayName(date).slice(0, 3) + " " + new Date(date).toString("dd MMM");
};

export const minBookDate = () => {
  return getToday().add(1).day().toString("yyyy-M-d");
};

export const getDuration = (startTime, endTime) => {
  const timeDiffInSec =
    (Date.parse(endTime).getTime() - Date.parse(startTime).getTime()) / 1000; //seconds

  return timeDiffInSec / 60 + " Min"; // minutes
};

// RENDER FUNCTIONS

export const renderEmptyDiv = () => {
  return <div style={{ display: "none" }}></div>;
};

export const generateClassName = (time, name) => {
  return name + " @ " + new Date(time).toString("HH:mm");
};

export const handleDisplayCapacity = (attending, capacity) => {
  if (attending === capacity) {
    return <strong style={{ color: "red" }}>Class Full</strong>;
  } else {
    return (
      <strong>
        {attending} / {capacity}{" "}
      </strong>
    );
  }
};
