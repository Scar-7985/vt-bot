import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import Toast from "../Components/Toast"

const accountMenu = [
    {
        id: 1,
        title: "Update Profile",
        icon: "person_edit",
        path: "/update-profile"
    },
    {
        id: 2,
        title: "KYC Details",
        icon: "badge",
        path: "/kyc"
    },
    {
        id: 3,
        title: "Transactions",
        icon: "credit_card_clock",
        path: "/transaction"
    },
];


const companyDetails = [

    {
        id: 1,
        title: "Support",
        icon: "support_agent",
        path: "/support"
    },
    {
        id: 2,
        title: "Terms & Conditions",
        icon: "gavel",
        path: "/terms-condition"
    },
    {
        id: 3,
        title: "Privacy Policy",
        icon: "policy",
        path: "/privacy-policy"
    },
    {
        id: 4,
        title: "Refer & Earn",
        icon: "sync_disabled",
        path: "/refer"
    },

]

const Profile = () => {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [rank, setRank] = useState(1);

    useEffect(() => {
        const form = new FormData();
        form.append("cuid", isAuthenticated);
        axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
            setProfilePic(resp.data.photo);
            setRank(resp.data.rank)
        })
    }, [])

    const LogOut = () => {
        window.localStorage.clear();
        setShowToast(true)
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    const goTo = (title, path) => {
        navigate(`${path}`, { state: { freeCourses: (title === "Free Courses" ? title : null) } });
    }

    return (
        <div className='pb-5'>

            <div
                className="py-4 d-flex"
            >
                <div className="avatar-section">
                    <a href="#">
                        <img src={`${SITE_URL}/upload/user/${profilePic ? profilePic : "user-default-image.png"}`} alt="avatar" className="imaged w-50 rounded" />
                    </a>
                </div>
                <div className={``}>
                    <h3 className={`mb-0`}>{window.localStorage.getItem("userName:")}</h3>
                    <h4 className={`mb-0 mt-1`}>{window.localStorage.getItem("userId:")}</h4>
                    {
                        rank !== 0 &&
                        <h4 className={`mb-0 mt-1 d-flex align-items-center`}>
                            <span
                                className="material-symbols-outlined mr-1"
                                style={{ fontVariationSettings: '"FILL" 1', fontSize: "16px", color: "gold" }}
                            >
                                crown
                            </span>
                            <span>
                                {
                                    rank === 1 ? "IBT" : rank === 2 ? "Rising" : rank === 3 ? "Master" : rank === 4 ? "Rapid" : rank === 5 ? "Million" : rank === 6 ? "Billion" : ""
                                }
                            </span>

                        </h4>
                    }

                </div>

            </div>

            <div className='section mt-2'>
                <div className="listview-title mt-1">Personal Details</div>
                <ul className="listview border-0 shadow-sm mb-1 px-2" style={{ borderRadius: '12px' }}>
                    {
                        accountMenu.map((item, index) => {
                            return (
                                <li onClick={() => goTo(item.title, item.path)} key={index}>
                                    <span className="item">
                                        <div className="in">
                                            <div className='d-flex align-items-center'>

                                                <span className={`material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                                                    {item.icon}
                                                </span>
                                                <span className='ml-2'>{item.title}</span>
                                            </div>
                                        </div>
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            {/* <div className='section mt-2'>
                <div className="listview-title mt-1">Help & Support</div>
                <ul className="listview border-0 shadow-sm mb-1 px-2" style={{ borderRadius: '12px' }}>
                    {
                        helpSupport.map((item, index) => {
                            return (
                                <li onClick={() => goTo(item.title, item.path)} key={index}>
                                    <span className="item">
                                        <div className="in">
                                            <div className='d-flex align-items-center'>
                                                <span className={`material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                                                    {item.icon}
                                                </span>
                                                <span className='ml-2'>{item.title}</span>
                                            </div>
                                        </div>
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div> */}
            <div className='section mt-2'>
                <div className="listview-title mt-1">Company Details</div>
                <ul className="listview border-0 shadow-sm mb-1 px-2" style={{ borderRadius: '12px' }}>
                    {
                        companyDetails.map((item, index) => {
                            return (
                                <li onClick={() => goTo(item.title, item.path)} key={index}>
                                    <span className="item">
                                        <div className="in">
                                            <div className='d-flex align-items-center'>
                                                <span className={`material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                                                    {item.icon}
                                                </span>
                                                <span className='ml-2'>{item.title}</span>
                                            </div>
                                        </div>
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className='section mt-2'>
                <div className="listview-title mt-1">Log Out</div>
                <ul className="listview border-0 shadow-sm mb-1 px-2" style={{ borderRadius: '12px' }}>
                    <li onClick={() => setShowModal(true)}>
                        <span className="item">
                            <div className="in">
                                <div className='d-flex align-items-center'>
                                    <span className={`material-symbols-outlined`} style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>
                                        logout
                                    </span>
                                    <span className='ml-2'>Log Out</span>
                                </div>
                            </div>
                        </span>
                    </li>
                </ul>
            </div>

            {
                showModal &&
                <div className="modal fade dialogbox show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className={`modal-content`}>
                            <div className="pt-3 text-center" style={{ color: 'red' }}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    logout
                                </span>
                            </div>
                            <div className="modal-header pt-1">
                                <h5 className={`modal-title`}>Log Out</h5>
                            </div>
                            <div className="modal-body">
                                Are you sure ?
                            </div>
                            <div className="modal-footer">
                                <div className="btn-inline">
                                    <a href="#" className={`btn btn-text-primary text-white}`} onClick={() => { setShowModal(false); LogOut(); }}>Yes</a>
                                    <a href="#" className="btn btn-text-secondary" onClick={() => setShowModal(false)}>No</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <Toast msg={"Logged out successfully"} type={"success"} show={showToast} />
        </div>
    )
}

export default Profile