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


                    const blockedPaths = [
                        "/",
                        "/team",
                        "/investment",
                        "/earnings"
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
                        blockedPaths.includes(location.pathname) &&
                        (botStatus === 0 || botStatus === 1 || botStatus === 3 || botStatus === 4)
                    ) {
                       
                        navigate("/purchase-bot");
                    }
                });
        }
    }, [location.pathname]);
    return <Toast msg={toast.msg} type={toast.type} show={toast.show} />
}

export default UserStatus;
