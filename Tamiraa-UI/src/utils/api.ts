// In development, use relative paths to leverage Vite proxy
// In production (Netlify), use the production backend URL
export const API_BASE_URL = import.meta.env.DEV 
  ? "" 
  : (import.meta.env.VITE_API_BASE_URL || "https://tamiraaecom.onrender.com");
























