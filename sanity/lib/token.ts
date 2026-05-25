import "server-only";

import { experimental_taintUniqueValue } from "react";

const token = process.env.SANITY_API_READ_TOKEN;

export function getToken(): string {
  if (!token) {
    throw new Error("Missing SANITY_API_READ_TOKEN");
  }
  return token;
}

if (token) {
  experimental_taintUniqueValue(
    "Do not pass the sanity API read token to the client.",
    process,
    token,
  );
}
