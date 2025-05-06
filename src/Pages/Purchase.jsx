import React, { useEffect, useState } from 'react';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toast from '../Components/Toast';
import Header from '../Components/Header';

const Purchase = () => {

    const location = useLocation();
    const { prevPath, amount } = location.state || {};

    const [loadingState, setLoadingState] = useState(false);
    const [botData, setBotData] = useState(null);
    const [proofImg, setProofImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        body: ""
    })

    const [showToast, setShowToast] = useState({
        msg: "",
        type: "",
        show: false
    });

    useEffect(() => {
        if (isAuthenticated) {


            axios.post(`${SITE_URL}/api/get-api/bot.php`).then(resp => {
                if (prevPath === "/bot") {
                    setBotData(resp.data);
                } else if (prevPath === "/investment") {
                    const qrCode = resp.data.qr;
                    setBotData({
                        qr: qrCode,
                        amount: amount,
                    })
                }
            });
        }
    }, []);

    const handleImageChange = (e) => {
        if (isAuthenticated) {
            const file = e.target.files[0];
            if (file) {
                setProofImg(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    };

    const uploadProof = () => {

        setLoadingState(true);
        if (isAuthenticated) {
            const newData = new FormData();
            const currentDate = new Date();
            const expiryDate = new Date();
            expiryDate.setDate(currentDate.getDate() + botData.duration);

            const formatDateTime = (date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };

            newData.append("cuid", isAuthenticated);
            newData.append("txnamount", botData.amount);
            newData.append("txnproof", proofImg);
            newData.append("txndate", formatDateTime(currentDate));
            newData.append("bot_expiry", formatDateTime(expiryDate));
            newData.append("txnname", prevPath === "/bot" ? "Purchased Bot" : "Investment");
            newData.append("txntype", "d");

            axios.post(`${SITE_URL}/api/post-api/${prevPath === "/bot" ? "bot_details.php" : "investment.php"}`, newData).then(resp => {
                console.log(resp.data);
                setLoadingState(false);
                if (resp.data.status === 100) {
                    if (prevPath === "/bot") {
                        setModalData({
                            body: "Your BOT will be activated soon."
                        })
                    } else if (prevPath === "/investment") {
                        setModalData({
                            body: "Your investment was successfull."
                        })
                    }
                    setShowModal(true);
                } else {
                    setShowToast({
                        msg: resp.data.msg,
                        type: "danger",
                        show: true
                    });
                    setTimeout(() => {
                        setShowToast({ msg: "", type: "", show: false });
                    }, 2000);
                }
            });
        }
    };

    return (
        <div>
            <Header title={prevPath === "/bot" ? "Bot Payment" : "Investment"} />
            <div className='section mb-5'>
                {
                    botData ? (
                        <React.Fragment>
                            {
                                showUpload ? (
                                    <div className='d-flex flex-column'>
                                        <div className="card mt-2" >
                                            <div className="card-body">
                                            <p>Upload payment screenshot</p>
                                                <label htmlFor='proof' style={{
                                                    border: "1px dashed blue",
                                                    height: '200px',
                                                    width: "100%",
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    {
                                                        previewUrl ? (
                                                            <img src={previewUrl} alt="Preview" style={{ height: '100%', objectFit: 'contain' }} />
                                                        ) : (
                                                            <div className='d-flex justify-content-center align-items-center h-100' >
                                                                <input type="file" id="proof" className='d-none' onChange={handleImageChange} />
                                                                <span className="material-symbols-outlined" style={{ fontSize: "3rem" }}>
                                                                    cloud_upload
                                                                </span>
                                                            </div>
                                                        )
                                                    }
                                                </label>
                                            </div>
                                        </div>
                                        <button className='btn btn-primary mt-2' onClick={uploadProof}>
                                            Submit
                                        </button>
                                    </div>
                                ) : (
                                    <div className='d-flex flex-column'>
                                        <div className="card mt-2" >
                                            <div className="card-body text-center">
                                                <img src={`${SITE_URL}/upload/qr/${botData.qr}`} className='img-fluid w-75' loading='lazy' alt="" />
                                            </div>
                                        </div>
                                        {
                                            prevPath === "/bot" && <div className="card mt-2" >
                                                <div className="card-body text-justify">
                                                    {botData.description}
                                                </div>
                                            </div>
                                        }

                                        <button className='btn btn-primary mt-2' onClick={() => setShowUpload(true)}>Upload Proof</button>
                                    </div>
                                )
                            }
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
                                        <span className="material-symbols-outlined text-success"
                                            style={{ fontVariationSettings: "'FILL' 1", fontSize: '50px' }}>
                                            task_alt
                                        </span>
                                    </div>
                                    <div className="modal-header">
                                        <h5 className="modal-title text-success">Submitted</h5>
                                    </div>
                                    <div className="modal-body">
                                        {
                                            modalData.body
                                        }

                                    </div>
                                    <div className="modal-footer">
                                        <div className="btn-inline">
                                            <Link to="/transaction" className="btn">Okay</Link>
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
