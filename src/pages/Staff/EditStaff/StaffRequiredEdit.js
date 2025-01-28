import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import api from "../../../config/URL";
import pdfLogo from "../../../assets/images/Attactmentpdf.jpg";
import { MdOutlineDownloadForOffline } from "react-icons/md";

const StaffRequiredEdit = forwardRef(
  ({ formData, setLoadIndicators, setFormData, handleNext }, ref) => {
    const [datas, setDatas] = useState();
    // const formik = useFormik({
    //   initialValues: {
    //     resume: null || "",
    //     educationCertificate: null || "",
    //   },

    //   onSubmit: (data) => {
    //     setLoadIndicators(true);
    //     // setFormData((prv) => ({ ...prv, ...data }));
    //     // console.log("form parent",formData );
    //     // console.log("data", data);
    //     setLoadIndicators(false);
    //   },
    // });
    const userName = localStorage.getItem("userName");

    console.log("object", formData);
    const formik = useFormik({
      initialValues: {
        resume: null || "",
        educationCertificate: null || "",
        updatedBy: userName,
      },
      onSubmit: async (values) => {
        setLoadIndicators(true);
        values.updatedBy = userName;
        try {
          if (values.userEnquireId !== null || undefined) {
            const formDatas = new FormData();
            // Add each data field manually to the FormData object
            formDatas.append("resume", values.resume);
            formDatas.append(
              "educationCertificate",
              values.educationCertificate
            );
            formDatas.append("updatedBy", userName);

            const response = await api.put(
              `/updateUserRequireInformation/${values.userEnquireId}`,
              formDatas,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response.status === 201) {
              toast.success(response.data.message);
              setFormData((prv) => ({ ...prv, ...values }));
              handleNext();
            } else {
              toast.error(response.data.message);
            }
          } else {
            const formDatas = new FormData();

            // Add each data field manually to the FormData object
            const userId = formData.staff_id;
            formDatas.append("userId", userId);
            formDatas.append("resume", values.resume);
            formDatas.append(
              "educationCertificate",
              values.educationCertificate
            );

            const response = await api.post(
              `/createUserRequireInformation`,
              formDatas,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response.status === 201) {
              toast.success(response.data.message);
              setFormData((prv) => ({ ...prv, ...values }));
              handleNext();
            } else {
              toast.error(response.data.message);
            }
          }
        } catch (error) {
          if (error?.response?.status === 409) {
            toast.warning(error?.response?.data?.message);
          } else {
            toast.error(
              "Error Submiting data ",
              error?.response?.data?.message
            );
          }
        } finally {
          setLoadIndicators(false);
        }
      },
    });

    useEffect(() => {
      const getData = async () => {
        try {
          const response = await api.get(
            `/getAllUserById/${formData.staff_id}`
          );
          if (
            response.data.userRequireInformationModels &&
            response.data.userRequireInformationModels.length > 0
          ) {
            setDatas(response.data.userRequireInformationModels[0]);
            formik.setValues({
              ...response.data.userRequireInformationModels[0],
              userEnquireId: response.data.userRequireInformationModels[0].id,
            });
          } else {
            formik.setValues({
              userEnquireId: null,
              resume: null || "",
              educationCertificate: null || "",
            });
            // console.log("Contact ID:", formik.values.contactId);
          }
        } catch (error) {
          toast.error("Error Fetching Data");
        }
      };
      // console.log(formik.values);
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      staffRequireEdit: formik.handleSubmit,
    }));

    return (
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !formik.isSubmitting) {
            e.preventDefault(); // Prevent default form submission
          }
        }}
      >
        <div className="container-fluid" style={{ minHeight: "60vh" }}>
          <p className="headColor my-4">Required Information</p>
          <div class="row">
            <div class="col-md-6 col-12 mb-2">
              <label>Resume / CV</label>
              <input
                type="file"
                class="form-control mt-3"
                accept=".pdf"
                name="resume"
                onChange={(event) => {
                  formik.setFieldValue("resume", event.currentTarget.files[0]);
                }}
                onBlur={formik.handleBlur}
              />
              <p class="mt-4">Note: File must be PDF, Max Size 2 MB</p>
              {datas?.resume && (
                <div class="card border-0 shadow" style={{ width: "70%" }}>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: "not-allowed" }}
                  >
                    <img
                      class="card-img-top img-fluid"
                      style={{
                        height: "10rem",
                        pointerEvents: "none",
                        cursor: "not-allowed",
                      }}
                      src={pdfLogo}
                      alt="Resume preview"
                    />
                  </div>
                  <div
                    class="card-body d-flex justify-content-between align-items-center"
                    style={{ flexWrap: "wrap" }}
                  >
                    <p
                      class="card-title fw-semibold mb-0 text-wrap"
                      style={{
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={datas?.resume?.split("/").pop()}
                    >
                      {datas?.resume?.split("/").pop()}
                    </p>
                    <a
                      href={datas?.resume}
                      download
                      class="btn text-dark ms-2"
                      title="Download Resume"
                      style={{ flexShrink: 0 }}
                    >
                      <MdOutlineDownloadForOffline size={25} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div class="col-md-6 col-12 mb-2">
              <label>Education Certificate</label>
              <input
                type="file"
                class="form-control mt-3"
                accept=".pdf"
                name="educationCertificate"
                onChange={(event) => {
                  formik.setFieldValue(
                    "educationCertificate",
                    event.currentTarget.files[0]
                  );
                }}
                onBlur={formik.handleBlur}
              />
              <p class="mt-4">Note: File must be PDF, Max Size 2 MB</p>
              {datas?.educationCertificate && (
                <div class="card border-0 shadow" style={{ width: "70%" }}>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: "not-allowed" }}
                  >
                    <img
                      class="card-img-top img-fluid"
                      style={{
                        height: "10rem",
                        pointerEvents: "none",
                        cursor: "not-allowed",
                      }}
                      src={pdfLogo}
                      alt="Education Certificate preview"
                    />
                  </div>
                  <div
                    class="card-body d-flex justify-content-between align-items-center"
                    style={{ flexWrap: "wrap" }}
                  >
                    <p
                      class="card-title fw-semibold mb-0 text-wrap"
                      style={{
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={datas?.educationCertificate?.split("/").pop()}
                    >
                      {datas?.educationCertificate?.split("/").pop()}
                    </p>
                    <a
                      href={datas?.educationCertificate}
                      download
                      class="btn text-dark ms-2"
                      title="Download Certificate"
                      style={{ flexShrink: 0 }}
                    >
                      <MdOutlineDownloadForOffline size={25} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    );
  }
);

export default StaffRequiredEdit;
