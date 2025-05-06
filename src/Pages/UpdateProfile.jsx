import React, { useState, useEffect } from 'react'
import { isAuthenticated, SITE_URL } from '../Auth/Define';
import axios from 'axios';
import Toast from '../Components/Toast';

const UpdateProfile = () => {

    const [showChangeImage, setShowChangedImage] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [showToast, setShowToast] = useState({
        msg: "",
        type: "",
        show: false
    });
    const [formData, setFormData] = useState({
        cuid: window.localStorage.getItem("userId:"),
        uname: "",
        phone: "",
        email: "",
        address: "",
        uimage: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        console.log(file);

        const imageURL = URL.createObjectURL(file);
        // console.log(imageURL);

        setFormData((prevData) => ({
            ...prevData,
            [name]: file,
        }));

        setShowChangedImage(imageURL);
    };

    useEffect(() => {
        const fetchDetails = async () => {


            const form = new FormData();
            form.append("cuid", isAuthenticated);
            axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
                // console.log(resp.data);

                setFormData({
                    login_id: formData.login_id,
                    uname: resp.data.name || "",
                    email: resp.data.email || "",
                    address: resp.data.address || "",
                    phone: resp.data.phone || "",
                    uimage: resp.data.photo || "",
                });
                setProfilePic(resp.data.photo);

            }).catch(error => {
                console.log(error);
            })




        };

        fetchDetails();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newData = new FormData();
        newData.append("cuid", isAuthenticated);
        newData.append("name", formData.uname);
        newData.append("phone", formData.phone);
        newData.append("address", formData.address);
        newData.append("photo", formData.uimage);

        axios.post(`${SITE_URL}/api/post-api/update_profile.php`, newData).then(resp => {
            if (resp.data.status === 100) {
                setShowToast({ msg: resp.data.msg, type: "success", show: true });
            } else {
                setShowToast({ msg: resp.data.msg, type: "danger", show: true });
            }
            setTimeout(() => {
                setShowToast({ msg: "", type: "", show: false });
            }, 2000);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div>

            <>

                <form onSubmit={handleSubmit}>

                    <div className="section mt-3 text-center">
                        <div className="avatar-section">
                            <div>
                                <React.Fragment>

                                    {
                                        showChangeImage
                                            ? <img src={showChangeImage} alt="Preview" className="imaged w100 rounded" />
                                            : <img src={`${SITE_URL}/upload/user/${profilePic ? profilePic : "user-default-image.png"}`} alt="avatar"
                                                className="imaged rounded" style={{ width: "100px", height: "100px" }} />
                                    }


                                    <label htmlFor="imageFile" className='button' style={{ cursor: 'pointer' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                                            add_a_photo
                                        </span>
                                    </label>
                                    <input
                                        type="file"
                                        id="imageFile"
                                        onChange={handleImageChange}
                                        name='uimage'
                                        style={{ display: 'none' }}
                                    />
                                </React.Fragment>

                            </div>
                        </div>
                    </div>

                    <div className="section my-5">
                        <div className="card">
                            <div className='card-body'>

                                <div className="form-group boxed">
                                    <div className="input-wrapper">
                                        <label className={`label d-flex align-items-center`} htmlFor="email5">
                                            <span>E-mail</span>
                                            <span className="material-symbols-outlined ml-1"
                                                style={{ color: 'green', fontSize: '16px' }}>
                                                verified
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`form-control`} id="email5"
                                            placeholder="E-mail"
                                            readOnly
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group boxed">
                                    <div className="input-wrapper">
                                        <label className={`label d-flex align-item-end text-white`} htmlFor="phone5">
                                            <span>Phone number</span>

                                        </label>
                                        <input
                                            id="phone5"
                                            type="text"
                                            className={`form-control`}
                                            placeholder="Your Phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            style={{ fontSize: '14px' }}
                                        />
                                    </div>
                                </div>

                                <div className="form-group boxed">
                                    <div className="input-wrapper">
                                        <label className={`label text-white `} htmlFor="name5">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            placeholder="Your name"
                                            name="uname"
                                            value={formData.uname}
                                            onChange={handleChange}
                                            style={{ fontSize: '14px' }}
                                        />
                                    </div>
                                </div>



                                <div className="form-group boxed">
                                    <div className="input-wrapper">
                                        <label className={`label`} htmlFor="address5">Address</label>
                                        <textarea
                                            id="address5"
                                            className={`form-control`}
                                            placeholder="Address here..."
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            style={{
                                                height: '100px',
                                                fontSize: '14px'
                                            }}

                                        />
                                    </div>
                                </div>

                                <div className="form-group boxed mt-2">
                                    <div className="input-wrapper">
                                        <button type='submit' className='btn btn-success square w-100'>Update</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </form>
            </>

            <Toast msg={showToast.msg} type={showToast.type} show={showToast.show} />
        </div>
    )
}

export default UpdateProfile;