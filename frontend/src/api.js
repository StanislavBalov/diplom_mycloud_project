import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    
    return Promise.reject(err);
  }
);

export async function handleResponse(promise) {
  try {
    const res = await promise;
    return { res, body: res.data };
  } catch (error) {
    if (error.response) {
      return { res: error.response, body: error.response.data };
    }
    throw error;
  }
}

export async function getJson(url, config = {}) {
  return handleResponse(api.get(url, config));
}
export async function postJson(url, data, config = {}) {
  return handleResponse(api.post(url, data, config));
}
export async function putJson(url, data, config = {}) {
  return handleResponse(api.put(url, data, config));
}
export async function del(url, config = {}) {
  return handleResponse(api.delete(url, config));
}

export default api;