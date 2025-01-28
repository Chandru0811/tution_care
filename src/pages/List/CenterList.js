// apiService.js

import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllCentersWithIds = async () => {
  try {
    const response = await api.get("getAllCentersWithIds");
    console.log("response:::::",response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching center data:", error);
    throw error;
  }
};

export default fetchAllCentersWithIds;
