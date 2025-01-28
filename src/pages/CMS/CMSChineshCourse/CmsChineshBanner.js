import React, { useEffect, useState } from "react";
import Alphabet from "../../../assets/clientimage/Alphabet.png";
import { FaEdit, FaSave } from "react-icons/fa";
import api from "../../../config/URL";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

function CmsChineseBanner({
  backgroundImage,
  heading,
  contentOne,
  getData,
  courseId
}) {
  const [editingField, setEditingField] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [content, setContent] = useState();
  const storedScreens = JSON.parse(localStorage.getItem("screens") || "{}");
  useEffect(() => {
    setContent({
      bgImg: backgroundImage,
      heading: heading,
      paragraphs: [contentOne].join("\n\n"),
    });
  }, [backgroundImage, contentOne, heading]);

  // console.log(content.heading)

  const toggleEdit = () => {
    setEditingField((prevEditingField) =>
      prevEditingField === "paragraphs" ? null : "paragraphs"
    );
  };

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const updateData = async (formData) => {
    try {
      const response = await api.put(`/updateCoursesSave/${courseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        getData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating data: ", error.message);
    } finally {
      setEditingField(null);
    }
  };

  const saveBackgroundContent = async () => {
    const formData = new FormData();
    formData.append("backgroundImage", logoUrl);
    updateData(formData);
  };
  const saveHeadingContent = async () => {
    const formData = new FormData();
    formData.append("heading", content.heading);
    updateData(formData);
  };

  const saveParagraphContent = async () => {
    const formData = new FormData();
    formData.append("contentOne", content.paragraphs.split("\n\n"));
    updateData(formData);
  };

  const handleChange = (e) => {
    setContent({
      ...content,
      paragraphs: e.target.value,
    });
  };

  const cancelEdit = () => {
    setEditingField(null);
    getData();
  };

  return (
    <div className="container-fluid">
      <div className="row remove-padding">
        <div className="edit-container mb-3">
          {editingField === "bgImg" ? (
            <>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setLogoUrl(file);
                }}
                className="topbar-wordpress form-control-sm w-50"
              />
              <button
                className="btn btn-sm btn-outline-primary border ms-2"
                onClick={saveBackgroundContent}
              >
                <FaSave />
              </button>
              <button
                className="btn btn-sm btn-outline-primary border ms-2"
                onClick={cancelEdit}
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
             {storedScreens?.chineseCourseUpdate && (
              <button
                className="btn btn-sm btn-outline-warning border ms-2 edit-button"
                onClick={() => handleEdit("bgImg")}
              >
                <FaEdit />
              </button>
             )}
            </>
          )}
        </div>
        <div
          className="col-md-8 col-12 bgimage"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="py-5 firsthead d-flex flex-column justify-content-center align-items-center">
            <div className="edit-container d-flex flex-column justify-content-center align-items-center">
              <img src={Alphabet} alt="english" className="img-fluid w-25"></img>
            </div>
            <h1>Arty Learning</h1>
          </div>
        </div>
        <div className="col-md-4 col-12 p-5">
          <div className="edit-container">
            {editingField === "heading" ? (
              <>
                <input
                  type="text"
                  value={content?.heading}
                  onChange={(e) =>
                    setContent({ ...content, heading: e.target.value })
                  }
                  className="form-control mb-3"
                />
                <button
                  className="btn btn-sm btn-outline-primary border ms-2"
                  onClick={saveHeadingContent}
                >
                  <FaSave />
                </button>
                <button
                  className="btn btn-sm btn-outline-primary border ms-2"
                  onClick={cancelEdit}
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <h3 className="mb-3 headcolor">{heading}</h3>
                {storedScreens?.chineseCourseUpdate && (
                <button
                  className="btn btn-sm btn-outline-warning border ms-2 edit-button"
                  onClick={() => handleEdit("heading")}
                >
                  <FaEdit />
                </button>)}
              </>
            )}
          </div>
          {editingField === "paragraphs" ? (
            <>
              <textarea
                value={content?.paragraphs}
                onChange={handleChange}
                className="form-control mb-3"
                rows="10"
              />
              <button
                className="btn btn-sm btn-outline-primary border ms-2"
                onClick={saveParagraphContent}
              >
                <FaSave />
              </button>
              <button
                className="btn btn-sm btn-outline-primary border ms-2"
                onClick={cancelEdit}
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              {content?.paragraphs.split("\n\n").map((paragraph, index) => (
                <div key={index} className="edit-container mb-3">
                  <p
                    className="headbody preserve-whitespace"
                    dangerouslySetInnerHTML={{ __html: contentOne }}
                  ></p>
                </div>
              ))}
              {storedScreens?.chineseCourseUpdate && (
              <button
                className="btn btn-sm btn-outline-warning border ms-2 edit-button"
                onClick={toggleEdit}
              >
                <FaEdit />
              </button>)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CmsChineseBanner;
