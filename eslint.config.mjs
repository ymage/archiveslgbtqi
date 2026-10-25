import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  // Ignoring generated files
  { ignores: ["sanity.types.ts"] },
];

export default config;
