import { post } from "../network";

const testURL = "http://localhost:1337";
const ProdURL = "https://faziz-training-cms.herokuapp.com";
const url = testURL;

const paths = {
  services: "/services",
  serviceCategories: "/service-categories",
  athletes: "/athletes",
};

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

export const signUpAthlete = (firstName, lastName, email, birthdate) => {
  return post(url + paths.athletes, {
    first_name: firstName,
    last_name: lastName,
    email: email,
    birthdate: birthdate,
  });
};
