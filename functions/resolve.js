import {
  BuyButton,
  EnquireButton,
  LinkButton,
  BookButton,
} from "../components/Buttons";
import NavItem from "../components/Navigation/NavItem";

const componentTypes = {
  buy: "buy",
  enquire: "enquire",
  link: "link",
  book: "book",
  navItem: "nav-item",
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
      case componentTypes.navItem:
        const { name, route, authenticated, hide_for_no_auth } = component;
        resolvedComponents.push(() =>
          NavItem(...args, name, route, authenticated, hide_for_no_auth)
        );
        break;

      default:
        break;
    }
  });

  return resolvedComponents;
};
