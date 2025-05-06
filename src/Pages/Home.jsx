import React, { useState, useEffect } from 'react';
import LottieGIF from '../Components/LottieGIF';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();
  const [botStatus, setBotStatus] = useState(0);
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  // xxxxxxxxxxxxxxxxxxxxxxxx Bot Starts xxxxxxxxxxxxxxxxxxxxxxxx //

  useEffect(() => {
    if (isAuthenticated) {
      const form = new FormData();
      form.append('cuid', isAuthenticated);

      axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form)
        .then(resp => {
          console.log(resp.data);

          const botExpiryStr = resp.data.bot_expiry;   // e.g. "05-06-2025"
          const botPurchaseStr = resp.data.bot_pdate;  // e.g. "06-05-2025"

          setBotStatus(Number(resp.data.bot_status));

          // Parse expiry date (DD-MM-YYYY) and assume it expires at 23:59:59
          const [expDay, expMonth, expYear] = botExpiryStr.split('-');
          const expiryDate = new Date(`${expYear}-${expMonth}-${expDay}T23:59:59`);

          let remainingMs = expiryDate - new Date();

          let timerInterval;

          const updateTimer = () => {
            if (remainingMs <= 0) {
              setTimeLeft("00:00:00");
              clearInterval(timerInterval);
              navigate('/purchase-bot');
            } else {
              const totalSeconds = Math.floor(remainingMs / 1000);
              const days = Math.floor(totalSeconds / (3600 * 24));
              const hrs = String(Math.floor((totalSeconds % (3600 * 24)) / 3600)).padStart(2, '0');
              const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
              const secs = String(totalSeconds % 60).padStart(2, '0');

              const formatted = days > 0
                ? `${days}d ${hrs}:${mins}:${secs}`
                : `${hrs}:${mins}:${secs}`;

              setTimeLeft(formatted);
              remainingMs -= 1000;
            }
          };

          updateTimer(); // Initial call
          timerInterval = setInterval(updateTimer, 1000);

          // Clear on unmount
          return () => clearInterval(timerInterval);
        })
        .catch(error => {
          console.error("Failed to fetch bot status:", error);
        });
    }
  }, []);


  useEffect(() => {
    if (!document.getElementById("tv-ticker-script")) {
      const script = document.createElement("script");
      script.id = "tv-ticker-script";
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: "adaptive",
        colorTheme: "light",
        locale: "en",
      });
      document.getElementById("ticker-tape-container")?.appendChild(script);
    }
  }, []);
  // xxxxxxxxxxxxxxxxx Trade View Ends xxxxxxxxxxxxxxxxx //


  // xxxxxxxxxxxxxxxxx Trade Graph Starts xxxxxxxxxxxxxxxxx //

  useEffect(() => {
    if (!document.getElementById("tv-advanced-script")) {
      const script = document.createElement("script");
      script.id = "tv-advanced-script";
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "1",
        timezone: "Asia/Kolkata",
        theme: "light",
        style: "1",
        locale: "en",
        height: "400",
        allow_symbol_change: true,
        support_host: "https://www.tradingview.com",
      });

      document.getElementById("tv-advanced-chart")?.appendChild(script);

      const style = document.createElement("style");
      style.innerHTML = `
          .tradingview-widget-copyright {
            display: none !important;
          }
        `;
      document.head.appendChild(style);
    }
  }, []);

  // xxxxxxxxxxxxxxxxx Trade Graph Ends xxxxxxxxxxxxxxxxx //

  const botNavigate = () => {
    navigate("/bot");
  }

  const goInvest = () => {
    navigate("/investment")
  }

  const TimeBox = ({ label, value }) => (
    <div
      style={{
        backgroundColor: "#1c1c3c",

        padding: "8px",
        borderRadius: "2px",
        width: "40px",
        height: "35px",
        textAlign: "center",
        color: "white",
        lineHeight: "14px"
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "7px", color: "#ccc" }}>{label}</div>
    </div>
  );

  return (
    <div className='pb-5'>
      {/* xxxxxxxxxx Bot Starts xxxxxxxxxx */}
      <div className="section wallet-card-section pt-4">
        <div className="wallet-card" onClick={botNavigate}>
          <div className="balance">
            <div className="left">
              <h2 className="title d-flex justify-content-between align-items-center m-0">
                <span>VT BOT</span>
              </h2>
              <span className='text-success'>IBT</span>
              <p className={`m-0 p-0`}>
                Expires in
                <br />
              </p>
              {
                (botStatus === 0 || botStatus === 3 || botStatus === 4) &&
                <button className='btn btn-success btn-sm'>Buy Now</button>
              }
              <h6 className='m-0'>

                {botStatus === 2 && (
                  <div
                    style={{ display: "flex", gap: "3px", marginTop: "10px" }}
                  >
                    {(() => {
                      const parts = timeLeft.split(/[:\s]/);
                      const isWithDays = timeLeft.includes("d");
                      const timeBoxes = [];

                      if (isWithDays) {
                        timeBoxes.push(
                          <TimeBox
                            key="days"
                            label="Days"
                            value={parts[0].replace("d", "")}
                          />
                        );
                        timeBoxes.push(
                          <TimeBox key="hrs" label="Hr" value={parts[1]} />
                        );
                        timeBoxes.push(
                          <TimeBox key="mins" label="Min" value={parts[2]} />
                        );
                        timeBoxes.push(
                          <TimeBox key="secs" label="Sec" value={parts[3]} />
                        );
                      } else {
                        timeBoxes.push(
                          <TimeBox key="hrs" label="Hr" value={parts[0]} />
                        );
                        timeBoxes.push(
                          <TimeBox key="mins" label="Min" value={parts[1]} />
                        );
                        timeBoxes.push(
                          <TimeBox key="secs" label="Sec" value={parts[2]} />
                        );
                      }

                      return timeBoxes;
                    })()}
                  </div>
                )}
              </h6>
            </div>
            <div className="right" style={{ width: '100px' }}>
              <LottieGIF />
            </div>
          </div>
        </div>
      </div>
      {/* xxxxxxxxxx Bot Ends xxxxxxxxxx */}
      <div className='section'>
        {/* xxxxxxxxxx TradingView Tape Starts xxxxxxxxxx */}
        <div className="mt-2" style={{ position: "relative" }}>
          <div
            className="tradingview-widget-container"
            id="ticker-tape-container"
          >
            <div className="tradingview-widget-container__widget"></div>
          </div>
          <div className="disable-clicks"></div>
        </div>
        {/* xxxxxxxxxx TradingView Tape Ends xxxxxxxxxx */}

        {/* xxxxxxxxxxxxx Investment Starts xxxxxxxxxxxxx */}



        <div className="wallet-card mt-2" onClick={goInvest}>
          <div className="balance">
            <div className="left">
              <h2 className="title m-0">Investment</h2>
              <strong className='text-dark'>Portfolio</strong><br />
              <button type="button" class="btn btn-icon btn-primary mt-1">
                <span class="material-symbols-outlined">
                  crowdsource
                </span>
              </button>
            </div>
            <div className="right text-right" style={{ width: "60px" }}>
              <img src="/assets/img/money-bag.png" className='img-fluid' style={{ height: "100%", width: "100%" }} alt="trophy" />
            </div>
          </div>
        </div>

        {/* xxxxxxxxxxxxx Investment Ends xxxxxxxxxxxxx */}

        {/* xxxxxxxxxxxxx Trade View Starts xxxxxxxxxxxxx */}

        <div className='mt-2' style={{ position: "relative" }}>
          <div
            className="tradingview-widget-container"
            style={{ height: "100%", width: "100%" }}
          >
            <div
              id="tv-advanced-chart"
              className="tradingview-widget-container__widget"
              style={{ height: "calc(100% - 32px)", width: "100%" }}
            ></div>
          </div>
          <div className="disable-clicks"></div>
        </div>

        {/* xxxxxxxxxxxxx Trade View Ends xxxxxxxxxxxxx */}
      </div>
    </div>
  );
};

export default Home;
