import React, { useState, useEffect } from 'react'
import { isAuthenticated, SITE_URL } from '../Auth/Define';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const TeamList = () => {

  const [showDirect, setShowDirect] = useState(true);
  const [directTeam, setDirectTeam] = useState([]);
  const [levelsData, setLevelsData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation()
  const { type } = location.state;


  useEffect(() => {

    if (isAuthenticated) {
      const formData = new FormData();
      formData.append("cuid", isAuthenticated)

      if (type === "L") {
        setShowDirect(false)
        axios.post(`${SITE_URL}/api/get-api/level-team.php`, formData).then(resp => {
          setLevelsData(resp.data)
        })
      } else {
        axios.post(`${SITE_URL}/api/get-api/team.php`, formData).then(resp => {
          if (resp.data.length > 0) {
            setDirectTeam(resp.data);
          }
        })
      }

    }
  }, [type])

  const viewLevelList = (Id) => {
    navigate("/level-list", { state: { viewId: Id } })
  }

  return (
    <div>
      <Header title={type === "D" ? "Direct Team" : "Levels"} />
      <div className="section pb-5">
        {
          showDirect
            ? (
              <div >
                {
                  directTeam.length > 0 &&
                  directTeam.map((item, index) => {
                    return (
                      <div className="transactions mt-2" key={index}>
                        <a className="item">
                          <div className="detail">
                            <img src={`${SITE_URL}/upload/user/${item.photo ? item.photo : "user-default-image.png"}`} alt="img" className="image-block imaged w48" />
                            <div>
                              <strong>{item.name}</strong>
                              <p>{item.reg_date}</p>
                            </div>
                          </div>
                          <div className="right">
                            <div className={`price text-${item.bot_status === 2 ? 'success' : 'danger'}`}>
                              {item.bot_status === 2 ? "Active" : "Inactive"}
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  })
                }

              </div>
            ) : (
              <div className="row mt-2">
                {
                  levelsData.length > 0 && levelsData.map((levelMembers, levelIndex) => (
                    <div className="col-6 mb-3" key={levelIndex}>
                      <div className="stat-box" onClick={() => viewLevelList(levelIndex)}>
                        <div className="title">Level {levelIndex + 1}</div>
                        <div className="value text-success" style={{ fontSize: "16px" }}>
                          {levelMembers.length} Members
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>

            )
        }

      </div>
    </div>
  )
}

export default TeamList
