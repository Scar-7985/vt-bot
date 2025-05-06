import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SITE_URL, isAuthenticated } from '../Auth/Define';
import { useLocation, useNavigate } from 'react-router-dom';
import Toast from '../Components/Toast';

const Investment = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [botStatus, setBotStatus] = useState(0);
  const [amount, setAmount] = useState(5);
  const [investmentData, setInvestmentData] = useState([]);
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
          setInvestmentData(resp.data);
        }
      })
    }
  }, [])

  const handleSubmit = () => {

    if (isAuthenticated && botStatus) {
      if (Number(amount) < 5) {
        setShowToast({ msg: "Amount cannot be less than $5", type: "danger", show: true });
      } else if (Number(amount) > 10000) {
        setShowToast({ msg: "Amount cannot be more than $10000", type: "danger", show: true });
      }
      else {
        navigate("/purchase", {
          state: {
            prevPath: location.pathname,
            currency: "UPI",
            amount: Number(amount)
          }
        })
      }

    } else {
      navigate("/bot")
    }

    setTimeout(() => {
      setShowToast({ msg: "", type: "", show: false })
    }, 2000);
  }

  const viewInvDetails = (Id) => {
    navigate("/investment-detail", { state: { invId: Id } })
  }

  return (
    <div className='section pb-5'>
      {/* xxxxxxxxxxx Investment xxxxxxxxxxx */}
      <div className="wallet-card my-3" >
        <div class="balance">
          <div class="left">
            <span class="title">Investment</span>
            <h1 class="total">$ 0.00</h1>
          </div>
          <div class="right" data-toggle="modal"
            data-target="#depositActionSheet">
            <a class="button" data-bs-toggle="modal" data-bs-target="#depositActionSheet">
              <span className="material-symbols-outlined">
                add
              </span>
            </a>
          </div>
        </div>
      </div>
      {/* xxxxxxxxxxx Investment xxxxxxxxxxx */}



      {/* xxxxxxxxxxx Investment List xxxxxxxxxxx */}

      {
        investmentData.length > 0 ?

          (investmentData.map((item, index) => {
            return (
              <div className="transactions mt-2" key={index}>
                <a className="item" onClick={() => viewInvDetails(item.id)}>
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

                  <div className="form-group basic">
                    <button
                      type="submit"
                      className="btn btn-block btn-lg btn-warning"
                      data-dismiss="modal"
                      onClick={handleSubmit}
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
