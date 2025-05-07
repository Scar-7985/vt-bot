import { SITE_URL, isAuthenticated } from '../Auth/Define';
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios';

const TransactionDetail = () => {

    const location = useLocation();
    const { transactionId } = location.state;
    const [transactionData, setTransactionData] = useState(null);
    const [invId, setInvId] = useState(null);
    const [showFullScreen, setShowFullScreen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const form = new FormData();
            form.append("cuid", isAuthenticated)
            axios.post(`${SITE_URL}/api/get-api/transaction.php`, form).then(resp => {
                if (resp.data.length > 0) {

                    const filteredData = resp.data.find((item) => String(item.txnid) === String(transactionId));
                    setTransactionData(filteredData)
                    console.log("Transaction Data => ", filteredData);


                    if (filteredData.txnname.includes("Investment")) {
                        axios.post(`${SITE_URL}/api/get-api/investment.php`, form).then(resp => {
                            const filteredInv = resp.data.find((INV) => String(INV.txnid) === String(transactionId));
                            console.log("INV Data => ", filteredInv);
                            setInvId(filteredInv?.invid);
                        })
                    }

                }
            }).catch(error => {
                console.log("Error in getting transaction list");

            })
        }
    }, [transactionId])


    return (
        <div className='section pb-5'>
            {
                transactionData ?

                    (
                        <div className='card mt-3 mb-2'>
                            <div className="card-body">


                                <div className="listed-detail mt-3">
                                    <div className="icon-wrapper">
                                        <div className="iconbox">
                                            <span className="material-symbols-outlined">
                                                mail
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-center mt-2">Transaction Info</h3>
                                </div>

                                <ul className="listview flush transparent simple-listview no-space mt-3">


                                    {/*xxxxxxxxxxxxxxxxxxxxxxx Payment Proof xxxxxxxxxxxxxxxxxxxxxxx*/}
                                    {transactionData.txnstatus === 2 && !transactionData.txnname.startsWith("Level") && (
                                        <li>
                                            <strong>Transaction Proof</strong>
                                            <span onClick={() => setShowFullScreen(true)}>
                                                <img
                                                    src={`${SITE_URL}/upload/proofqr/${transactionData.txnproof}`}
                                                    className="imaged w48 rounded-0"
                                                    style={{ height: "100%", objectFit: "contain" }}
                                                    alt="Payment Proof"
                                                />
                                            </span>
                                        </li>
                                    )}


                                    {/*xxxxxxxxxxxxxxxxxxxxxxx Payment Proof xxxxxxxxxxxxxxxxxxxxxxx*/}

                                    <li>
                                        <strong className="">Status</strong>
                                        <span
                                            className={`text-${transactionData.txnstatus === 1
                                                ? "warning"
                                                : transactionData.txnstatus === 2
                                                    ? "success"
                                                    : transactionData.txnstatus === 3
                                                        ? "danger"
                                                        : ""}`}>
                                            {
                                                transactionData.txnstatus === 1
                                                    ? "In review"
                                                    : transactionData.txnstatus === 2
                                                        ? "Success"
                                                        : transactionData.txnstatus === 3
                                                            ? "Rejected"
                                                            : ""
                                            }

                                        </span>

                                    </li>

                                    <li>
                                        <strong className="">Payment Type</strong>
                                        <span className=''>{transactionData.txnname}</span>
                                    </li>
                                    <li>
                                        <strong className="">Date</strong>
                                        <span className=''>{transactionData.txndate}</span>
                                    </li>
                                    <li>
                                        <strong className="">Txn Id</strong>
                                        <span className=''>{transactionData.txnid}</span>
                                    </li>

                                    {
                                        invId &&
                                        <li>
                                            <strong className="">Investment Id</strong>
                                            <span className=''>{invId}</span>
                                        </li>
                                    }

                                    <li>
                                        <strong className=''>Amount</strong>
                                        <h3 className={transactionData.txnname.startsWith("Level") || transactionData.txnname.startsWith("Withdraw") ? 'text-success' : 'text-danger'}>
                                            {transactionData.txnname.startsWith("Level") || transactionData.txnname.startsWith("Withdraw") ? '+' : '-'} ${transactionData.txnamount}
                                        </h3>
                                    </li>
                                    {
                                        transactionData.txnstatus === 3 &&
                                        <li>
                                            <strong className="">Remark</strong>
                                            <span className='text-danger'>{transactionData.txnremarks}</span>
                                        </li>
                                    }
                                </ul>
                                {/* Fullscreen Image Preview */}
                                {showFullScreen && (
                                    <div
                                        className="bg-dark"
                                        style={{
                                            position: "fixed",
                                            top: "56px",
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            zIndex: 9999,
                                            overflowY: "auto",
                                            padding: "20px",
                                        }}
                                        onClick={() => setShowFullScreen(false)}
                                    >
                                        <div className="d-flex justify-content-center align-items-start" style={{ minHeight: "100%" }}>
                                            <img
                                                src={`${SITE_URL}/upload/proofqr/${transactionData.txnproof}`}
                                                alt="Full Screen Proof"
                                                style={{
                                                    width: "auto",
                                                    height: "auto",
                                                    maxWidth: "100%",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ) : (
                        <div className='d-flex justify-content-center align-items-center' style={{ height: "calc(100vh - 160px)" }}>
                            <div className="spinner-border text-success" role="status"></div>
                        </div>
                    )
            }
        </div>
    )
}

export default TransactionDetail
