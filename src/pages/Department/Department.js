import React, { useEffect, useRef } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import DeleteModel from "../../components/common/DeleteModel";
import DepartmentAdd from "./DepartmentAdd";
import DepartmentEdit from "./DepartmentEdit";

const Department = () => {
  const tableRef = useRef(null);

  const datas = [
    {
     id: 1,
     departmentName: "React Js",
     departmentLead: "User1",
     parentDepartment: "ECSCloud Infotech Pvt Ltd"
    },
    {
     id: 2,
     departmentName: "Java",
     departmentLead: "User2",
     parentDepartment: "ECSCloud Infotech Pvt Ltd"
    },
    
  ];

  useEffect(() => {
    const table = $(tableRef.current).DataTable({
      responsive: true,
    });

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <div className="container-fluid minHeight">
    <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid py-4">
            <div className="row align-items-center justify-content-between ">
                <div className="col">
                    <div className="d-flex align-items-center gap-4">
                        <h1 className="h4 ls-tight headingColor ">Department</h1>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="hstack gap-2 justify-content-end">
                       <DepartmentAdd/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="card shadow border-0 my-2">
        <div className="table-responsive p-2 minHeight">
            <table
                ref={tableRef}
                className="display table table-hover table-nowrap"
            >
                <thead className="thead-light">
                    <tr>
                        <th scope="col" style={{ whiteSpace: "nowrap" }}>
                            S.NO
                        </th>
                        <th scope="col">DEPARTMENT NAME</th>
                        <th scope="col">DEPARTMENT LEAD</th>
                        <th scope="col">PARENT DEPARTMENT</th>
                        <th scope="col" className="text-center">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {datas.map((data, index) => (
                        <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{data.departmentName}</td>
                            <td>{data.departmentLead}</td>
                            <td>{data.parentDepartment}</td>
                            <td className="text-center">
                                  <DepartmentEdit/>
                                    <DeleteModel />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="card-footer border-0 py-5"></div>
    </div>
</div>
  );
};

export default Department;
