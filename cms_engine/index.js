const testURL = "http://localhost:1337";
const ProdURL = "https://faziz-training-cms.herokuapp.com";
const url = testURL;

const paths = {
  services: "/service-categories",
};

export const getServices = async () => {
  try {
    const resp = await fetch(url + paths.services);
    return resp.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};
