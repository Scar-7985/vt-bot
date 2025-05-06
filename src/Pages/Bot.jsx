import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';
import './Hourglass.css';
import LottieGIF from '../Components/LottieGIF';

const Bot = () => {
    const navigate = useNavigate();

    const [botData, setBotData] = useState(null);
    const [botStatus, setBotStatus] = useState(0);
    const [rejectedReason, setRejectedReason] = useState(null);
    const [botExpired, setBotExpired] = useState(false);

    // Fetch bot data and profile info
    useEffect(() => {
        if (isAuthenticated) {
            axios.post(`${SITE_URL}/api/get-api/bot.php`)
                .then(resp => {
                    // console.log(resp.data);

                    setBotData(resp.data)
                }
                )
                .catch(err => console.error("Error fetching bot data:", err));

            const form = new FormData();
            form.append("cuid", isAuthenticated);

            axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form)
                .then(resp => {
                    const botExpiryStr = resp.data.bot_expiry; // e.g. 04-02-2025 13:02
                    const [day, month, yearAndTime] = botExpiryStr.split("-");
                    const [year, time] = yearAndTime.split(" ");
                    const [hours, minutes] = time.split(":");
                    const botExpiryDate = new Date(
                        Number(year),
                        Number(month) - 1,
                        Number(day),
                        Number(hours),
                        Number(minutes)
                    );

                    const currentDate = new Date();
                    if (currentDate > botExpiryDate) {
                        setBotExpired(true);
                    }

                    setBotStatus(Number(resp.data.bot_status));
                })
                .catch(err => console.error("Error fetching profile info:", err));
        }
    }, []);

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

    useEffect(() => {

        axios.post(`${SITE_URL}/api/get-api/notice.php`).then(resp => {
            console.log("Notice data ", resp.data);
        })

    }, [])

    return (
        <div className='section'>
            {botData ? (
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
                                            ? "Inactive"
                                            : botStatus === 4
                                                ? "Expired"
                                                : "Not purchased yet"
                            }
                        </strong>
                    </div>


                    {/* Payment Options */}
                    <div className={`mt-2 align-items-center justify-content-between ${(botStatus === 0 || botStatus === 3 || (botStatus === 2 && botExpired)) ? "d-flex" : "d-none"}`}>
                        <label htmlFor="upi" className="w-100 d-flex align-items-center">
                            <input type="radio" id="upi" defaultChecked />
                            <strong className="ml-2">UPI</strong>
                        </label>
                        <label htmlFor="wallet" className="w-100 d-flex align-items-center">
                            <input type="radio" id="wallet" disabled />
                            <strong className="ml-2">Wallet</strong>
                        </label>
                    </div>

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
                        <div className={`w-100 mt-2 bg-dark p-2 rounded ${botStatus === 1 ? 'd-flex' : 'd-none'} flex-column justify-content-center align-items-center`}>
                            <div className="hourglass"></div>
                        </div>
                    }


                    {/* Rejection Reason */}
                    {botStatus === 3 && (
                        <div className='mt-2'>
                            Your previous bot was rejected. <br />
                            <strong style={{ fontSize: '14px' }}>Reason: </strong>
                            <span className='m-0 text-danger'>{rejectedReason}</span>
                        </div>
                    )}
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
