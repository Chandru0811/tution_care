import toast from "react-hot-toast";
import api from "../../config/URL";

const fetchAllCoursesWithIds = async () => {
  try {
    const response = await api.get("getAllCoursesWithIds");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error.message);
    throw error;
  }
};

export default fetchAllCoursesWithIds;
