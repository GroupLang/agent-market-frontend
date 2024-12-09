import axios from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const createAxiosInstanceWithRetry = (store) => {
  const axiosInstance = axios.create();

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry && originalRequest.retryCount < MAX_RETRIES) {
        originalRequest._retry = true;
        originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));

        try {
          // Refresh token logic would go here if needed
          const { token } = store.getState().auth;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}; 