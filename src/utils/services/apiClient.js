import axios from 'axios';
import Cookies from 'js-cookie';
import store from '@/redux/store';
import { refreshToken } from '@/redux/thunks/authThunk';
import { logout } from '@/redux/slices/AuthSlice';

// Tạo một instance axios mới
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    let token = Cookies.get('token');
    const refresh = Cookies.get('refreshToken');
    const tokenExpiry = Cookies.get('tokenExpiry');


    if (!token && !tokenExpiry && refresh) {
      try {
        console.log("Token expired. Refreshing token...");
        const result = await store.dispatch(refreshToken());
        token = result.payload.data.token;
        
        const newExpires = new Date(new Date().getTime() + 30 * 1000);
        Cookies.set('token', token, { expires: newExpires });
        Cookies.set('tokenExpiry', newExpires.getTime(), { expires: newExpires });
        
        config.headers['x-auth-token'] = token;
      } catch (error) {
        console.error("Failed to refresh token", error);
        store.dispatch(logout());
        return Promise.reject(error);
      }
    } else if (token) {
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default apiClient;