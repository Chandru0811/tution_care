import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllNationalityeWithIds = async (centerId) => {
  try {
    const response = await api.get(`getAllCountrySettingWithCenterId/${centerId}`);
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default fetchAllNationalityeWithIds;
