import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SITE_URL } from '../Auth/Define';
import { Link } from 'react-router-dom';
import Toast from '../Components/Toast';

const SignUp = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [referedBy, setReferedBy] = useState(null);
  const [formData, setFormData] = useState({
    uname: '',
    email: '',
    referal: ''
  });
  const [toast, setToast] = useState({
    msg: "",
    type: "",
    show: false
  })
  const [otp, setOtp] = useState(['', '', '', '']);

  useEffect(() => {
    if (formData.referal !== '') {
      const form = new FormData();
      form.append("cuid", formData.referal);
      axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
        if (resp.data.msg !== "success") {

        } else {
          setReferedBy(resp.data.name)
          // console.log(resp.data);
        }
        // console.log(resp.data);

      })
    }

  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = new FormData();
    newData.append("name", formData.uname)
    newData.append("email", formData.email)
    newData.append("refer_by", formData.referal)
    if (showOtp) {
      newData.append("otp", otp.join(""));
      console.log("otp", otp.join(""));

    }
    axios.post(`${SITE_URL}/api/post-api/registration.php`, newData).then(resp => {
      console.log(resp.data);

      if (resp.data.status === 100 && resp.data.msg === "OTP successfully sent to your mailbox. Please verify.") {
        setShowOtp(true);
      } else if (resp.data.status === 100 && resp.data.msg === "Register Successfully.") {
        const loginId = resp.data[0].cuid;
        const uName = resp.data[0].name;
        window.localStorage.setItem("userId:", loginId);
        window.localStorage.setItem("userName:", uName);
        setToast({
          msg: "Logging you in",
          type: "success",
          show: true
        })
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setToast({
          msg: resp.data.msg,
          type: "danger",
          show: true
        })
      }
      setTimeout(() => {
        setToast({ msg: "", type: "", show: false });
      }, 2000);
    })
  }

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
      <div className='text-center'>
        <img src="/assets/img/signup.png" alt="" className='imaged w-50' />
      </div>


      <div className="section mb-5 p-2">
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body pb-1">
              <div className="card-header py-0 mb-3">
                <h2 className='mb-0 text-center'>Sign up</h2>
                <p className='text-center text-muted' style={{ fontSize: "13px" }}>
                  {showOtp ? "Check spam messages if OTP is not received" : "Fill the form to get registered"}
                </p>
              </div>
          
              {showOtp && (
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
              )}
              {/* {
                showOtp && <h6 className='text-right mt-2'>Resend Otp ?</h6>
              } */}
              {!showOtp && (
                <>
                  <div className="form-group boxed">
                    <div className="input-wrapper">
                      <label className="label" htmlFor="name">
                        Name
                      </label>
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
                      <label className="label" htmlFor="email">
                        E-mail
                      </label>
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
                      <label className="label d-flex justify-content-between align-items-center"
                        htmlFor="referal">
                        Referal (Optional)


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
                      referedBy && <span className='text-success' style={{ fontSize: '12px' }}>
                        {`Refered by ${referedBy}`}
                      </span>
                    }
                  </div>


                </>
              )}

              <div className="form-button mt-3">
                <button type="submit" className="btn btn-primary btn-block" style={{ height: "40px" }}>
                  {
                    showOtp ? "Verify" : "Register Now"
                  }
                </button>
              </div>

            </div>
          </div>
          <div className='text-center mt-2'>

            <Link to={"/login"}
              style={{ cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}

            >
              Already have an account?
            </Link>
          </div>

        </form>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  );
};


export default SignUp;