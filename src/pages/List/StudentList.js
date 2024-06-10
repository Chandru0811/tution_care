import toast from "react-hot-toast";
import api from "../../config/URL";

const fetchAllStudentsWithIds = async () => {
  try {
    const response = await api.get("getAllStudentNamesWithIds");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error.message);
    throw error;
  }
};

export default fetchAllStudentsWithIds ;
