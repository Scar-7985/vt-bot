import { SITE_URL, isAuthenticated } from '../Auth/Define';
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios';

const TransactionDetail = () => {

    const location = useLocation();
    const { transactionId } = location.state;
    const [transactionData, setTransactionData] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const newData = new FormData();
            newData.append("cuid", isAuthenticated)
            axios.post(`${SITE_URL}/api/get-api/transaction.php`, newData).then(resp => {
                if (resp.data.length > 0) {
                    const filteredData = resp.data.find((item) => Number(item.id) === Number(transactionId));
                    console.log(filteredData);

                    setTransactionData(filteredData)
                }
            }).catch(error => {
                console.log("Error in getting transaction list");

            })
        }
    }, [transactionId])
    

    return (
        <div className='section'>
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
                                    <h3 className="text-center mt-2">Payment Info</h3>
                                </div>

                                <ul className="listview flush transparent simple-listview no-space mt-3">
                                    <li>
                                        <strong className="">Status</strong>
                                        {/* <span 
                                        className={`text-${
                                        transactionData.txnstatus === 1 
                                        ? "warning" 
                                        : transaction.txnstatus}`}>Success</span> */}
                                    </li>
                                    <li>
                                        <strong className="">Category</strong>
                                        <span className=''>{transactionData.txnname}</span>
                                    </li>
                                    <li>
                                        <strong className="">Date</strong>
                                        <span className=''>{transactionData.txndate}</span>
                                    </li>
                                    <li>
                                        <strong className=''>Amount</strong>
                                        <h3 className={transactionData.txnname.startsWith("Level") || transactionData.txnname.startsWith("Withdraw") ? 'text-success' : 'text-danger'}>
                                            {transactionData.txnname.startsWith("Level") || transactionData.txnname.startsWith("Withdraw") ? '+' : '-'} ${transactionData.txnamount}
                                        </h3>
                                    </li>
                                </ul>


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
