import React, { useEffect, useState } from 'react';

const currencies = ["GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "USDCAD"];

const Trading = () => {
  const [data, setData] = useState([]);

  const generateId = () => {
    const num = Math.floor(Math.random() * 1000);
    return 'VT' + String(num).padStart(3, '0') + '...';
  };

  const generateFakeData = () => {
    const fakeData = Array.from({ length: 10 }).map(() => {
      const invested = +(Math.random() * 5000 + 500).toFixed(2); // 500 - 5500
      const current = +(invested * (0.9 + Math.random() * 0.2)).toFixed(2); // +/-10%
      return {
        name: currencies[Math.floor(Math.random() * currencies.length)],
        invested,
        current,
        id: generateId(),
      };
    });
    return fakeData;
  };

  useEffect(() => {
    setData(generateFakeData());

    const interval = setInterval(() => {
      setData(generateFakeData());
    }, 2000); // update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section mt-2">
      <div className="portfolio">
        <div className="holdings">
          {data.slice(0, 5).map((investor, idx) => {
            const pl = investor.current - investor.invested;
            const plPercent = ((pl / investor.invested) * 100).toFixed(2);
            return (
              <div className="stock" key={idx}>
                <div className="stock-header">
                  <span className="text-dark">{investor.name}</span>
                  <span style={{ color: pl >= 0 ? 'green' : 'red' }}>
                    {pl >= 0 ? '+' : ''}{pl.toFixed(2)} ({plPercent}%)
                  </span>
                </div>
                <div className="stock-details">
                  <span>{investor.id}</span>
                  <span>{investor.current.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Trading;