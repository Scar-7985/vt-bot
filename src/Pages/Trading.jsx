import React, { useEffect, useState } from "react";
import { SITE_URL, isAuthenticated } from "../Auth/Define"
import axios from "axios";
import { Link } from "react-router-dom";

const currencies = ["GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD"];

const Trading = () => {

  const [showTrading, setShowTrading] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      const form = new FormData();
      form.append('cuid', isAuthenticated);
      axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
        setShowTrading(resp.data.investment_status === 2)
      })
    }
  }, [])

  const generateId = () => {
    const num = Math.floor(Math.random() * 1000);
    return "VT" + String(num).padStart(3, "0") + "...";
  };

  const generateFakeData = () => {
    const fakeData = Array.from({ length: 30 }).map(() => {
      const invested = +(Math.random() * 5000 + 500).toFixed(2);
      const current = +(invested * (0.9 + Math.random() * 0.2)).toFixed(2);
      return {
        name: currencies[Math.floor(Math.random() * currencies.length)],
        invested,
        current,
        id: generateId(),
      };
    });
    return fakeData;
  };

  useEffect(() => {
    setData(generateFakeData());

    const interval = setInterval(() => {
      setData(generateFakeData());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section pb-2">
      {
        showTrading
          ? (
            <div className="portfolio">
              <div className="holdings">
                <div className="text-center mt-2">
                  <h3>Live Trading</h3>
                </div>
                {data.map((investor, idx) => {
                  const pl = investor.current - investor.invested;
                  const plPercent = ((pl / investor.invested) * 100).toFixed(2);
                  const isProfit = pl >= 0;

                  return (
                    <div className="stock p-2 rounded" key={idx}>
                      <div className="d-flex align-items-center">
                        <div className={`icon-box bg-${isProfit ? "success" : "danger"} text-white d-flex justify-content-center align-items-center`} style={{ borderRadius: "50%", width: "35px", height: "35px" }}>
                          <span className="material-symbols-outlined">
                            {isProfit ? "south_west" : "call_made"}
                          </span>
                        </div>
                        <div className="flex-grow-1 ml-1">
                          <div className="d-flex justify-content-between">
                            <span className="text-dark fw-bold">{investor.name}</span>
                            <span style={{ color: isProfit ? "green" : "red" }}>
                              {isProfit ? "+" : ""}
                              {pl.toFixed(2)} ({plPercent}%)
                            </span>
                          </div>
                          <div className="d-flex justify-content-between text-muted small">
                            <span>{investor.id}</span>
                            <span>{investor.current.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
          : (
            <div className="mt-2">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Start Investing</h5>
                  <p className="card-text">Begin your financial journey today.</p>
                  <Link to={"/investment"} className="btn btn-primary">Get Started</Link>
                </div>
              </div>
            </div>
          )
      }

    </div>
  );
}


export default Trading;