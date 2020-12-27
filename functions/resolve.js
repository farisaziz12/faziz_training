import {
  BuyButton,
  EnquireButton,
  LinkButton,
  BookButton,
} from "../components/Buttons";

const componentTypes = {
  buy: "buy",
  enquire: "enquire",
  link: "link",
  book: "book",
};

export const componentResolver = (components, ...args) => {
  const resolvedComponents = [];
  components.forEach((component) => {
    switch (component.type) {
      case componentTypes.buy:
        resolvedComponents.push(() => BuyButton(...args));
        break;
      case componentTypes.enquire:
        resolvedComponents.push(() => EnquireButton(...args));
        break;
      case componentTypes.link:
        resolvedComponents.push(() => LinkButton(...args));
        break;
      case componentTypes.book:
        resolvedComponents.push(() => BookButton(...args));
        break;

      default:
        break;
    }
  });

  return resolvedComponents;
};
