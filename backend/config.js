// Configuration file for environment-specific settings
export const config = {
  // Frontend URL - change this based on your deployment
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

  // Backend URL - change this based on your deployment
  BACKEND_URL: process.env.BACKEND_URL || "http://localhost:5000",

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || "mennaalyfahmy",

  // Email configuration
  EMAIL_USER: process.env.EMAIL_USER || "menna3li01@gmail.com",
  EMAIL_PASS: process.env.EMAIL_PASS || "faia urlv shsi eivo",

  // Database URL
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/maskme",
};

// Helper function to get verification URL
export const getVerificationUrl = (token) => {
  return `${config.FRONTEND_URL}/verify/${token}`;
};

// Helper function to get frontend URL
export const getFrontendUrl = () => {
  return config.FRONTEND_URL;
};
