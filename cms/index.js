import isEmpty from "lodash.isempty";
import { get, post, put, deleteReq } from "../network";
import {
  componentResolver,
  getToday,
  getFutureDate,
  generateDateRangeQuery,
  generateClassList,
} from "../functions";
import { auth } from "../config/auth-config";
import { url, paths } from "./network";

// CLASSES

export const getClasses = async (startDate, endDate) => {
  try {
    const query = generateDateRangeQuery(startDate, endDate);
    const resp = await get(url + paths.classes + query);
    return resp;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getClassDetails = async (id) => {
  try {
    const resp = await get(url + paths.classes + `/${id}`);
    return resp;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const checkBooking = async (classId) => {
  try {
    const athlete = await getUser();
    const classDetails = await getClassDetails(classId);
    const attendingAthleteIds = classDetails.athletes.map(
      (athlete) => athlete.id
    );
    return attendingAthleteIds.includes(athlete.id);
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const checkClassPasses = async () => {
  const athlete = await getUser();

  const passes = athlete.active_services.filter(
    (activeService) =>
      activeService.service.type === "class" && activeService.amount_left > 0
  );

  const reimbursablePasses = athlete.active_services.filter(
    (activeService) =>
      activeService.service.type === "class" && activeService.amount_left >= 0
  );

  if (passes[0]) {
    return {
      available: !!passes,
      activeServiceId: passes[0].id,
      amount_left: passes[0].amount_left,
    };
  } else if (reimbursablePasses[0]) {
    return {
      available: false,
      activeServiceId: reimbursablePasses[0].id,
      amount_left: reimbursablePasses[0].amount_left,
    };
  } else {
    return { available: false, activeServiceId: null, amount_left: 0 };
  }
};

export const checkIfClassFull = async (classId) => {
  const classInfo = await getClassDetails(classId);
  const { athletes, capacity } = classInfo;
  const isFull = athletes.length >= capacity ? true : false;

  return isFull;
};

export const handleClass = async (classId, command) => {
  try {
    const athlete = await getUser();
    const classInfo = await getClassDetails(classId);
    let attendingIds = classInfo.athletes.map((athlete) => athlete.id);
    const passes = await checkClassPasses();

    if (command === "book") {
      if (!attendingIds.includes(athlete.id) && passes.available) {
        attendingIds.push(athlete.id);

        await put(url + paths.activeServices + `/${passes.activeServiceId}`, {
          amount_left: (passes.amount_left -= 1),
        });
      }
    } else if (command === "cancel") {
      attendingIds = attendingIds.filter(
        (athleteId) => athleteId !== athlete.id
      );

      await put(url + paths.activeServices + `/${passes.activeServiceId}`, {
        amount_left: (passes.amount_left += 1),
      });
    }

    const booking = await put(url + paths.classes + `/${classId}`, {
      athletes: attendingIds,
    });

    return booking;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUpcomingAthleteClasses = (classes, userId) => {
  const filteredClasses = classes.filter((classInfo) =>
    classInfo.athletes.map((athlete) => athlete.id).includes(userId)
  );
  return generateClassList(filteredClasses);
};

// SERVICES

export const getServices = async () => {
  try {
    const resp = await get(url + paths.serviceCategories);
    return resp;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getServiceDetails = async (id) => {
  try {
    const resp = await get(url + paths.services + `/${id}`);
    return resp;
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

// ACTIVE SERVICES

export const getActiveServiceDetails = async (id) => {
  try {
    const resp = await get(url + paths.activeServices + `/${id}`);
    return resp;
  } catch (error) {
    console.error(error);
    return null;
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

// COMPONENT RESOLVING

export const resolveButtons = (
  id,
  loggedInState,
  type,
  link,
  updateComponent
) => {
  try {
    if (type === "service") {
      return getServiceDetails(id).then((resp) => {
        return componentResolver(
          resp.buttons,
          loggedInState,
          id,
          link,
          updateComponent
        );
      });
    } else if (type === "active-service") {
      return getActiveServiceDetails(id).then((resp) => {
        return componentResolver(
          resp.buttons,
          loggedInState,
          id,
          link,
          updateComponent
        );
      });
    } else if (type === "classes") {
      return getClassDetails(id).then((resp) => {
        return componentResolver(
          resp.buttons,
          loggedInState,
          id,
          link,
          updateComponent
        );
      });
    } else {
      return new Promise((resolve) => resolve([]));
    }
  } catch (error) {
    console.error(error);
    return new Promise((resolve) => resolve([]));
  }
};

export const getNavItems = async () => {
  try {
    const navbar = await get(url + paths.navbar);
    return navbar.nav_items;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const resolveNavItems = async (loggedInState) => {
  try {
    const navItems = await getNavItems();
    return componentResolver(navItems, loggedInState);
  } catch (error) {
    console.log(error);
    return [];
  }
};

// ATHLETES

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

export const getUser = async (id) => {
  try {
    if (id) {
      const userInfo = await get(url + paths.athletes + `/${id}`);
      return userInfo;
    } else {
      const user = await auth.getCurrentUser();
      const userInfo = await get(url + paths.getAthleteWithEmail + user.email);
      return userInfo;
    }
  } catch (error) {
    console.log(error);
  }
};

// ORDERS

export const getOrder = async (id) => {
  try {
    const order = await get(url + paths.orders + "/" + id);
    return order;
  } catch (error) {
    console.log(error);
    return undefined;
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

// CART

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

export const handleDeleteCart = async (cartId) => {
  try {
    const deletedCart = await deleteReq(url + paths.carts, cartId);
    return deletedCart;
  } catch (error) {
    console.error(error);
  }
};
