import React, { useState, useEffect } from 'react'
import LottieGIF from '../Components/LottieGIF';
import { Link, useNavigate } from 'react-router-dom';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';

const PurchaseBotUI = () => {

    const navigate = useNavigate();
    const [botStatus, setBotStatus] = useState(0);
    const [rejectedReason, setRejectedReason] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            const form = new FormData();
            form.append('cuid', isAuthenticated);

            axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form)
                .then(resp => {
                    setBotStatus(Number(resp.data.bot_status));
                });

            // xxxxxxxxxxxxxxxxxxxxx //

            axios.post(`${SITE_URL}/api/get-api/transaction.php`, form)
                .then(resp => {
                    if (resp.data) {
                        const filteredRemarks = resp.data.find(item => item.txnremarks);
                        setRejectedReason(filteredRemarks?.txnremarks);
                    }
                })
                .catch(err => console.error("Error fetching transaction data:", err));
        }
    }, [])


    const getMessage = () => {
        if (botStatus === 0) {
            return "Please buy BOT to start trading.";
        } else if (botStatus === 2) {
            navigate("/");
        }
        else if (botStatus === 1) {
            return "Your BOT payment is in review. It will be activated soon when admin approves it.";
        } else if (botStatus === 3) {
            return `Your Previous BOT was rejected.<br /> <strong>Reason:</strong> <span class="text-danger">${rejectedReason}</span>`;
        } else if (botStatus === 4) {
            return "Your BOT is expired. Please buy again to continue trading.";
        }
        else {
            return null;
        }
    };


    return (
        <div className='section'>
            <div className="card mt-2">
                <div className="card-body">
                    <div style={{ height: "200px" }}><LottieGIF /></div>
                    <div className='text-center' dangerouslySetInnerHTML={{ __html: getMessage() }} />
                    {
                        (botStatus === 0 || botStatus === 3 || botStatus === 4) &&
                        <Link to={"/bot"} className='btn btn-success btn-block mt-2'>Buy Now</Link>
                    }
                    {
                        botStatus === 1 && 
                        <Link to={"/bot"} className='btn btn-success btn-block mt-2'>Show Details</Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default PurchaseBotUI;
