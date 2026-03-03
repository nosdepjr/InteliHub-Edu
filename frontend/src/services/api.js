import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getResources = (page = 1, size = 5) =>
  api.get("/resources/?page=1&size=5");

export const getResourceById = (id) =>
  api.get(`/resources/${id}`);

export const createResource = (data) =>
  api.post("/resources/", data);

export const updateResource = (id, data) =>
  api.put(`/resources/${id}`, data);

export const deleteResource = (id) =>
  api.delete(`/resources/${id}`);

export const smartAssist = (data) =>
  api.post("/resources/smart-assist", data);

export default api;
