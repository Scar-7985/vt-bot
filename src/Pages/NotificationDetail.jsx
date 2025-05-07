import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import { useLocation, useNavigate } from 'react-router-dom';

const NotificationDetail = () => {

  const location = useLocation();
  const { viewId } = location.state;
  const [notificationData, setNotificationData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      axios.post(`${SITE_URL}/api/get-api/notice.php`).then(resp => {
        if (resp.data.length > 0) {
          const filteredData = resp.data.find((item) => Number(item.id) === Number(viewId));

          setNotificationData(filteredData)
        } else {
          setShowBlank(true)
        }
        console.log("Notice data ", resp.data);
      })
    }

  }, [])

  return (
    <div className='section'>
      {
        notificationData ?

          (
            <div className='card mt-3 mb-2'>
              <div className="card-body">
                <div className="listed-detail mt-3">
                  <h3 className="text-center mt-2">{notificationData.title}</h3>
                </div>
                <p className='mt-3' dangerouslySetInnerHTML={{ __html: notificationData.description }} />
              </div>
            </div>
          ) : (
            <div className='d-flex justify-content-center align-items-center' style={{ height: "calc(100vh - 160px)" }}>
              <div className="spinner-border text-success" role="status"></div>
            </div>
          )
      }
    </div>
  )
}

export default NotificationDetail
