import React, { useState, useEffect } from "react";
import { SITE_URL, isAuthenticated } from "../Auth/Define";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const navigate = useNavigate();
  const [transactionData, setTransactionData] = useState([]);
  const [showBlank, setShowBlank] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const newData = new FormData();
      newData.append("cuid", isAuthenticated);
      axios
        .post(`${SITE_URL}/api/get-api/transaction.php`, newData)
        .then((resp) => {
          if (resp.data.length > 0) {
            setTransactionData(resp.data);
          } else {
            setShowBlank(true);
          }
        })
        .catch((error) => {
          console.log("Error in getting transaction list");
        });
    }
  }, []);

  const showDetails = (Id) => {
    navigate("/transaction-details", { state: { transactionId: Id } });
  };

  return (
    <div className="section mb-2 pb-5">
      {transactionData.length > 0 ? (
        <div className="mt-2">
          {transactionData.map((item, index) => {
            return (
              <ul
                className="listview image-listview mt-1"
                style={{ borderRadius: "10px" }}
                key={index}
              >
                <li onClick={() => showDetails(item.txnid)}>
                  <div className="item">
                    <div className={`icon-box bg-${item.txnstatus === 1 ? "warning" : item.txnstatus === 2 ? "success" : "danger"}`}>
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
                            : item.txnname.includes("Withdraw") ||
                              item.txnname.includes("Investment")
                              ? "Credit"
                              : item.txnname.includes("Purchased Bot")
                                ? "Debit"
                                : "Transaction"}
                        </header>
                        {item.txnname}
                        <footer>{item.txndate}</footer>
                      </div>
                      <strong
                        className={
                          item.txnname.startsWith("Level") ||
                            item.txnname.startsWith("Withdraw") ||
                            item.txnname.startsWith("Investment")
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {item.txnname.startsWith("Level") ||
                          item.txnname.startsWith("Withdraw") ||
                          item.txnname.startsWith("Investment")
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
      ) : (
        <div>
          {showBlank ? (
            <div className="col-12">
              <div className="card mt-2">
                <div className="card-body">
                  You haven't purchased anything yet .
                </div>
              </div>
            </div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "calc(100vh - 160px)" }}
            >
              <div className="spinner-border text-success" role="status"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Transactions;