let cache;

const environment = import.meta.env.VITE_APP_ENVIRONMENT;

const config = () => {
  if (!cache) {
    cache = Object.freeze({
      secrets: {
        apiHost: "https://sector-registry-backend.onrender.com",
        environment,
      },
    });
  }
  return cache;
};

export default config;
