export const post = (url, body) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  }).catch((error) => console.error(error));
};
