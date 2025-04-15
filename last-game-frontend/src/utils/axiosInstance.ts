import axios from "axios";

const axiosInstance = axios.create({
  baseURL: window.location.hostname.includes("localhost")
    ? "http://localhost:8080/api/v1" 
    : "https://lastgame-api.chirality.app/v1",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token and userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If userId exists, add it to the request body (for POST/PUT requests)
    if (userId && config.method === "post" || config.method === "put") {
      if (config.data) {
        config.data.user_id = userId; // Append userId to the existing body
      } else {
        config.data = { user_id: userId }; // Create a new body with userId
      }
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
