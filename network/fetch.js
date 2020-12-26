export const post = (url, body) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  }).catch((error) => console.error(error));
};

export const get = async (url) => {
  const resp = await fetch(url).catch((error) => console.error(error));

  return resp.json();
};

export const put = (url, body) => {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .catch((error) => console.error(error));
};

export const deleteReq = async (url, id) => {
  return fetch(url + "/" + id, { method: "DELETE" }).then((resp) =>
    resp.json()
  );
};
