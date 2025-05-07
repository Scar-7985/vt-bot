
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title, showLogo = false }) => {


  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  }



  return (
    <div className={`appHeader bg-primary text-light`}>
      <div className="left pageTitle" onClick={!showLogo ? handleGoBack : null}>
        {
          showLogo
            ? <img src={`/assets/img/logo.png`} loading='lazy' alt="" className="logo" />
            : <span className="material-symbols-outlined">
              chevron_left
            </span>
        }
      </div>
      {
        !showLogo && <div className="">
          {title}
        </div>
      }

      <div className="right">
        <Link to={"/notification"} className="headerButton">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            notifications
          </span>
        </Link>
      </div>
    </div>
  )
}

export default Header
