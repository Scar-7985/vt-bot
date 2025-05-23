import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toast from '../Components/Toast';

const Investment = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [botStatus, setBotStatus] = useState(0);
  const [amount, setAmount] = useState(5);
  const [totalInvestment, setTotalInvestment] = useState(null)
  const [investmentData, setInvestmentData] = useState([]);
  const [acceptance, setAcceptance] = useState(false);
  const [showToast, setShowToast] = useState({
    msg: "",
    type: "",
    show: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      const form = new FormData();
      form.append('cuid', isAuthenticated);

      axios.post(`${SITE_URL}/api/get-api/update_profile.php`, form).then(resp => {
        setBotStatus(resp.data.bot_status === 2);
      })

      axios.post(`${SITE_URL}/api/get-api/investment.php`, form).then(resp => {
        if (resp.data.length > 0) {
          const investments = resp.data;

          axios.post(`${SITE_URL}/api/get-api/transaction.php`, form).then(tranResp => {
            const transactions = tranResp.data;

            // Create a map: txnid -> txnstatus
            const txnStatusMap = {};
            transactions.forEach(txn => {
              txnStatusMap[txn.txnid] = txn.txnstatus;
            });

            // Update investment.invstatus to match corresponding txnstatus
            const correctedInvestments = investments.map(investment => {
              const txnStatus = txnStatusMap[investment.txnid];
              if (txnStatus !== undefined && investment.invstatus !== txnStatus) {
                return { ...investment, invstatus: txnStatus }; // override wrong status
              }
              return investment; // keep original if no mismatch
            });

            setInvestmentData(correctedInvestments);
          });
        }
      })

      axios.post(`${SITE_URL}/api/get-api/total_investment.php`, form).then(resp => {
        setTotalInvestment(Number(resp.data))
      })
    }
  }, [])


  const handleSubmit = () => {

    if (isAuthenticated && botStatus) {
      // if (Number(amount) < 5) {
      //   setShowToast({ msg: "Amount cannot be less than $5", type: "danger", show: true });
      // } else if (Number(amount) > 10000) {
      //   setShowToast({ msg: "Amount cannot be more than $10000", type: "danger", show: true });
      // }
      // else {
      // setShowToast({ msg: "Investment is temporarily locked.", type: "danger", show: true });
      navigate("/purchase", {
        state: {
          prevPath: location.pathname,
          amount: Number(amount)
        }
      })
      // }

    } else {
      navigate("/bot")
    }

    setTimeout(() => {
      setShowToast({ msg: "", type: "", show: false })
    }, 2000);
  }

  const viewInvDetails = (Id) => {
    navigate("/transaction-details", { state: { transactionId: Id } })
  }


  return (
    <div className='section pb-5'>
      {/* xxxxxxxxxxx Investment xxxxxxxxxxx */}
      <div className="wallet-card my-3" >
        <div className="balance">
          <div className="left">
            <span className="title">Investment</span>
            <h1 className="total">$ {totalInvestment ? totalInvestment : 0.00}</h1>
          </div>
          <div className="right" data-toggle="modal"
            data-target="#depositActionSheet">
            <a className="button" data-bs-toggle="modal" data-bs-target="#depositActionSheet">
              <span className="material-symbols-outlined">
                add
              </span>
            </a>
          </div>
        </div>
      </div>
      {/* xxxxxxxxxxx Investment xxxxxxxxxxx */}



      {/* xxxxxxxxxxx Investment List xxxxxxxxxxx */}
      <div className="section-heading mt-3">
        <h2 className="title">Transactions</h2>
        <Link to={"/transaction"} className="link">View All</Link>
      </div>
      {
        investmentData.length > 0 ?

          (investmentData.map((item, index) => {
            return (
              <div className="transactions mt-2" key={index}>
                <a className="item" onClick={() => viewInvDetails(item.txnid)}>
                  <div className="detail">
                    <div>
                      <strong>{item.invid}</strong>
                      <p>{item.invdate}</p>
                      <p className={`${item.invstatus === 1 ? "text-warning" : item.invstatus === 2 ? "text-success" : "text-danger"}`}>
                        {item.invstatus === 1 ? "In Review" : item.invstatus === 2 ? "Success" : "Rejected"}</p>
                    </div>
                  </div>
                  <div className="right">
                    <div className="text-success">
                      $ {item.invamount}
                    </div>
                  </div>
                </a>
              </div>
            )
          })
          ) : (
            <div className="card mt-2">
              <div className="card-body text-center">You have not Invested yet. <br /></div>
            </div>
          )
      }

      {/* xxxxxxxxxxx Investment List xxxxxxxxxxx */}



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
            <div className="modal-header">
              <h5 className="modal-title">Investment</h5>
            </div>
            <div className="modal-body" >
              <div className="action-sheet-content">
                <form >
                  <div className="form-group basic">
                    <div className="input-wrapper">
                    </div>
                  </div>

                  <div className="form-group basic ">
                    <label className="label">Enter Amount ($5 - $10000)</label>

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

                  <div className="form-group mt-2">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="termsCheck"
                        checked={acceptance}
                        onChange={() => setAcceptance(!acceptance)}
                      />
                      <label className="custom-control-label" htmlFor="termsCheck" style={{ fontSize: "12px" }}>
                        I'm ready to proceed with the <strong>${amount}</strong> Investment?
                      </label>
                    </div>
                  </div>

                  <div className="form-group basic">
                    <button
                      type="submit"
                      className="btn btn-block btn-lg btn-warning"
                      data-dismiss="modal"
                      onClick={handleSubmit}
                      disabled={!acceptance}
                    >
                      Invest
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal section end */}

      <Toast msg={showToast.msg} type={showToast.type} show={showToast.show} />
    </div>
  )
}

export default Investment
