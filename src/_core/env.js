function getEnv(name, defaultValue) {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || defaultValue;
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: getEnv("JWT_SECRET", "amarjeans_super_secret_jwt_key_2026"),
  mongodbUrl: getEnv("MONGODB_URL", "mongodb://127.0.0.1:27017/amarjeans"),
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
  shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN ?? "",
  adminEmail: getEnv("ADMIN_EMAIL", "admin@amarjeans.com"),
  adminPassword: getEnv("ADMIN_PASSWORD", "admin123"),
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "123456789",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "abcdef123456",
};

