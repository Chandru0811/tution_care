import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt";
import "datatables.net-responsive-dt";
import $ from "jquery";
import SendNotificationAdd from "./SendNotificationAdd";
import SendNotificationEdit from "./SendNotificationEdit";
import api from "../../config/URL";
import Delete from "../../components/common/DeleteModel";

const SendNotification = () => {
  const tableRef = useRef(null);
  const storedScreens = JSON.parse(sessionStorage.getItem("screens") || "{}");
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState([]);
  // const datas = [
  //   {
  //     id: 1,
  //     eventName: "Nagaran Test-msg",
  //     message: "Testting Purpose Notification",
  //     createdAt: "04-19-2024",
  //   },
  //   {
  //     id: 2,
  //     eventName: "Manoj Test-msg",
  //     message: "Testting Purpose Notification",
  //     createdAt: "05-19-2024",
  //   },
  //   {
  //     id: 3,
  //     eventName: "Chandru Test-msg",
  //     message: "Testting Purpose Notification",
  //     createdAt: "06-19-2024",
  //   },
  //   {
  //     id: 4,
  //     eventName: "Ragul Test-msg",
  //     message: "Testting Purpose Notification",
  //     createdAt: "07-19-2024",
  //   },
  //   {
  //     id: 5,
  //     eventName: "Antony Test-msg",
  //     message: "Testting Purpose Notification",
  //     createdAt: "08-19-2024",
  //   },
  // ];
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get("/getAllSmsPushNotifications");
        setDatas(response.data);
        console.log("message", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // useEffect(() => {
  //   const table = $(tableRef.current).DataTable({
  //     responsive: true,
  //   });

  //   return () => {
  //     table.destroy();
  //   };
  // }, []);

  useEffect(() => {
    if (!loading) {
      initializeDataTable();
    }
    return () => {
      destroyDataTable();
    };
  }, [loading]);

  const initializeDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      // DataTable already initialized, no need to initialize again
      return;
    }
    $(tableRef.current).DataTable({
      responsive: true,
    });
  };

  const destroyDataTable = () => {
    const table = $(tableRef.current).DataTable();
    if (table && $.fn.DataTable.isDataTable(tableRef.current)) {
      table.destroy();
    }
  };

  const refreshData = async () => {
    destroyDataTable();
    setLoading(true);
    try {
      const response = await api.get("/getAllSmsPushNotifications");
      setDatas(response.data);
      initializeDataTable(); // Reinitialize DataTable after successful data update
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid  center">
      <div className="card shadow border-0 mb-2 top-header">
        <div className="container-fluid px-0">
        <div className="d-flex justify-content-between mb-5 my-3 px-4">
              <h2>Send Notification</h2>
              <SendNotificationAdd />
          </div>
          <hr />
      {loading ? (
        <div className="loader-container">
          <div class="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : (
        <div className="table-responsive px-4">
        <table ref={tableRef} className="display minHeight">
              <thead>
                <tr>
                  <th scope="col">S No</th>
                  <th scope="col">Event Name</th>
                  <th scope="col">Message</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {datas.map((data, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{data.messageTitle}</td>
                    <td>{data.messageDescription}</td>
                    <td>{data.datePosted}</td>
                    <td>
                      {storedScreens?.sendNotificationUpdate && (
                        <SendNotificationEdit
                          id={data.id}
                          onSuccess={refreshData}
                        />
                      )}
                       {storedScreens?.levelDelete && (
                    <Delete
                      onSuccess={refreshData}
                      path={`/deleteCourseLevel/${data.id}`}
                    />
                  )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default SendNotification;
