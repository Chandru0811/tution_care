import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../config/URL";

function SubjectView() {
  const { id } = useParams();
  // console.log(id)
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/getAllCourseSubjectsById/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data ", error.message);
      }
    };
    getData();
  }, [id]);

  return (
    <div className="minHeight container-fluid center">
    <div className="card shadow border-0 mb-2 top-header">
       <div className="container-fluid py-4">
         <div className="row align-items-center">
           <div className="col">
             <div className="d-flex align-items-center gap-4">
               <h2 className="h2 ls-tight headingColor">View Subject</h2>
             </div>
           </div>
           <div className="col-auto">
             <div className="hstack gap-2 justify-content-end">
               <Link to="/subject">
                 <button type="submit" className="btn btn-sm btn-light">
                   <span>Back</span>
                 </button>
               </Link>
             </div>
           </div>
         </div>
       </div>
     </div>
     
     <div className="card shadow border-0 mb-2 top-header" style={{height:"70vh"}}>
        <div className="container p-5">
        <div className="row mt-5 pb-3">
          <div className="col-md-6 col-12">
            <div className="row   mb-2">
              <div className="col-6 ">
                <p className="fw-medium">Subject</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.subject}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="row  mb-2 ">
              <div className="col-6  ">
                <p className="fw-medium">Code</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.code}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12">
            <div className="row  mb-2">
              <div className="col-6  ">
                <p className="fw-medium">Status</p>
              </div>
              <div className="col-6">
                <p className="text-muted text-sm">: {data.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
  );
}

export default SubjectView;
