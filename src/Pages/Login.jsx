import axios from "axios";
import React, { useState, useEffect } from "react";
import { SITE_URL } from "../Auth/Define";
import { Link } from "react-router-dom";
import Toast from "../Components/Toast";
import LottieGIF from "../Components/LottieGIF";

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [toast, setToast] = useState({
    msg: "",
    type: "",
    show: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newData = new FormData();
    newData.append("email", email);
    if (showOtp) {
      newData.append("otp", otp.join(""));
    }
    axios.post(`${SITE_URL}/api/post-api/login.php`, newData).then((resp) => {
      console.log(resp.data);

      if (
        resp.data.status === 100 &&
        resp.data.msg ===
        "OTP successfully sent to your mailbox. Please verify."
      ) {
        setToast({ msg: resp.data.msg, type: "success", show: true });
        setShowOtp(true);
      } else if (
        resp.data.status === 100 &&
        resp.data.msg === "Login Successfully."
      ) {
        setToast({ msg: resp.data.msg, type: "success", show: true });
        const loginId = resp.data[0].cuid;
        const uName = resp.data[0].name;
        const uEmail = resp.data[0].email;
        localStorage.setItem("userId:", loginId);
        localStorage.setItem("userName:", uName);
        localStorage.setItem("userEmail:", uEmail);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setToast({ msg: resp.data.msg, type: "danger", show: true });
      }
      setTimeout(() => {
        setToast({ msg: "", type: "", show: false });
      }, 2000);
    });
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
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        e.target.previousSibling.focus();
      }
      setOtp(newOtp);
    }
  };

  useEffect(() => {
    if (showOtp) {
      setTimeout(() => {
        document.querySelector(".otp-input")?.focus();
      }, 100);
    }
  }, [showOtp]);

  useEffect(() => {
    let interval;
    if (showOtp) {
      setTimer(30);
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp]);

  const handleResendOtp = () => {
    const data = new FormData();
    data.append("email", email);
    axios.post(`${SITE_URL}/api/post-api/login.php`, data).then((resp) => {
      setToast({ msg: "OTP sent successfully", type: "success", show: true });
      startTimer();
      setTimeout(() => {
        setToast({ msg: "", type: "", show: false });
      }, 2000);
    });
  };

  const startTimer = () => {
    let count = 30;
    setTimer(count);
    setCanResend(false);
    const interval = setInterval(() => {
      count -= 1;
      if (count < 1) {
        clearInterval(interval);
        setCanResend(true);
        return;
      }
      setTimer(count);
    }, 1000);
  };

  useEffect(() => {
    if (showOtp) {
      startTimer();
    }
  }, [showOtp]);

  return (
    <div className="bg-white" style={{ height: "100vh" }}>
      <div className="text-center m-auto" style={{ width: "300px" }}>
        {/* <img
          src="/assets/img/Login.png"
          className="imaged"
          alt=""
          width={"400px"}
        /> */}
        <LottieGIF />
      </div>

      <div className="section text-center"></div>
      <div className="section mb-5 p-2">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="pb-1">
              <div className="ard-header py-0 mb-3 border-secondary">
                <h2 className="mb-0 text-center">{showOtp ? "Verify OTP" : "Log In"}</h2>
                <div
                  className="text-center text-muted"
                  style={{ fontSize: "13px" }}
                >
                  {showOtp
                    ? (
                      <p>
                        OTP has been sent to <strong className="text-dark">{email}</strong>.<br />
                        If you don't see it in your inbox, please check your spam folder.
                      </p>
                    )
                    : "Login to you account"}
                </div>
              </div>

              {showOtp && (
                <div className="form-group boxed">
                  <div className="input-wrapper">
                    <label className="label" htmlFor="otp">
                      Enter the correct OTP
                    </label>
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
                            fontSize: "22px",
                            fontWeight: "500",
                            marginRight: "10px",
                            height: "50px",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!showOtp && (
                <div className="form-group boxed">
                  <div className="input-wrapper">
                    <label className="label text-white" htmlFor="name">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email"
                      name="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                </div>
              )}

              {/* Resend OTP  */}

              {showOtp && (
                <div className="text-right px-2">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="btn btn-link p-0 text-danger"
                      style={{ fontSize: "14px" }}
                    >
                      Resend OTP ?
                    </button>
                  ) : (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#888",
                        fontWeight: "normal",
                      }}
                      className="text-danger"
                    >
                      Resend OTP in {timer}s
                    </p>
                  )}
                </div>
              )}

              {/* Resend OTP  */}

              <div className="form-button mt-2">
                <button
                  type="submit"

                  className="btn btn-primary btn-block"
                  style={{ height: "40px" }}
                >
                  {showOtp ? "Submit" : "Log In"}
                </button>

              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              to={"/signup"}
              style={{ cursor: "pointer", fontSize: "12px", fontWeight: "500" }}
            >
              <button className="btn btn-dark btn-block">Register Now</button>
            </Link>
          </div>
        </form>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  );
};

export default Login;