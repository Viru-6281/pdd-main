import axios from 'axios';

// Create an Axios instance
// VITE_API_BASE_URL is set via .env or GitHub Actions secrets
// Development: http://localhost:8080/
// Production: set VITE_API_BASE_URL in GitHub Actions environment
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default AxiosInstance;
