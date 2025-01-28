import { toast } from "react-toastify";
import api from "../../config/URL";

const fetchAllPackageList = async () => {
  try {
    const response = await api.get(
      `getAllCentersPackageWithIds`
    );
    response.data.sort((a, b) => b.id - a.id);
    return response.data;
  } catch (error) {
    toast.error("Error fetching Course data:", error);
    throw error;
  }
};

export default fetchAllPackageList;
