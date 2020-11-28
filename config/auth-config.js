const { Auth } = require("@farisaziz12/web-core/packages/auth/src");

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
};

export const auth = new Auth(config);
