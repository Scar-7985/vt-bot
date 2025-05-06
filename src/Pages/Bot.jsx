import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';
import './Hourglass.css';
import LottieGIF from '../Components/LottieGIF';

const Bot = () => {
    const navigate = useNavigate();

    const [botData, setBotData] = useState(null);
    const [pBotData, setPBotData] = useState(null);
    const [timeLeft, setTimeLeft] = useState('00:00:00');
    const [botStatus, setBotStatus] = useState(0);
    const [rejectedReason, setRejectedReason] = useState(null);

    // Fetch bot data and profile info

    useEffect(() => {
        if (isAuthenticated) {
            const form = new FormData();
            form.append('cuid', isAuthenticated);

            axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form)
                .then(resp => {
                    setPBotData({
                        bot_pdate: resp.data.bot_pdate,
                        bot_expiry: resp.data.bot_expiry,
                        status: resp.data.status,
                    })

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

    // xxxxxxxxxxxxxxxxxx //

    useEffect(() => {
        if (isAuthenticated) {
            const form = new FormData();
            form.append('cuid', isAuthenticated);
            axios.post(`${SITE_URL}/api/get-api/bot.php`, form).then(resp => {
                setBotData(resp.data)
            })
        }
    }, [])




    // Fetch transaction remarks (if any)
    useEffect(() => {
        const form = new FormData();
        form.append("cuid", isAuthenticated);

        axios.post(`${SITE_URL}/api/get-api/transaction.php`, form)
            .then(resp => {
                if (resp.data) {
                    const filteredRemarks = resp.data.find(item => item.txnremarks);
                    setRejectedReason(filteredRemarks?.txnremarks);
                }
            })
            .catch(err => console.error("Error fetching transaction data:", err));
    }, []);

    const checkKycStatus = () => {

        if (isAuthenticated && botData) {
            navigate("/purchase", { state: { prevPath: "/bot" } });
        };
    }


    const TimeBox = ({ label, value }) => (
        <div
            className='rounded p-2'
            style={{
                backgroundColor: "#1c1c3c",
                textAlign: "center",
                color: "white",
                lineHeight: "14px"
            }}
        >
            <div style={{ fontSize: "24px", fontWeight: "bold" }}>{value}</div>
            <div className='mt-1' style={{ fontSize: "12px", color: "#ccc" }}>{label}</div>
        </div>
    );



    return (
        <div className='section'>
            {botData ? (
                <div className="">
                    {
                        (botStatus === 0 || botStatus === 4) &&

                        <div className="bill-box mt-2">
                            <div className="img-wrapper d-flex flex-column align-items-center">
                                <div style={{ width: "100px" }}>
                                    <LottieGIF />
                                </div>
                                <h3 className="mt-1">Trading Bot</h3>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <strong>Amount</strong>
                                <p className="m-0 fs-8 fw-bold">${botData.amount}</p>
                            </div>

                            <div className="d-flex justify-content-between">
                                <strong>Validity</strong>
                                <p className="m-0 fs-8">{botData.duration} days</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Status</strong>
                                <strong className={`m-0 fs-8 text-${botStatus === 1 ? "warning" : botStatus === 2 ? "success" : "danger"}`}>
                                    {
                                        botStatus === 1
                                            ? "In Review"
                                            : botStatus === 2
                                                ? "Active"
                                                : botStatus === 3
                                                    ? "Rejected"
                                                    : botStatus === 4
                                                        ? "Expired"
                                                        : "Not purchased yet"
                                    }
                                </strong>
                            </div>


                            {/* Payment Options */}
                            {
                                (botStatus === 0 || botStatus === 3 || botStatus === 4) &&
                                <div className="mt-2 d-flex align-items-center justify-content-between">
                                    <label htmlFor="upi" className="w-100 d-flex align-items-center">
                                        <input type="radio" id="upi" defaultChecked />
                                        <strong className="ml-2">UPI</strong>
                                    </label>
                                    <label htmlFor="wallet" className="w-100 d-flex align-items-center">
                                        <input type="radio" id="wallet" disabled />
                                        <strong className="ml-2">Wallet</strong>
                                    </label>
                                </div>
                            }


                            {/* Main Action Button */}
                            <a
                                className={`btn ${botStatus === 1 || botStatus === 2 ? "d-none" : ""} btn-primary btn-block mt-2`}
                                onClick={(botStatus === 0 || botStatus === 3 || botStatus === 4) ? checkKycStatus : null}
                            >
                                Buy Now
                            </a>





                            {/* Rejection Reason */}
                            {botStatus === 3 && (
                                <div className='mt-2'>
                                    Your previous bot was rejected. <br />
                                    <strong style={{ fontSize: '14px' }}>Reason: </strong>
                                    <span className='m-0 text-danger'>{rejectedReason}</span>
                                </div>
                            )}
                        </div>
                    }

                    {
                        (botStatus !== 0 && botStatus !== 4) &&
                        <div className="bill-box mt-2">
                            <div className="img-wrapper d-flex flex-column align-items-center">
                                <div style={{ width: "100px" }}>
                                    <LottieGIF />
                                </div>
                                <h3 className="mt-1">Trading BOT</h3>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <strong>Purchased Date</strong>
                                <p className="m-0 fs-8 fw-bold">{pBotData?.bot_pdate}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <strong>Expiry</strong>
                                <p className="m-0 fs-8 fw-bold">{pBotData?.bot_expiry}</p>
                            </div>

                            <div className="d-flex justify-content-between">
                                <strong>Status</strong>
                                <strong className={`m-0 fs-8 text-${botStatus === 1 ? "warning" : botStatus === 2 ? "success" : "danger"}`}>
                                    {
                                        botStatus === 1
                                            ? "In Review"
                                            : botStatus === 2
                                                ? "Active"
                                                : botStatus === 3
                                                    ? "Rejected"
                                                    : botStatus === 4
                                                        ? "Expired"
                                                        : "Not purchased yet"
                                    }
                                </strong>
                            </div>


                            {/* Payment Options */}
                            {
                                (botStatus !== 1 && botStatus !== 2) &&
                                <div className="mt-2 d-flex align-items-center justify-content-between">
                                    <label htmlFor="upi" className="w-100 d-flex align-items-center">
                                        <input type="radio" id="upi" defaultChecked />
                                        <strong className="ml-2">UPI</strong>
                                    </label>
                                    <label htmlFor="wallet" className="w-100 d-flex align-items-center">
                                        <input type="radio" id="wallet" disabled />
                                        <strong className="ml-2">Wallet</strong>
                                    </label>
                                </div>
                            }


                            {/* Main Action Button */}
                            <a
                                className={`btn ${botStatus === 1 || botStatus === 2 ? "d-none" : ""} btn-primary btn-block mt-2`}
                                onClick={(botStatus === 0 || botStatus === 3 || botStatus === 4) ? checkKycStatus : null}
                            >
                                Buy Now
                            </a>


                            {/* Hourglass Loader  */}
                            {
                                botStatus === 1 &&
                                <div>
                                    <div className={`w-100 mt-2 bg-dark p-2 rounded d-flex flex-column justify-content-center align-items-center`}>
                                        <div className="hourglass"></div>
                                    </div>
                                    <h6 className='mt-2 text-muted'>Your bot purchase is in review.</h6>
                                </div>
                            }


                            {/* Rejection Reason */}
                            {botStatus === 3 && (
                                <div className='mt-2'>
                                    Your bot purchase was rejected. <br />
                                    <strong style={{ fontSize: '14px' }}>Reason: </strong>
                                    <span className='m-0 text-danger'>{rejectedReason}</span>
                                </div>
                            )}
                        </div>
                    }


                    {/* xxxxxxxxxxxxx Countdown Timer xxxxxxxxxxxxx */}
                    <h6 className='m-0'>

                        {botStatus === 2 && (
                            <div
                                className='mt-2 d-flex justify-content-around align-items-center'
                                style={{ gap: "3px" }}
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
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "calc(100vh - 160px)" }}>
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            )
            }
        </div>
    );
};

export default Bot;
