import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import CmsTeacherEdit from "../../CMS/CMSTeacher/CmsTeacherEdit";
import CmsTeacherAdd from "./CmsTeacherAdd";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const CmsTeacher = () => {
  const [datas, setDatas] = useState([]);
  const storedScreens = JSON.parse(localStorage.getItem("screens") || "{}");

  const getData = async () => {
    try {
      const response = await api.get(`/getAllTeacherSaves`);
      // formik.setValues(response.data);
      setDatas(response.data);
    } catch (error) {
      toast.error("Error Fetch Data ", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const adminData = datas.filter((data) => data.role === "ADMIN");
  const cTeacherData = datas.filter((data) => data.role === "CHINESE");
  const engTeacherData = datas.filter((data) => data.role === "ENGLISH");

  const publish = async () => {
    try {
      const response = await api.post(`/publishTeacherSave`);
      if (response.status === 201) {
        toast.success("successfully Teacher published ");
      }
    } catch (error) {
      toast.error("Error Fetch Data ", error);
    }
  };

  return (
    <section style={{ backgroundColor: "#f9fafb" }}>
      <div className="container-fluid cms-header shadow-sm py-2 mb-4">
        <ol
          className="breadcrumb my-3 px-1"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li>
            <Link to="/" className="custom-breadcrumb">
              Home
            </Link>
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li>
            Content Management
            <span className="breadcrumb-separator"> &gt; </span>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Teachers
          </li>
        </ol>
        <div className="row p-1">
          <div className="col-md-6 col-12">
            <h4 className="headColor">Teacher</h4>
          </div>
          <div className="col-md-6 col-12 d-flex justify-content-end">
            {/* <button className="btn btn-sm btn-outline-primary border ms-2">
              Save
            </button> */}
            {storedScreens?.teacherSaveCreate && (
              <CmsTeacherAdd getData={getData} />
            )}
            {storedScreens?.teacherSavePublish && (
              <button
                className="btn btn-sm custom-outline-danger border ms-2"
                onClick={publish}
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="container-fluid py-5">
        <Tabs
          defaultActiveKey="profile"
          id="fill-tab-example"
          className="mb-3 tab fw-medium mt-2"
          style={{ fontSize: "20px" }}
        >
          <Tab eventKey="home" title="English Phonics Teachers">
            <div className="row mt-5">
              {engTeacherData &&
                engTeacherData.map((data, i) => (
                  <div className="col-md-6 col-12">
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <img
                          src={data.image}
                          alt="Teacher"
                          style={{ borderRadius: "10px" }}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-end">
                          {storedScreens?.teacherSaveUpdate && (
                            <CmsTeacherEdit id={data.id} fetchData={getData} />
                          )}
                        </div>
                        <div className="mx-2">
                          <h1 className="fw-bold">{data.teacherName}</h1>
                          <h4 className="text-danger">
                            {data.teacherRoleName}
                          </h4>
                          <p style={{ fontSize: "20px" }}>
                            {data.teacherDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Tab>
          <Tab eventKey="profile" title="Chinese Teachers">
            <div className="row mt-5">
              {cTeacherData &&
                cTeacherData.map((data, i) => (
                  <div className="col-md-6 col-12">
                    <div className="row">
                      <div className="col-md-6 col-12">
                        <img
                          src={data.image}
                          alt="Teacher"
                          style={{ borderRadius: "10px" }}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="d-flex justify-content-end">
                          {storedScreens?.teacherSaveUpdate && (
                            <CmsTeacherEdit id={data.id} fetchData={getData} />
                          )}
                        </div>
                        <div className="mx-2">
                          <h1 className="fw-bold">{data.teacherName}</h1>
                          <h5 className="text-danger">
                            {data.teacherRoleName}
                          </h5>
                          <p style={{ fontSize: "20px" }}>{data.experience}</p>
                          <p style={{ fontSize: "20px" }}>
                            {data.teacherDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Tab>
          <Tab eventKey="longer-tab" title="Admin">
            <div className="row mt-5">
              {adminData &&
                adminData.map((data, i) => (
                  <>
                    <div className="col-md-6 col-12">
                      <div className="row">
                        <div className="col-md-6 col-12">
                          <img
                            src={data.image}
                            alt="Teacher"
                            style={{ borderRadius: "10px" }}
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="d-flex justify-content-end">
                            {storedScreens?.teacherSaveUpdate && (
                              <CmsTeacherEdit
                                id={data.id}
                                fetchData={getData}
                              />
                            )}
                          </div>
                          <div className="mx-2">
                            <h1 className="fw-bold">{data.teacherName}</h1>
                            <h4 className="text-danger">
                              {data.teacherRoleName}
                            </h4>
                            <p style={{ fontSize: "20px" }}>
                              {data.teacherDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};
