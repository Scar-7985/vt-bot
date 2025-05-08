import React, { useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../Auth/Define";
import Toast from "../Components/Toast";
const Refer = () => {

  const [toast, setToast] = useState({
    msg: "",
    type: "",
    show: false
  })

  const handleCopy = () => {

    navigator.clipboard.writeText(isAuthenticated).then(() => {
      setToast({
        msg: "Copy succesfull",
        type: "success",
        show: true
      })
    });
    setTimeout(() => {
      setToast({ msg: "", type: "", show: false })
    }, 2000);
  };

  return (
    <div className="bg-white">
      <div
        className="card"
        style={{ borderRadius: "0 0 50px 50px", margin: "0", boxShadow: "0 0 2px grey" }}
      >
        <div className="card-body">
          <div className="p-1">
            <div className="text-center">
              <h2 className="">
                Refer your friends <br /> and Earn
              </h2>
              <img src="assets/img/gift.png" width={"200px"} alt="" />

            </div>

            <div
              className="d-flex align-items-center justify-content-between p-1 mt-2 mb-2 rounded-lg text-center"
              style={{
                width: "205px",
                height: "60px",
                margin: "auto",
                border: "1px dashed grey",
              }}
            >
              <div className="left1 " style={{ lineHeight: "15px" }}>
                <p className="m-0 fs-9 text-dark">Your referral Code</p>

                <h2 className="m-0">{isAuthenticated}</h2>
              </div>
              <div className="separate"></div>
              <div className="text-center right1">
                <div className="fs-9 text-dark" style={{ lineHeight: "15px" }} onClick={handleCopy}>
                  Copy Code
                </div>
              </div>
            </div>

            <p className="text-center text-dark">
              Share your Referral Code via
            </p>

            <div className="mt-2 text-center">
              <Link
                to={`https://wa.me/?text=Use this code ${isAuthenticated}`}
                target="_blank"
                type="button"
                class="btn btn-success col-6 rounded shadowed  mr-1 mb-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                </svg>
                <span className="ml-1">Whatsapp</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="section mt-5" style={{ background: "white" }}>
        <b className="text-dark">Frequently Asked Questions</b>
      </div>
      <div className="section full mt-4 mb-5">
        <div
          className="accordion"
          id="accordionExample1"
        >
          <div className="item">
            <div class="accordion-header">
              <button
                className="btn collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#accordion1"
              >
                What is the Refer and Earn program?
              </button>
            </div>
            <div
              id="accordion1"
              class="accordion-body collapse"
              data-parent="#accordionExample1"
            >
              <div className="accordion-content text-dark">
                The Refer and Earn program allows you to invite friends to join our platform. When they sign up using your referral link or code and meet the requirements, both of you earn rewards.
              </div>
            </div>
          </div>

          <div className="item">
            <div class="accordion-header">
              <button
                className="btn collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#accordion2"
              >
                How can I refer my friends?
              </button>
            </div>
            <div
              id="accordion2"
              class="accordion-body collapse"
              data-parent="#accordionExample1"
            >
              <div className="accordion-content text-dark">
                You can share your unique referral link or code from your community or from above through WhatsApp or you can copy and share to any other platform.
              </div>
            </div>
          </div>

          <div className="item">
            <div className="accordion-header">
              <button
                className="btn collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#accordion3"
              >
                Where can I find my referral link or code?
              </button>
            </div>
            <div
              id="accordion3"
              className="accordion-body collapse"
              data-parent="#accordionExample1"
            >
              <div className="accordion-content text-dark">
                Your referral link or code is available in your profile or Refer & Earn section after you log in. Just click "Copy Code" or "Share" to send it to others.
              </div>
            </div>
          </div>

          <div className="item">
            <div class="accordion-header">
              <button
                className="btn collapsed"
                type="button"
                data-toggle="collapse"
                data-target="#accordion4"
              >
                How does the referral system work?
              </button>
            </div>
            <div
              id="accordion4"
              className="accordion-body collapse"
              data-parent="#accordionExample1"
            >
              <div className="accordion-content text-dark">
                When someone signs up using your referral link/code and completes the required action (like signing up or making their first purchase), both of you will receive a reward.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  );
};

export default Refer;