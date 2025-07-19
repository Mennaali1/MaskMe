// API Configuration
// For local development, you can use localhost
// For network access, change this to your computer's IP address
// For production, change this to your backend domain
export const BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// Frontend URL for verification links
export const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";
