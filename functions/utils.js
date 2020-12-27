require("datejs");
import { getData } from "country-list";

export const defaultOption = (animation) => {
  return {
    loop: true,
    autoplay: true,
    animationData: animation,
  };
};

export const changeQuantity = (newQuantity, limit) => {
  const nq = parseInt(newQuantity);
  if (nq > -1 && nq <= limit) {
    return nq;
  } else {
    return 0;
  }
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

export const removeURLParams = () => {
  const url = new URL(window.location.href);
  const { origin, pathname } = url;
  window.location.replace(origin + pathname);
};

export const getCountryData = () => {
  const data = getData();
  return data.sort((a, b) => a.name.localeCompare(b.name));
};

export const generateCartDescription = (cart) => {
  return cart.map((item) => item.name).join(", ");
};

export const getToday = () => {
  return Date.today();
};

export const getFutureDate = (days) => {
  return Date.today().addDays(days);
};

export const dateParse = (date) => {
  return Date.parse(date).toString("d-MMM-yyyy");
};

export const minBookDate = () => {
  return getToday().add(1).day().toString("yyyy-M-d");
};
