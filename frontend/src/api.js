import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    config.headers['X-CSRFToken'] = csrftoken;
  }
  return config;
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function handleResponse(promise) {
  try {
    const res = await promise;
    return { res, body: res.data };
  } catch (error) {
    if (error.response) {
      return { res: error.response, body: error.response.data };
    } else {
      throw error;
    }
  }
}

export async function getJson(url, config = {}) {
  return handleResponse(api.get(url, config));
}

export async function postJson(url, data, config = {}) {
  return handleResponse(api.post(url, data, config));
}

export async function postFormData(url, formData, config = {}) {
  return handleResponse(
    api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    })
  );
}

export async function putJson(url, data, config = {}) {
  return handleResponse(api.put(url, data, config));
}

export async function del(url, config = {}) {
  return handleResponse(api.delete(url, config));
}

export default api;