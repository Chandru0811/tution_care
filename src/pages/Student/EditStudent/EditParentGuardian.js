import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import api from "../../../config/URL";
import EditParentDetailModel from "./EditParentDetailModel";
import AddParentDetailModel from "./AddParentDetailModel";
import { GoDotFill } from "react-icons/go";
// import BlockImg from "../../../assets/images/Block_Img1.jpg";
import { FaEdit } from "react-icons/fa";

const EditParentGuardian = forwardRef(
  ({ formData,setLoadIndicators, setFormData, handleNext }, ref) => {
    const [data, setData] = useState({});
    console.log("Api Datas:",data);

    const getData = async () => {
      setLoadIndicators(true);
      try {
        const response = await api.get(`/getAllStudentDetails/${formData.id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
        setLoadIndicators(false);
      }
    };

    useEffect(() => {
      getData();
    }, []);

    useImperativeHandle(ref, () => ({
      editParentGuardian: handleNext,
    }));

    return (
      <div className="container-fluid">
        <div className="container-fluid">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-12 mt-4">
                <h5 className="headColor mb-3">Parents / Guardian Details</h5>
                <table className="table table-border-solid">
                  <thead className=" table-light" style={{background:"#BFF6C3"}}>
                    <tr>
                      <th scope="col" className="fw-medium">
                        S.No
                      </th>
                      <th scope="col" className="fw-medium">
                        Parent Names
                      </th>
                      <th scope="col" className="fw-medium">
                        Date Of Birth
                      </th>
                      <th scope="col" className="fw-medium">
                        Relation
                      </th>
                      <th scope="col" className="fw-medium">
                        Email
                      </th>
                      <th scope="col" className="fw-medium">
                        Mobile No
                      </th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.studentParentsDetails &&
                      data.studentParentsDetails.map((parent, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {/* <p className="my-2 d-flex">
                              {parent.profileImage ? (
                                <img
                                  src={parent.profileImage}
                                  onError={(e) => {
                                    e.target.src = BlockImg;
                                  }}
                                  className="rounded-5 mx-1"
                                  style={{ width: "30px", height: "40px" }}
                                  alt="Img"
                                />
                              ) : (
                                <img
                                  src={BlockImg}
                                  className="rounded-5 mx-1"
                                  style={{ width: "40px", height: "40px" }}
                                  alt="Img"
                                />
                              )}

                              {parent.parentName}
                              {parent.primaryContact === true && (
                                <GoDotFill className="text-primary" />
                              )}
                            </p> */}
                          </td>
                          <td>
                            {parent.parentDateOfBirth?.substring(0, 10) || "-"}
                          </td>
                          <td>{parent.relation || "-"}</td>
                          <td>{parent.email || "-"}</td>
                          <td>{parent.mobileNumber || "-"}</td>
                          <td>
                            {parent.primaryContact ? (
                              <button
                                className="btn border-white"
                                type="button" disabled
                              >
                                <FaEdit className="text-secondary" />
                              </button>
                            ) : (
                              <EditParentDetailModel
                                id={parent.id}
                                getData={getData}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-md-2 col-12 text-strat">
                <AddParentDetailModel />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default EditParentGuardian;