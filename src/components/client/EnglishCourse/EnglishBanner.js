import React, { useEffect } from "react";
import img from "../../../assets/clientimage/eng.png";
import img1 from "../../../assets/clientimage/IMG_195.png";

function CoursesBanner({datas ,getData}) {

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row remove-padding">
        <div className="col-md-8 col-12 bgimage " style={{backgroundImage:`url(${datas.backgroundImage || img1})`}}>
          <div className="py-5 firsthead  d-flex flex-column  justify-content-center align-items-center">
            <img src={datas.menuLogo} alt="english" width={80}></img>
            <h1>{datas.heading}</h1>
          </div>
        </div>
        <div className="col-md-4 col-12 p-5">
          <h3 className="mb-3 headcolor">{datas.heading}</h3>
          {datas.contentOne?.split("\n\n").map((paragraph, index) => (
                <div key={index} className="edit-container mb-3">
                  <p
                    className="headbody preserve-whitespace"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  ></p>
                </div>
              ))}
          {/* <p className="headbody">
            With our <b>small ratio</b> of 1 teacher to 4 students, each student
            will receive a more <b>personalised</b> attention from their
            teacher. This allows the teacher to better understand the specific
            needs, strengths, and challenges of each student, enabling them to
            provide tailored instruction and support.
          </p>
          <p className="headbody">We believe learning should be fun for all!</p>
          <p className="headbody">
            All our teachers are specially trained by our curriculum specialist.
            They are skilled to <b>analyse</b> specific needs, strengths and
            every challenge that each student faces.
          </p>
          <p className="headbody">
            Parents’ involvement in a child’s learning journey is crucial.
          </p>
          <p className="headbody">
            We take <b>Videos and pictures</b> of every student and deliver them
            to parents through our very own <b>Arty Parents’ Portal</b>.
            Conveniently developed to reinforce learning while enhancing
            parents’ involvement.
          </p>
          <p className="headbody">
            Regular communication with teachers provides a supportive
            environment for learning and can contribute to academic successes.
            By showing interest and actively participating in their child's
            education, parents instil a positive attitude towards learning and
            helps to encourage children to strive for excellence.
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default CoursesBanner;
