import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { SITE_URL, isAuthenticated } from "../Auth/Define"
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../Components/Toast';
import "./KYC.css"

const ranks = [
  { label: "IBT", target: "Joining", team: "Nill", income: "BTime" },
  { label: "Rising", target: "2 Direct", team: "100", income: "1 %" },
  { label: "Master", target: "4 Direct", team: "250", income: "1.5 %" },
  { label: "Rapid", target: "6 Direct", team: "500", income: "2 %" },
  { label: "Million", target: "8 Direct", team: "2500", income: "2.5 %" },
  { label: "Billion", target: "10 Direct", team: "10000", income: "3 %" },
];

const currentStep = 1;

const Team = () => {

  const navigate = useNavigate();
  const [directTeam, setDirectTeam] = useState(0);
  const [totalTeam, setTotalTeam] = useState(0);
  const [showToast, setShowToast] = useState({
    msg: "",
    type: "",
    show: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      const formData = new FormData();
      formData.append("cuid", isAuthenticated)
      axios.post(`${SITE_URL}/api/get-api/team.php`, formData).then(resp => {
        if (resp.data.length > 0) {
          setDirectTeam(resp.data.length);
        }
      })
      // xxxxxxxxxxx //
      axios.post(`${SITE_URL}/api/get-api/level-team.php`, formData).then(resp => {
        if (resp.data.length > 0) {
          const totalLength = resp.data.reduce((acc, arr) => acc + arr.length, 0);
          setTotalTeam(totalLength);
        }
      })


    }
  }, [])



  const viewTeam = (type) => {
    if (directTeam > 0 || totalTeam > 0) {
      navigate("/team-list", { state: { type } });
    } else {
      setShowToast({ msg: "There are no data to show", type: "danger", show: true });
      setTimeout(() => {
        setShowToast({ msg: "", type: "", show: false });
      }, 2000);
    }
  };



  return (
    <div className="section">
      {

      }
      <div className="row mt-2">
        <div className="col-6">
          <div className="stat-box" onClick={() => viewTeam("D")}>
            <div className="title">Total Direct</div>
            <div className="value text-success" style={{ fontSize: "16px" }}>{directTeam} Members</div>
          </div>
        </div>
        <div className="col-6">
          <div className="stat-box" onClick={() => viewTeam("L")}>
            <div className="title">Total Team</div>
            <div className="value text-danger" style={{ fontSize: "16px" }}>{totalTeam} Members</div>
          </div>
        </div>
      </div>

      {/* xxxxxxxxxxxx Refer & Earn xxxxxxxxxxxx */}

      <div className="row mt-2">
        <div className="col-12">
          <div className="stat-box d-flex justify-content-between aign-items-center">
            <div>
              <div className="title" style={{ fontSize: '16px' }}>Refer & Earn</div>
              <div className="value">
                <Link to={"/refer"} className='btn btn-success btn-sm'>Share</Link>
              </div>
            </div>
            <div className="right text-right" style={{ width: "60px" }}>
              <img src="/assets/img/refer-earn.png" className='img-fluid' style={{ height: "100%", width: "100%" }} alt="trophy" />
            </div>
          </div>
        </div>
      </div>

      {/* xxxxxxxxxxxxxxx Ranks xxxxxxxxxxxxxxx */}

      <div className="rank-container mt-2">
        <h3 className="table-title">Your Rank</h3>
        <div className="stepper">
          {ranks.map((rank, index) => (
            <div className="step-item" key={index}>
              <div className="step-marker">
                <div
                  className={`circle ${index < currentStep
                    ? "completed"
                    : index === currentStep
                      ? "current"
                      : ""
                    }`}
                >
                  {index < currentStep ? "✔" : index + 1}
                </div>

                {index !== ranks.length - 1 && <div className="vertical-line" />}
              </div>

              <div className={`step-content ${index < currentStep ? "completed2" : ""}`}>
                <div className="step-label">{rank.label}</div>
                <div className="step-info">
                  <span>
                    <strong>Target:</strong> {rank.target}
                  </span>
                  <span>
                    <strong>Team:</strong> {rank.team}
                  </span>
                  <span>
                    <strong>Income:</strong> {rank.income}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Toast msg={showToast.msg} type={showToast.type} show={showToast.show} />
    </div>
  )
}

export default Team
