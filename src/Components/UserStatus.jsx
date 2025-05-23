import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isAuthenticated, SITE_URL } from '../Auth/Define'
import axios from 'axios'
import Toast from './Toast'

const UserStatus = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const [toast, setToast] = useState({
        msg: "",
        type: "",
        show: false
    })



    useEffect(() => {
        if (isAuthenticated) {
            const form = new FormData();
            form.append("cuid", isAuthenticated);
            axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form)
                .then(resp => {
                    const data = resp.data;
                    const userStatus = Number(data.status);
                    const botStatus = Number(data.bot_status);

                    const allowedPaths = [
                        "/purchase-bot",
                        "/profile",
                        "/update-profile",
                        "/bot",
                        "/support",
                        "/transaction",
                        "/transaction-details",
                        "/purchase",
                        "/kyc",
                        "/privacy-policy",
                        "/terms-condition"
                    ];

                    if (userStatus === 0 || userStatus === 101) {
                        setToast({
                            msg: "You have been banned by admin.",
                            type: "danger",
                            show: true
                        });
                        window.localStorage.clear();
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }

                    if (
                        !allowedPaths.includes(location.pathname) &&
                        [0, 1, 3, 4].includes(botStatus)
                    ) {
                        navigate("/purchase-bot")
                    }
                });

        }
    }, [location.pathname]);
    return <Toast msg={toast.msg} type={toast.type} show={toast.show} />
}

export default UserStatus;
