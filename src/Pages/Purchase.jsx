import React, { useEffect, useState } from 'react';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toast from '../Components/Toast';
import Header from '../Components/Header';

const Purchase = () => {

    const location = useLocation();
    const { prevPath, amount } = location.state || {};
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState(false);
    const [coinPaymentData, setCoinPaymentData] = useState(null);
    const [botData, setBotData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [coinTxnId, setCoinTxnId] = useState(null);
    const [modalData, setModalData] = useState({
        status: "",
        title: "",
        body: ""
    })

    const [showToast, setShowToast] = useState({
        msg: "",
        type: "",
        show: false
    });

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


    useEffect(() => {
        if (!isAuthenticated) return;
        // xxxxxxxxxxxxx Setting Bot Data xxxxxxxxxxxxx //
        axios.post(`${SITE_URL}/api/get-api/bot.php`).then(resp => {
            if (prevPath === "/bot") {
                setBotData(resp.data);
            } else if (prevPath === "/investment") {
                setBotData({ amount: amount, description: resp.data.description })
            }
        });
    }, [prevPath]);



    useEffect(() => {
        if (!isAuthenticated) return;
        if (!botData) return;
        // xxxxxxxxxxxxx Create CoinPayments xxxxxxxxxxxxx //
        const formData = new FormData();
        formData.append("email", window.localStorage.getItem("userEmail:"))
        formData.append("amount", botData?.amount)
        axios.post(`${SITE_URL}/api/post-api/CoinPayments/purchase.php`, formData).then(resp => {
            console.log(resp.data);

            if (resp.data.error === "ok") {

                setCoinTxnId(resp.data.result.txn_id);

                const currentDate = new Date();
                const expiryDate = new Date();
                expiryDate.setDate(currentDate.getDate() + botData.duration);

                const formatDateTime = (date) => {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                };

                setCoinPaymentData(resp.data.result);
                const txnId = resp.data.result.txn_id;

                // https://www.coinpayments.net/index.php?cmd=status&id=CPJE3ECASPIOGN4XYAKAX4WMR0&key=dd3462bcfc7d558cc353ab2fad39a84b //

                const transactionData = new FormData();
                transactionData.append("cuid", isAuthenticated)
                transactionData.append("txnamount", botData?.amount)
                transactionData.append("txndate", formatDateTime(currentDate));
                transactionData.append("txntype", "d");
                transactionData.append("coinid", txnId);

                if (prevPath === "/bot") {
                    transactionData.append("bot_expiry", formatDateTime(expiryDate));
                    transactionData.append("txnname", "Purchased Bot");
                } else {
                    transactionData.append("txnname", "Investment");
                }

                axios.post(`${SITE_URL}/api/post-api/${prevPath === "/bot" ? "coin_payment.php" : "coin_investment.php"}`, transactionData).then(resp => {
                    console.log(resp.data);
                })

            }
        })
    }, [botData]);



    const CheckStatus = () => {
        if (!isAuthenticated || !coinTxnId) return;

        setLoadingState(true);
        const coinTxnData = new FormData();

        coinTxnData.append("cuid", isAuthenticated);
        coinTxnData.append("txn_id", coinTxnId);
        coinTxnData.append("txn_type", prevPath === "/bot" ? "BOT" : "INV");

        axios.post(`${SITE_URL}/api/post-api/CoinPayments/check_status.php`, coinTxnData)
            .then(resp => {
                console.log(resp.data);
                setLoadingState(false);
                const status = resp.data.status;
                if (status === 2) {
                    setModalData({ status: 2, title: "Success", body: "You payment has been confirmed." });
                    setShowModal(true);
                } else if (status === 1) {
                    setModalData({ status: 1, title: "In Review", body: "Your transaction is being verified." });
                    setShowModal(true);
                } else if (status === 0) {
                    setModalData({ status: 1, title: "Unpaid", body: "Payment not received yet." });
                    setShowModal(true);
                } else if (status === 3) {
                    setModalData({ status: 3, title: "Timed Out", body: "Transaction was cancelled." });
                    setShowModal(true);
                }
            })
    };

    const handleCopy = () => {

        navigator.clipboard.writeText(coinPaymentData?.address).then(() => {
            setShowToast({
                msg: "Address Copied",
                type: "success",
                show: true
            })
        });
        setTimeout(() => {
            setShowToast({ msg: "", type: "", show: false })
        }, 2000);
    };



    return (
        <div>

            <Header title={prevPath === "/bot" ? "QR Payment" : "Investment"} />

            <div className='section mb-5'>
                {
                    botData ? (
                        <React.Fragment>

                            <div className='d-flex flex-column'>
                                <div className="card mt-2" >
                                    <div className="card-body d-flex flex-column align-items-center">
                                        <h2>Pay Now</h2>
                                        <img src={coinPaymentData?.qrcode_url} className='img-fluid w-75' loading='lazy' alt=""
                                            style={{ minWidth: `${coinPaymentData ? "" : "200px"}`, minHeight: `${coinPaymentData ? "" : "200px"}` }} />
                                        <div className='mt-3 text-dark text-center d-flex flex-column'>
                                            <div style={{ fontSize: "12px" }}>{coinPaymentData?.address}</div>
                                            <strong style={{ fontSize: "12px" }}>BEP20</strong>
                                            <button className='btn btn-success '>

                                                <span className={`material-symbols-outlined`} onClick={handleCopy}>
                                                    content_copy
                                                </span>
                                            </button>
                                        </div>
                                        <span className='mt-3 text-dark'>
                                            Please pay
                                            <strong>
                                                {/* ${botData ? botData.amount : amount} */}
                                                {" "}
                                                ${coinPaymentData?.amount}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                                <div className="card mt-2" >
                                    <div className="card-body text-justify" style={{ fontSize: "12px" }}>
                                        <strong>Important:</strong><br />
                                        <span className='text-danger' dangerouslySetInnerHTML={{ __html: botData.description }} />

                                    </div>
                                </div>

                                <button className='btn btn-primary mt-2' onClick={CheckStatus}>Check Payment Status</button>
                            </div>
                        </React.Fragment>
                    ) : (
                        <div className='d-flex justify-content-center align-items-center' style={{ height: "calc(100vh - 160px)" }}>
                            <div className="spinner-border text-success" role="status"></div>
                        </div>
                    )
                }

                {showModal &&
                    <>
                        <div className="modal fade dialogbox show d-block" tabIndex="-1" role="dialog"
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}></div>
                        <div className="modal fade dialogbox show d-block">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-icon">
                                        <span className={`material-symbols-outlined text-${modalData.status === 2 ? "success" : modalData.status === 1 ? "warning" : modalData.status === 3 ? "danger" : modalData.status === 0 ? "warning" : "warning"}`}
                                            style={{ fontVariationSettings: "'FILL' 1", fontSize: '50px' }}>
                                            {modalData.status === 2 ? "task_alt" : modalData.status === 1 ? "pending_actions" : modalData.status === 3 ? "cancel" : modalData.status === 0 ? "pending_actions" : "question_mark"}
                                        </span>
                                    </div>
                                    <div className="modal-header">
                                        <h5 className={`modal-title text-${modalData.status === 2 ? "success" : modalData.status === 1 ? "warning" : modalData.status === 3 ? "danger" : modalData.status === 0 ? "warning" : "warning"}`}>
                                            {modalData.title}
                                        </h5>
                                    </div>
                                    <div className="modal-body">
                                        {
                                            modalData.body
                                        }

                                    </div>
                                    <div className="modal-footer">
                                        <div className="btn-inline">
                                            <Link to={"/transaction"} className="btn">Okay</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    loadingState &&

                    <div className="modal fade dialogbox show d-flex justify-content-center align-items-center" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                        <div className="modal fade dialogbox show d-flex justify-content-center align-items-center" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                            <div class="spinner-border text-warning" role="status"
                                style={{ width: "50px", height: "50px", borderWidth: "4px" }}></div>
                        </div>
                    </div>
                }

                <Toast msg={showToast.msg} type={showToast.type} show={showToast.show} />
            </div>
        </div>
    );
};

export default Purchase;
