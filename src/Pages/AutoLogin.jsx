import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LottieGIF from '../Components/LottieGIF';
import { SITE_URL } from '../Auth/Define';
import axios from 'axios';

const AutoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const cuid = searchParams.get('cuid');
  const otp = searchParams.get('otp');

  useEffect(() => {
    const form = new FormData();
    form.append('cuid', cuid);
    form.append('otp', otp);

    axios.post(`${SITE_URL}/api/post-api/admin_login.php`, form).then(resp => {

      if (resp.data.status === 100) {
        window.localStorage.setItem("userId:", cuid);
        window.localStorage.setItem("userName:", resp.data.name);
        window.localStorage.setItem("userEmail:", resp.data.email);
        setTimeout(() => {
          window.location.reload();
        }, 100);
        navigate("/");
      }
    })
  }, []);


  return (
    <div className='d-flex justify-content-center align-items-center bg-dark' style={{ width: "100vw", height: "100vh" }}>
      <div className='d-flex flex-column align-items-center'>
        <div className='mb-2' style={{ width: "200px" }}>
          <LottieGIF />
        </div>
        <div className="spinner-border text-success" role="status"></div>
      </div>
    </div>
  );
};

export default AutoLogin;
