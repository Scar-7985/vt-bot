import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import { useNavigate } from 'react-router-dom';

const Notification = () => {

  const navigate = useNavigate();
  const [notificationData, setNotificationData] = useState([]);
  const [showBlank, setShowBlank] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      axios.post(`${SITE_URL}/api/get-api/notice.php`).then(resp => {
        if (resp.data.length > 0) {
          setNotificationData(resp.data)
        } else {
          setShowBlank(true)
        }
      })
    }

  }, [])

  const viewDetail = (Id) => {
    navigate("/notification-view", { state: { viewId: Id } })
  }

  return (
    <div className="section mb-2 pb-5">
      {notificationData.length > 0 ? (
        <div className="transactions mt-2">
          {notificationData.map((item, index) => {
            return (

              <div className="item" key={index} onClick={() => viewDetail(item.id)}>
                <div className="detail">
                  <img src="assets/img/msg.png" alt="img" className="image-block imaged w48" />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.date}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {showBlank ? (
              <div className="card mt-2">
                <div className="card-body">
                  No notifications to show yet .
                </div>
              </div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "calc(100vh - 160px)" }}
            >
              <div className="spinner-border text-success" role="status"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Notification
