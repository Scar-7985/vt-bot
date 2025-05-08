import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import axios from 'axios';
import Header from '../Components/Header';

const LeveList = () => {

    const location = useLocation();
    const { viewId } = location.state;
    const [leveList, setLevelList] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            const formData = new FormData();
            formData.append("cuid", isAuthenticated)
            axios.post(`${SITE_URL}/api/get-api/level-team.php`, formData).then(resp => {
                setLevelList(resp.data[Number(viewId)]);
            })
        }
    }, [])

  console.log(leveList);
  
    return (
        <div className='section pb-5'>
            <Header title={`Level ${viewId + 1}`} />
            {
                leveList.map((item, index) => {
                    return (
                        <div className="transactions mt-2" key={index}>
                            <a className="item">
                                <div className="detail">
                                    <img src={`${SITE_URL}/upload/user/${item.photo ? item.photo : "user-default-image.png"}`} alt="img" className="image-block imaged w48" />
                                    <div>
                                    <p>{item.cuid}</p>
                                        <strong>{item.name}</strong>
                                        <p>{item.reg_date}</p>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className={`price text-${item.bot_status === 2 ? 'success' : 'danger'}`}>{item.bot_status === 2 ? "Active" : "Inactive"}</div>
                                </div>
                            </a>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default LeveList