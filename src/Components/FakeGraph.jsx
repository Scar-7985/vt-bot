import React from 'react';
// import './Portfolio.css';

const investors = [
  {
    name: "Ramesh Kumar",
    invested: 1000.00,
    current: 1050.00,
  },
  {
    name: "Priya Sharma",
    invested: 850.00,
    current: 840.00,
  },
  {
    name: "Anil Mehta",
    invested: 647.88,
    current: 624.25,
  },
];

export default function FakeGraph() {
  const totalInvested = investors.reduce((sum, p) => sum + p.invested, 0);
  const totalCurrent = investors.reduce((sum, p) => sum + p.current, 0);
  const totalPL = totalCurrent - totalInvested;
  const totalPLPercent = ((totalPL / totalInvested) * 100).toFixed(2);

  return (
    <div className="portfolio">
      <div className="header">
        <h2>Portfolio</h2>
        <div className="tabs">
          <span className="active">Holdings</span>
          <span>Positions</span>
        </div>
      </div>

      <div className="summary">
        <div>Invested: ₹{totalInvested.toFixed(2)}</div>
        <div>Current: ₹{totalCurrent.toFixed(2)}</div>
        <div style={{ color: totalPL >= 0 ? 'green' : 'red' }}>
          P&L: {totalPL >= 0 ? '+' : ''}₹{totalPL.toFixed(2)} ({totalPLPercent}%)
        </div>
      </div>

      <div className="holdings">
        {investors.map((investor, idx) => {
          const pl = investor.current - investor.invested;
          const plPercent = ((pl / investor.invested) * 100).toFixed(2);
          return (
            <div className="stock" key={idx}>
              <div className="stock-header">
                <span>{investor.name}</span>
                <span style={{ color: pl >= 0 ? 'green' : 'red' }}>
                  {pl >= 0 ? '+' : ''}₹{pl.toFixed(2)} ({plPercent}%)
                </span>
              </div>
              <div className="stock-details">
                <span>Invested: ₹{investor.invested}</span>
                <span>Current: ₹{investor.current}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="footer-nav">
        <span>Watchlist</span>
        <span>Orders</span>
        <span className="active">Portfolio</span>
        <span>Tools</span>
        <span>Account</span>
      </div>
    </div>
  );
}
