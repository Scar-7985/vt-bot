import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import LottieGIF from './LottieGIF';

const Footer = () => {
  const location = useLocation();

  const menuItems = [
    { title: "Home", icon: "home_app_logo", path: "/" },
    { title: "Community", icon: "groups", path: "/team" },
    { title: "Investment", icon: "BOT", path: "/" },
    { title: "Pocket", icon: "account_balance_wallet", path: "/pocket" },
    { title: "Account", icon: "manage_accounts", path: "/profile" },

  ];

  return (
    <div className="appBottomMenu border-0 shadow">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const isDiamond = item.icon === "BOT";
        return (
          <Link key={index} to={item.path} className={`item ${isActive ? "active" : ""}`}>
            <div className="col">
              <span className={`material-symbols-outlined ${isDiamond ? "action-button large" : ""}`}
                style={{ color: `${isActive ? "" : `${item.icon === "BOT" ? "#fff" : "#27173E"}`}` }} >
                {
                  isDiamond ? (<div style={{
                    width: "50px",
                    // width: "70px",
                  //  marginTop: "-38px"
                   }}><LottieGIF /></div>) : `${item.icon}`
                }
              </span>

              <strong className={`${item.title === "Investment" ? "mb-1" : ""}`}>{item.title}</strong>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Footer;