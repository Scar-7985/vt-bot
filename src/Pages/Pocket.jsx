import React, { useState, useEffect } from "react";
import { SITE_URL, isAuthenticated } from "../Auth/Define";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../Components/Toast";

const Pocket = () => {

  const navigate = useNavigate()
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState(5);
  const [withDrawStatus, setWithdrawStatus] = useState(true);
  const [transactionData, setTransactionData] = useState([]);
  const [showToast, setShowToast] = useState({
    msg: "",
    type: "",
    show: false
  });




  useEffect(() => {
    if (isAuthenticated) {
      const form = new FormData();
      form.append("cuid", isAuthenticated);
      axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
        setUserData(resp.data);
      })

      // xxxxxxxxxx Get Wallet amount xxxxxxxxxx //
      axios.post(`${SITE_URL}/api/get-api/withdraw.php`, form).then(resp => {

        setWithdrawStatus(resp.data[0]?.wstatus !== 1)

      })

      // xxxxxxxxxx Get Transactions xxxxxxxxxx //
      axios
        .post(`${SITE_URL}/api/get-api/transaction.php`, form)
        .then((resp) => {
          if (resp.data.length > 0) {
            setTransactionData(resp.data);
          }
        })
        .catch((error) => {
          console.log("Error in getting transaction list");
        });

    }
  }, [])

  const handleSubmit = () => {

    if (isAuthenticated && (Number(userData?.kyc_status) !== 0)) {
      if (Number(amount) > userData?.wallet_amount) {

        setShowToast({
          msg: "Insufficient balance",
          type: "danger",
          show: true
        })

      } else {
        if (withDrawStatus) {
          const form = new FormData();
          form.append("cuid", isAuthenticated);
          form.append("wamount", Number(amount));
          axios.post(`${SITE_URL}/api/post-api/withdraw.php`, form).then(resp => {
            console.log(resp.data);

            if (resp.data.status === 101) {
              setShowToast({
                msg: resp.data.msg,
                type: "danger",
                show: true
              })
            } else {
              setShowToast({
                msg: resp.data.msg,
                type: "success",
                show: true
              })
            }
            setTimeout(() => {
              setShowToast({ msg: "", type: "", show: false });
            }, 2000);
          })
        } else {
          setShowToast({
            msg: "You already have an withdraw in review.",
            type: "danger",
            show: true
          })
        }

      }

    } else {
      setShowToast({
        msg: "Please update your kyc first.",
        type: "danger",
        show: true
      })
    }

    setTimeout(() => {
      setShowToast({ msg: "", type: "", show: false })
    }, 2000);
  }

  const showDetails = (Id) => {
    navigate("/transaction-details", { state: { transactionId: Id } });
  };

  return (
    <div className="section pb-5">

      <div className="wallet-card mt-2">
        <div className="balance">
          <div className="left">
            <span className="title">Withdrawal Pocket</span>
            <h1 className="total">$ {userData?.wallet_amount === null ? 0.00 : userData?.wallet_amount}</h1>
          </div>
          <div className="right" >
            <a className="button" data-bs-toggle="modal" data-toggle="modal"
              data-target="#depositActionSheet">
              <span className="material-symbols-outlined">
                arrow_downward
              </span>
            </a>
          </div>

        </div>
        {/* <div className="wallet-footer ">
          <div className="item">
            <a data-bs-toggle="modal" data-toggle="modal"
              data-target="#depositActionSheet">
              <div className="icon-wrapper bg-danger">
                <span className="material-symbols-outlined">
                  arrow_downward
                </span>
              </div>
              <strong>Withdraw</strong>
            </a>
          </div>
          <div className="item">
            <a  >
              <div className="icon-wrapper">
                <span className="material-symbols-outlined">
                  arrow_upward
                </span>
              </div>
              <strong>Send</strong>
            </a>
          </div>
          <div className="item">
            <a >
              <div className="icon-wrapper bg-success">
                <span className="material-symbols-outlined">
                  arrow_downward
                </span>
              </div>
              <strong>Cards</strong>
            </a>
          </div>
          <div className="item">
            <a >
              <div className="icon-wrapper bg-warning">
                <span className="material-symbols-outlined">
                  arrow_downward
                </span>
              </div>
              <strong>Exchange</strong>
            </a>
          </div>

        </div> */}
      </div>



      {/* Modal section */}
      <div
        className="modal fade action-sheet p-0"
        id="depositActionSheet"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document" >
          <div
            className="modal-content"
          >
            <div className="modal-header text-center">
              <h5 className="modal-title">Withdraw Money</h5>
              {
                Number(userData?.kyc_status) !== 1 &&

                <strong className="text-danger rounded text-center">Please update your KYC .</strong>
              }
            </div>
            <div className="modal-body" >
              <div className="action-sheet-content">
                <form >
                  <div className="form-group basic">
                    <div className="input-wrapper">
                    </div>
                  </div>

                  <div className="form-group basic ">
                    <label className="label">Enter Amount </label>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="input1"
                        >
                          $
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group basic">
                    <button
                      type="submit"
                      className="btn btn-block btn-lg btn-warning"
                      data-dismiss="modal"
                      onClick={handleSubmit}
                    >
                      Withdraw
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal section end */}


      {/* Quick Links */}
      <div className="row mt-2">
        <div className="col-6">
          <div className="stat-box">
            <div className="title">BT Profit</div>
            <div className="value text-success">$ 00.00</div>
          </div>
        </div>
        <div className="col-6">
          <div className="stat-box">
            <div className="title">Referal Profit</div>
            <div className="value text-danger">$ 00.00</div>
          </div>
        </div>

      </div>
      <div className="row mt-2">
        <div className="col-6">
          <div className="stat-box">
            <div className="title">Level Profit</div>
            <div className="value text-danger">$ 00.00</div>
          </div>
        </div>
        <div className="col-6">
          <div className="stat-box">
            <div className="title">Daily Level Profit</div>
            <div className="value">$ 00.00</div>
          </div>
        </div>

      </div>
      <div className="row mt-2">
        <div className="col-12">
          <div className="stat-box">
            <div className="title">LDC</div>
            <div className="value">$ 00.00</div>
          </div>
        </div>
      </div>

      {/* Reward Section */}

      <div className="mb-2 mt-2">
        <div className="wallet-card">
          <div className="wallet-footer align-items-center border-none p-0">
            <div>
              <div className="title text-dark">Reward</div>
              <button className="btn btn-success mt-1">
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </button>

            </div>
            <div

              data-toggle="modal"
              data-target="#depositActionSheet"
            >
              <img src="assets/img/Earning.png" alt="" width={'60px'} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      {
        transactionData.length > 0
          ? (
            <div className="mt-4">
              <div className="section-heading">
                <h2 className="title">Transactions</h2>
                <Link to={"/transaction"} className="link">View All</Link>
              </div>
              <div className="transactions">

                <div className="mt-2">
                  {transactionData.slice(0, 5).map((item, index) => {
                    return (
                      <ul
                        className="listview image-listview mt-1"
                        style={{ borderRadius: "10px" }}
                        key={index}
                      >
                        <li onClick={() => showDetails(item.txnid)}>
                          <div className="item">
                            <div className="icon-box bg-primary">
                              <span className="material-symbols-outlined">
                                {item.txnname.startsWith("Level") ||
                                  item.txnname.startsWith("Withdraw")
                                  ? "south_west"
                                  : "call_made"}
                              </span>
                            </div>
                            <div className="in">
                              <div>
                                <header>
                                  {item.txnname.includes("Level")
                                    ? "Income"
                                    : item.txnname.includes("Withdraw")
                                      ? "Credit"
                                      : item.txnname.includes("Investment") ||
                                        item.txnname.includes("Purchased Bot")
                                        ? "Debit"
                                        : "Transaction"}
                                </header>
                                {item.txnname}
                                <footer>{item.txndate}</footer>
                              </div>
                              <strong
                                className={item.txnname.startsWith("Level") || item.txnname.startsWith("Withdraw") ? "text-success" : "text-danger"}
                              >
                                {item.txnname.startsWith("Level") ||
                                  item.txnname.startsWith("Withdraw")
                                  ? "+"
                                  : "-"}
                                ${item.txnamount}
                              </strong>
                            </div>
                          </div>
                        </li>
                      </ul>
                    );
                  })}
                </div>
              </div>
            </div>
          )
          : (
            <div className="col-12">
              <div className="card mt-2">
                <div className="card-body">
                  You haven't purchased anything yet .
                </div>
              </div>
            </div>
          )
      }


      <Toast msg={showToast.msg} type={showToast.type} show={showToast.show} />
    </div>
  );
};

export default Pocket;