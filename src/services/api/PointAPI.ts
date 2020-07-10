import axios from "axios";
import { baseUrl } from "./utils";

const api = axios.create({
  baseURL: `${baseUrl}/points`,
});

export const PointAPI = {
  list: async () => {
    const response = await api.get("/");
    return response.data;
  },

  create: async (data: Object) => {
    const response = await api.post("/", data);
    return response.data;
  },
};
