import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { isAuthenticated, SITE_URL } from '../Auth/Define';

const InvestmentDetail = () => {

    const location = useLocation();
    const { invId } = location.state;
    const [investmentData, setInvestmentData] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const form = new FormData();
            form.append('cuid', isAuthenticated);
            axios.post(`${SITE_URL}/api/get-api/investment.php`, form).then(resp => {
                // console.log(resp.data);
                
                if (resp.data.length > 0) {
                    const filteredData = resp.data.find((item) => Number(item.id) === Number(invId));
                    setInvestmentData(filteredData);
                }
            })
        }
    }, [])

    return (
        <div className='section'>
            {
                investmentData ?

                    (
                        <div className="mt-2 mb-2 card">
                        <div className="card-body">


                            <div className="listed-detail mt-3">
                                <div className="icon-wrapper">
                                    <div className="iconbox">
                                        <span className="material-symbols-outlined">
                                            mail
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-center mt-2">Investment</h3>
                            </div>

                            <ul className="listview flush transparent simple-listview no-space mt-3">
                                <li>
                                    <strong className="">Status</strong>
                                    <span className={`${investmentData.invstatus === 1 ? "text-warning" : investmentData.invstatus === 2 ? "text-success" : "text-danger"}`}>
                                    {investmentData.invstatus === 1 ? "In Review" : investmentData.invstatus === 2 ? "Success" : "Rejected"}
                                    </span>
                                </li>
                                <li>
                                    <strong className="">Txn Id</strong>
                                    <span className=''>{investmentData.txnid}</span>
                                </li>
                                <li>
                                    <strong className="">Investment Id</strong>
                                    <span className=''>{investmentData.invid}</span>
                                </li>
                                <li>
                                    <strong className="">Date</strong>
                                    <span className=''>{investmentData.invdate}</span>
                                </li>
                                <li>
                                    <strong className=''>Amount</strong>
                                    <h3 className='text-success'>
                                        ${investmentData.invamount}
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

export default InvestmentDetail
