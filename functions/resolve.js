import {
  BuyButton,
  EnquireButton,
  LinkButton,
  PTBookButton,
  ClassBookButton,
} from "../components/Buttons";
import NavItem from "../components/Navigation/NavItem";

const componentTypes = {
  buy: "buy",
  enquire: "enquire",
  link: "link",
  bookPT: "book_pt",
  bookClass: "book_class",
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
      case componentTypes.bookPT:
        resolvedComponents.push(() => PTBookButton(...args));
        break;
      case componentTypes.bookClass:
        resolvedComponents.push(() => ClassBookButton(...args));
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
