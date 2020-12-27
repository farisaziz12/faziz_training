import isEmpty from "lodash.isempty";
import { get, post, put, deleteReq } from "../network";
import { componentResolver, getToday, getFutureDate } from "../functions";
import { auth } from "../config/auth-config";
import { url, paths } from "./network";

export const getServices = async () => {
  try {
    const resp = await fetch(url + paths.serviceCategories);
    return resp.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getServiceDetails = async (id) => {
  try {
    const resp = await fetch(url + paths.services + `/${id}`);
    return resp.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getActiveServiceDetails = async (id) => {
  try {
    const resp = await fetch(url + paths.activeServices + `/${id}`);
    return resp.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const resolveButtons = (id, loggedInState, type, link) => {
  try {
    if (type === "service") {
      return getServiceDetails(id).then((resp) => {
        return componentResolver(resp.buttons, loggedInState, id, link);
      });
    } else if (type === "active-service") {
      return getActiveServiceDetails(id).then((resp) => {
        return componentResolver(resp.buttons, loggedInState, id, link);
      });
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const signUpAthlete = (
  firstName,
  lastName,
  email,
  phoneNo,
  birthdate
) => {
  return post(url + paths.athletes, {
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone: phoneNo,
    birthdate: birthdate,
  });
};

export const getUser = async () => {
  try {
    const user = await auth.getCurrentUser();
    const userInfo = await get(url + paths.getAthleteWithEmail + user.email);
    return userInfo;
  } catch (error) {
    console.log(error);
  }
};

export const getOrder = async (id) => {
  try {
    const order = await get(url + paths.orders + "/" + id);
    return order;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const getCart = async () => {
  try {
    const userInfo = await getUser();
    if (userInfo) {
      const { cart } = userInfo;

      return cart;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getServiceIds = (item, prevCart) => {
  if (prevCart) {
    if (item.context === "add") {
      const prevCartIds = prevCart.cart_items.map((item) => item.id);
      const currCartId = item.service.id;
      if (!prevCartIds.includes(currCartId)) {
        prevCartIds.push(currCartId);
      }
      return prevCartIds;
    } else if (item.context === "remove") {
      const updatedCartIds = prevCart.cart_items
        .map((prevItem) => prevItem.id)
        .filter((prevItemId) => prevItemId !== item.service.id);

      return updatedCartIds;
    }
  } else {
    return [item.service.id];
  }
};

export const updateCart = async (item) => {
  const prevCart = await getCart();

  if (!isEmpty(prevCart)) {
    const newCartData = {
      cart_items: getServiceIds(item, prevCart),
    };
    const updatedCart = await put(
      url + paths.carts + "/" + prevCart.id,
      newCartData
    );

    return updatedCart;
  } else {
    try {
      const user = await auth.getCurrentUser();
      const createdCart = await post(url + paths.carts, {
        cart_items: getServiceIds(item),
      });
      const newCart = await createdCart.json();
      if (user) {
        let userInfo = await get(url + paths.getAthleteWithEmail + user.email);
        const { id } = userInfo;

        userInfo = await put(url + paths.athletes + "/" + id, {
          cart: newCart.id,
        });

        if (userInfo.cart) {
          return newCart;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};

export const handleCompletedOrder = async (id) => {
  try {
    const order = await getOrder(id);
    const { data, athlete: user } = order;
    await activateServices(data.cart.cart_items, user.id);
    await handleDeleteCart(data.cart.id);
  } catch (error) {
    console.error(error);
  }
};

export const activateServices = async (services, userId) => {
  try {
    services.map(async (service) => {
      const activatedService = await post(url + paths.activeServices, {
        service: service.id,
        activated_date: getToday(),
        expiration_date: getFutureDate(service.validity_period),
        amount_left: service.amount,
        athlete: userId,
      });
      const activatedServiceDetails = await activatedService.json();
      return activatedServiceDetails.id;
    });
  } catch (error) {
    console.error(error);
  }
};

export const handleDeleteCart = async (cartId) => {
  try {
    const deletedCart = await deleteReq(url + paths.carts, cartId);
    return deletedCart;
  } catch (error) {
    console.error(error);
  }
};

export const getActiveServices = async () => {
  try {
    const user = await getUser();
    const activeServices = user.active_services.map((activeService) => {
      const service_id = activeService.service.id;
      delete activeService.service.id;
      const spreadActiveService = {
        ...activeService,
        ...activeService.service,
        service_id,
      };
      delete spreadActiveService.service;
      return spreadActiveService;
    });

    return activeServices;
  } catch (error) {
    console.log(error);
    return [];
  }
};
