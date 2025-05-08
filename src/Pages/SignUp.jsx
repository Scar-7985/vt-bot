import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SITE_URL } from '../Auth/Define';
import { Link } from 'react-router-dom';
import Toast from '../Components/Toast';
import LottieGIF from '../Components/LottieGIF';

const SignUp = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [referedBy, setReferedBy] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({
    uname: '',
    email: '',
    referal: ''
  });
  const [toast, setToast] = useState({
    msg: "",
    type: "",
    show: false
  });
  const [otp, setOtp] = useState(['', '', '', '']);

  useEffect(() => {
    if (formData.referal !== '') {
      const form = new FormData();
      form.append("cuid", formData.referal);
      axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
          setReferedBy(resp.data.name);
      });
    }
  }, [formData.referal]);


  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = new FormData();
    newData.append("name", formData.uname);
    newData.append("email", formData.email);
    newData.append("refer_by", formData.referal);
    if (showOtp) {
      newData.append("otp", otp.join(""));
    }

    axios.post(`${SITE_URL}/api/post-api/registration.php`, newData).then(resp => {
      if (resp.data.status === 100 && resp.data.msg.includes("OTP")) {
        setShowOtp(true);
        setTimer(30);
      } else if (resp.data.status === 100 && resp.data.msg === "Register Successfully.") {
        const loginId = resp.data[0].cuid;
        const uName = resp.data[0].name;
        window.localStorage.setItem("userId:", loginId);
        window.localStorage.setItem("userName:", uName);
        setToast({ msg: "Logging you in", type: "success", show: true });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setToast({ msg: resp.data.msg, type: "danger", show: true });
      }
      setTimeout(() => setToast({ msg: "", type: "", show: false }), 2000);
    });
  };




  const resendOtp = () => {
    if (timer === 0) {
      setTimer(30);

      const data = new FormData();
      data.append("email", formData.email);
      data.append("resend_only", "1"); // Tell backend this is OTP resend
      data.append("name", formData.uname); // Still send name to satisfy validation

      axios.post(`${SITE_URL}/api/post-api/registration.php`, data).then(resp => {
        if (resp.data.msg.includes("OTP")) {
          setToast({ msg: "OTP Resent", type: "success", show: true });
        } else {
          setToast({ msg: resp.data.msg, type: "danger", show: true });
        }
        setTimeout(() => setToast({ msg: "", type: "", show: false }), 2000);
      });
    }
  };



  const handleOtpChange = (e, index) => {
    const value = e.target.value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        e.target.previousSibling.focus();
      }
      setOtp(newOtp);
    }
  };

  useEffect(() => {
    if (showOtp) {
      setTimeout(() => {
        document.querySelector('.otp-input')?.focus();
      }, 100);
    }
  }, [showOtp]);

  return (
    <div className='bg-white' style={{ height: "100vh" }}>
      <div className='text-center m-auto' style={{width: "200px"}}>
        <LottieGIF />
      </div>

      <div className="section mb-5 p-2">
        <form onSubmit={handleSubmit}>
          <div className="">
            <div className="pb-1">
              <div className="py-0 mb-3">
                <h2 className='mb-0 text-center'>{showOtp ? "Verify OTP" : "Register"}</h2>
                <p className='text-center text-muted' style={{ fontSize: "13px" }}>
                  {showOtp ? "If you don't see the OTP in your inbox, please check your spam or junk folder." : "Fill the form to get registered"}
                </p>
              </div>

              {showOtp && (
                <>
                  <div className="form-group boxed">
                    <div className="input-wrapper">
                      <label className="label text-white" htmlFor='otp'>Enter the correct OTP</label>
                      <div className="d-flex justify-content-between">
                        {[0, 1, 2, 3].map((index) => (
                          <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            className="form-control otp-input text-center p-0"
                            onChange={(e) => handleOtpChange(e, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            value={otp[index]}
                            style={{
                              fontSize: '22px',
                              fontWeight: '500',
                              height: "50px",
                              marginRight: '10px',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='text-right mt-2'>
                    <button
                      type="button"
                      onClick={resendOtp}

                      disabled={timer > 0}
                      style={{
                        background: "none",
                        border: "none",
                        outline: 'none',
                        color: timer > 0 ? "red" : "red",
                        fontSize: "13px"
                      }}
                    >
                      {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP?"}
                    </button>
                  </div>
                </>
              )}

              {!showOtp && (
                <>
                  <div className="form-group boxed">
                    <div className="input-wrapper">
                      <label className="label" htmlFor="name">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Your name"
                        name="uname"
                        value={formData.uname}
                        onChange={handleChange}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div className="form-group boxed">
                    <div className="input-wrapper">
                      <label className="label" htmlFor="email">E-mail</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your e-mail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div className="form-group boxed">
                    <div className="input-wrapper">
                      <label className="label d-flex justify-content-between align-items-center" htmlFor="referal">
                        Referral (Optional)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="referal"
                        placeholder="Refer Code"
                        name="referal"
                        value={formData.referal}
                        onChange={handleChange}
                        style={{ fontSize: "14px" }}
                      />
                    </div>
                    {
                      referedBy &&
                      <span className='text-success' style={{ fontSize: '12px' }}>
                        {referedBy}
                      </span>
                    }
                  </div>

                  <div className="form-group mt-2">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="termsCheck"
                        checked={acceptedTerms}
                        onChange={() => setAcceptedTerms(!acceptedTerms)}
                      />
                      <label className="custom-control-label" htmlFor="termsCheck" style={{ fontSize: "12px" }}>
                        I agree to the <Link to="/terms-condition" style={{ textDecoration: "underline" }}>Terms & Conditions
                        </Link> and
                        <Link to={"/privacy-policy"} style={{ textDecoration: "underline" }}> Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="form-button mt-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{ height: "40px" }}
                  disabled={!acceptedTerms}
                >
                  {showOtp ? "Verify" : "Register Now"}
                </button>
              </div>
            </div>
          </div>

          <div className='text-center mt-2'>
            <Link to={"/login"} className='btn btn-dark btn-block'>
              Already have an account? Log In
            </Link>
          </div>

        </form>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  );
};

export default SignUp;