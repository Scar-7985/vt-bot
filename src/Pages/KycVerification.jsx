import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { isAuthenticated, SITE_URL } from '../Auth/Define';
import Toast from '../Components/Toast';

const KycVerification = () => {

  const [loading, setLoading] = useState(false);
  const [showChangeImage, setShowChangedImage] = useState(false);
  const [showChangeQr, setShowChangedQr] = useState(false);
  const [document, setDocument] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [transferType, setTransferType] = useState("Bank");
  const [userIndex, setUserIndex] = useState(null);
  const [proofImg, setProofImg] = useState(null);
  const [proofQr, setProofQr] = useState(null);
  const [showUpdateProof, setShowUpdateProof] = useState(false);
  const [oneTimeProof, setOneTimeProof] = useState(true);
  const [formData, setFormData] = useState({
    account: "",
    ifsc: "",
    bank: "",
    upi: "",
    wallet: ""
  })
  const [toast, setToast] = useState({
    msg: "",
    type: "",
    show: false
  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setDocument(file);
      setShowChangedImage(imageURL);
    }
  };
  const handleQrChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setQrCode(file);
      setShowChangedQr(imageURL);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const accType = transferType === "Bank" ? 1 : transferType === "UPI" ? 2 : 3;
    const newData = new FormData();
    newData.append("cuid", isAuthenticated);
    if (userIndex) {
      newData.append("id", userIndex);
    }
    newData.append("acc_type", accType);
    newData.append("id_proof", document);
    newData.append("ifsc", formData.ifsc);
    newData.append("bank_ac", formData.account);
    newData.append("bank_name", formData.bank);
    if (!oneTimeProof) {
      newData.append("status", showUpdateProof ? 0 : 1);
    }
    newData.append("upi_id", formData.upi);

    newData.append("qr", qrCode);

    newData.append("wallet_address", formData.wallet);
    axios.post(`${SITE_URL}/api/post-api/kyc.php`, newData).then(resp => {
      setLoading(false)
      if (resp.data.status === 100) {
        setToast({
          msg: "Kyc saved successfully",
          type: "success",
          show: true
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setToast({
          msg: resp.data.msg,
          type: "danger",
          show: true
        });
      }

      setTimeout(() => {
        setToast({ msg: "", type: "", show: false });
      }, 2000);
    })
  }

  useEffect(() => {
    if (isAuthenticated) {
      const newData = new FormData();
      newData.append("cuid", isAuthenticated);
      axios.post(`${SITE_URL}/api/get-api/update_kyc.php`, newData).then(resp => {

        if (resp.data.status === 101) {
        } else {
          setOneTimeProof(false);
          setUserIndex(resp.data.id);
          setProofImg(resp.data.id_proof);
          setProofQr(resp.data.qr)
          setShowUpdateProof(resp.data.status === 1);
          setFormData({
            account: resp.data.bank_ac || "",
            ifsc: resp.data.ifsc || "",
            bank: resp.data.bank_name || "",
            upi: resp.data.upi_id || "",
            wallet: resp.data.wallet_address || "",
          });
        }


        if (Number(resp.data.acc_type) === 3) {
          setTransferType("Wallet")
        } else if (Number(resp.data.acc_type) === 2) {
          setTransferType("UPI")
        } else {
          setTransferType("Bank")
        }

      })
    }
  }, [])

  return (
    <div className='section'>
      <form onSubmit={handleSubmit} className="card mt-2 mb-5">
        <div className="card-body">

          <div className="form-group boxed">
            <div className="input-wrapper">
              <label className="label">Upload Id Proof ( Aadhaar/ Pan Card )</label>
              <label htmlFor={`${!showUpdateProof ? 'document' : ''}`}
                className='rounded d-flex justify-content-center align-items-center w-100'
                style={{ border: `${!showUpdateProof ? '2px dashed blue' : ''}`, height: "200px" }}>
                {
                  showChangeImage
                    ? <img src={showChangeImage} alt="Preview" style={{ height: "100%" }} />
                    : proofImg ? <img src={`${SITE_URL}/upload/idproof/${proofImg}`} alt="Document" style={{ height: "100%" }} />
                      :
                      <span className="material-symbols-outlined" style={{ fontSize: "50px" }}>
                        cloud_upload
                      </span>
                }
                <input type="file" className='d-none' name="" id="document" onChange={handleImageChange} />
              </label>
              {
                !oneTimeProof && !showUpdateProof && <span className='text-danger m-0' style={{ fontSize: "12px" }}>Invalid document. Please upload another.</span>
              }
            </div>
          </div>

          <div className="form-group boxed mt-2">
            <div className="input-wrapper">
              <label className="label">Payment Method</label>
              <select className="form-control custom-select" id="select4"
                value={transferType} onChange={(e) => setTransferType(e.target.value)}
                style={{ fontSize: "14px" }}>
                <option value="Bank" >Bank</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>
          </div>

          {
            transferType === "Bank" &&
            <>
              <div className="form-group boxed">
                <div className="input-wrapper">
                  <label className="label" htmlFor="bank">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your bank name"
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    style={{ fontSize: "14px" }}
                  />
                </div>
              </div>

              <div className="form-group boxed">
                <div className="input-wrapper">
                  <label className="label" htmlFor="account">
                    Account number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your account no."
                    name="account"
                    value={formData.account}
                    onChange={handleChange}
                    style={{ fontSize: "14px" }}
                  />
                </div>
              </div>

              <div className="form-group boxed">
                <div className="input-wrapper">
                  <label className="label " htmlFor="ifsc">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Bank IFSC Code"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleChange}
                    style={{ fontSize: "14px" }}
                  />
                </div>
              </div>
            </>
          }

          {
            transferType === "UPI" &&
            <div className="form-group boxed">
              <div className="input-wrapper">
                <label className="label " htmlFor="upi">
                  UPI
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your UPI"
                  name="upi"
                  value={formData.upi}

                  onChange={handleChange}
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>
          }
          {/* xxxxxxxxxxxxxxxxx QR Upload xxxxxxxxxxxxxxxxx */}
          {
            transferType === "UPI" &&
            <div className="form-group boxed">
              <div className="input-wrapper">
                <label className="label ">Upload QR Payment</label>
                <label htmlFor='qrcode'
                  className='rounded d-flex justify-content-center align-items-center'
                  style={{ border: '2px dashed blue', height: "200px", width: "100%" }}>
                  {
                    showChangeQr
                      ? <img src={showChangeQr} alt="Preview" className="imaged" style={{ height: "100%" }} />
                      : proofQr ? <img src={`${SITE_URL}/upload/idproof/${proofQr}`} alt="Document"
                        style={{ height: "100%" }} />
                        :
                        <span className="material-symbols-outlined" style={{ fontSize: "50px" }}>
                          cloud_upload
                        </span>
                  }
                  <input type="file" className='d-none' name="" id="qrcode" onChange={handleQrChange} />
                </label>
              </div>
            </div>
          }

          {/* xxxxxxxxxxxxxxxxx QR Upload xxxxxxxxxxxxxxxxx */}
          {
            transferType === "Wallet" &&
            <div className="form-group boxed">
              <div className="input-wrapper">
                <label className="label " htmlFor="Wallet">
                  Wallet (USDT BEP-20)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your wallet address"
                  name="wallet"
                  value={formData.wallet}
                  onChange={handleChange}
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>
          }

          <div className="form-group boxed mt-2">
            <button type='submit' className='btn btn-primary btn-block'>Submit</button>
          </div>

        </div>
      </form>
      {/* xxxxxxxxxxxxxx */}
{
  loading &&

      <div className="modal fade dialogbox show d-flex justify-content-center align-items-center" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div class="spinner-border text-warning" role="status" 
      style={{width: "50px", height: "50px", borderWidth: "4px"}}></div>
      </div>
}

      {/* xxxxxxxxxxxxxx */}
      <Toast msg={toast.msg} type={toast.type} show={toast.show} />
    </div>
  )
}

export default KycVerification
