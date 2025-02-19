import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllIDTypeWithIds = async (centerId) => {
  try {
    const response = await api.get(`getIdTypeSettingWithCenterId/${centerId}`);
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default fetchAllIDTypeWithIds;
