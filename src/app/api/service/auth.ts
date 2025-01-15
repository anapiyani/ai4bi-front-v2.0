import axios from 'axios'
import { jwtDecode } from "jwt-decode"
import { deleteCookie, getCookie, setCookie } from './cookie'


const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const refreshToken = async () => {
  try {
    const refresh_token = getCookie('refresh_token');
    const response = await axios.post(`${API_URL}user/refresh`, {
      refresh_token,
    });
    const { access_token, refresh_token: new_refresh_token } = response.data;
    setCookie('access_token', access_token);
    setCookie('refresh_token', new_refresh_token);
    return response.data;
  } catch (error: any) {
    // for now, just redirect to login!
    window.location.href = '/login';
  }
};
const access_token_expired = (access_token: string) => {
  const decodedToken: any = jwtDecode(access_token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};


export const isAuthorized = async () => {
  try {
    const access_token = getCookie('access_token');
    if (access_token == null || access_token_expired(access_token)) {
      await refreshToken();
      return true;
    }
    // If the access token is not expired, we can assume the user is authorized
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
  return false;
};

export const logout = () => {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
};