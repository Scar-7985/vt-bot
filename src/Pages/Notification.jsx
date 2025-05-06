import React, { useState } from 'react'

const Notification = () => {

    const [notificationData, setNotificationData] = useState([]);
    const [showBlank, setShowBlank] = useState(null);

    useEffect(() => {

        axios.post(`${SITE_URL}/api/get-api/notice.php`).then(resp => {
            if(resp.data.length > 0){
                setNotificationData(resp.data)
            }else{
                setShowBlank(true)
            }
            console.log("Notice data ", resp.data);
        })

    }, [])

    return (
        <div className="section mb-2 pb-5">
        {notificationData.length > 0 ? (
          <div className="mt-2">
            {notificationData.map((item, index) => {
              return (
                <ul
                  className="listview image-listview mt-1"
                  style={{ borderRadius: "10px" }}
                  key={index}
                >
                  <li>
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
                          className={
                            item.txnname.startsWith("Level") ||
                              item.txnname.startsWith("Withdraw")
                              ? "text-success"
                              : "text-danger"
                          }
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
        ) : (
          <div>
            {showBlank ? (
              <div className="col-12">
                <div className="card mt-2">
                  <div className="card-body">
                    No notifications to show yet .
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
    )
}

export default Notification
