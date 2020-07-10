import axios from "axios";
import { baseUrl } from "./utils";

const api = axios.create({
  baseURL: `${baseUrl}/items`,
});

export const ItemAPI = {
  list: async () => {
    const response = await api.get("/");
    return response.data;
  },
};
