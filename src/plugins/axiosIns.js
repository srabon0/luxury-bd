// Import the necessary modules
import axios from "axios";

// Create a new Axios instance with custom configuration


const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
    // process.env.REACT_APP_ENV === "local"
    //   ? process.env.REACT_APP_LOCAL_BACKEND
    //   : process.env.REACT_APP_BACKEND, // Replace with your API base URL REACT_APP_LOCAL_BACKEND
  timeout: 100000, // Set a timeout for requests in milliseconds
  headers: {
    "Content-Type": "application/json", // Set the default content type for requests
    // Add any other headers you may need
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Optionally, you can add interceptors for request and response
apiInstance.interceptors.request.use(
  (config) => {
    // You can modify the request configuration here
    // For example, you can add authentication headers
    // config.headers.Authorization = `Bearer ${yourAccessToken}`;
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    // You can modify the response data here
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default apiInstance;
