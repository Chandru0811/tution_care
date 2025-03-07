import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllSalaryTypeWithIds = async () => {
  const centerId = localStorage.getItem("tmscenterId");

  try {
    const response = await api.get(`/getSalarySettingWithCenterId/${centerId}`);
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default fetchAllSalaryTypeWithIds;
