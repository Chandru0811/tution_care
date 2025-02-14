import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllLanguageWithIdsC = async (id) => {
  const centerId = localStorage.getItem("tmscenterId");

  try {
    const response = await api.get(`getAllLanguageWithCenterId/${centerId}`);
    return response.data;
  } catch (error) {
    toast.error("Error fetching Course data:", error);
    throw error;
  }
};

export default fetchAllLanguageWithIdsC;
