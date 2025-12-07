import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/ApiConfig';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(config => {
  config.headers = {
    ...(config.headers || {}),
    accept: 'application/json',
    ApiKey: API_KEY,
  };
  return config;
});

export default apiClient;
