import { BuyButton, EnquireButton } from "../components/Buttons";

const componentTypes = {
  buy: "buy",
  enquire: "enquire",
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

      default:
        break;
    }
  });

  return resolvedComponents;
};
