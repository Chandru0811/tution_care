import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllRaceWithIds = async () => {
  const centerId = localStorage.getItem("tmscenterId")
  try {
    const response = await api.get(`/getAllRaceSettingByCenter/${centerId}`);
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default fetchAllRaceWithIds;
