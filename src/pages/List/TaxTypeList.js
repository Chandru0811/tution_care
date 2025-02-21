import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllTaxWithIds = async () => {
  const centerId = localStorage.getItem("tmscenterId");
  try {
    const response = await api.get(`/getAllTaxSettingByCenter/${centerId}`);
    response.data.sort((a, b) => b.id - a.id);
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default fetchAllTaxWithIds;
