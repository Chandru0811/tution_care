import React, { useEffect, useState } from "react";
import api from "../../config/URL";

const TrialNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const centerId = localStorage.getItem("tmscenterId");
  console.log("Show Notification", showNotification);
  const [daysLeft, setDaysLeft] = useState(0);
  const closeNotification = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    const handelTrailEnd = async () => {
      try {
        const response = await api.get(`/trialEndDate/${centerId}`);
        if (response.status === 200) {
          console.log("response.data.trial", response?.data[0]?.trial);
          if (response?.data[0]?.trial === true) {
            setShowNotification(true);
            setDaysLeft(response?.data[0]?.daysRemaining);
          }
        }
      } catch (error) {
        console.log("Error fetching trial data");
      }
    };
    handelTrailEnd();
  }, [centerId]);

  return (
    showNotification && (
      <div className="notification-bar d-flex">
        <marquee>
          *Attention: Your trial version expires in {daysLeft} days! Upgrade to
          the SMS Guru plan now to enjoy uninterrupted service and ensure
          continuous access to all our tools and support. Don’t delay secure
          your upgrade today!
        </marquee>
        <button className="btn upgradebutton">Upgrade Plan</button>
        <button className="close-button" onClick={closeNotification}>
          ×
        </button>
      </div>
    )
  );
};

export default TrialNotification;
