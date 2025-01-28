import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";
import fetchAllCentersWithIds from "../List/CenterList";
import { toast } from "react-toastify";
import fetchAllCoursesWithIds from "../List/CourseList";

function CenterManagerView() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  const [centerData, setCenterData] = useState(null);
  const [courseData, setCourseData] = useState(null);


  const fetchData = async () => {
    try {
      const centerData = await fetchAllCentersWithIds();
      const courseData = await fetchAllCoursesWithIds();
      setCenterData(centerData);
      setCourseData(courseData);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try{
      const response = await api.get(`/getAllCourseClassListingsById/${id}`);
      setData(response.data);
      }catch(error){
        toast.error("Error Fetching Data ", error)
      }
    };
    getData();
    fetchData();
  }, [id]);

  return (
    <div className="container ">
      <div className="d-flex justify-content-end align-item-end mt-4">
        <Link to="/class">
          <button type="button" className="btn btn-sm btn-border">
            Back
          </button>
        </Link>
      </div>
      <div>
        <div className="container">
          <div className="row mt-5 pb-3">
            <div className="col-md-6 col-12">
              <div className="row mt-3  mb-2">
                <div className="col-6 ">
                  <p className="fw-medium">Centre Manager Name</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {centerData && centerData.map((centerId) =>
                      parseInt(data.centerId) === centerId.id
                        ? centerId.centerNames || "--"
                        : ""
                    )}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2 mt-3">
                <div className="col-6  ">
                  <p className="fw-medium">Email</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {courseData && courseData.map((courseId) =>
                      parseInt(data.courseId) === courseId.id
                        ? courseId.courseNames || "--"
                        : ""
                    )}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Phone</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.className || ""}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="row  mb-2">
                <div className="col-6  ">
                  <p className="fw-medium">Desigination</p>
                </div>
                <div className="col-6">
                  <p className="text-muted text-sm">: {data.classType || ""}</p>
                </div>
              </div>
            </div>
          
            
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default CenterManagerView;
