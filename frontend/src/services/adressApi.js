import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // ✅ Backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ✅ Add Authorization Header
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("authTokens"));
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Fetch addresses for the logged-in user
export const fetchAddress = async () => {
  return await api.get("/address/");  // ✅ Fixed endpoint spelling
};

// ✅ Create a new address
export const createAddress = async (addressInfo) => {
  return await api.post("/address/", addressInfo);
};

// ✅ Update an existing address
export const updateAddress = async (addressInfo, id) => {
  if (!id) {
    throw new Error("Address ID is required for updating an address");
  }
  return await api.put(`/address/${id}/`, addressInfo);
};
