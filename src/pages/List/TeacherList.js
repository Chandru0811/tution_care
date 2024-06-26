import toast from "react-hot-toast";
import api from "../../config/URL";

const fetchAllTeachersWithIds = async () => {
  try {
    const response = await api.get("getAllTeacherNamesWithIds");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error.message);
    throw error;
  }
};

export default fetchAllTeachersWithIds;
