import React, { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Balances(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBalances = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/expenses/balances`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(()=> { fetchBalances(); }, []);

  return (
    <div>
      <h2>Balances</h2>
      {loading && <p>Loading...</p>}
      {data && (
        <div>
          <h3>Net balances</h3>
          <ul>
            {Object.entries(data.net).map(([name, bal]) => (
              <li key={name}>{name}: {bal >= 0 ? `is owed ₹${bal}` : `owes ₹${Math.abs(bal)}`}</li>
            ))}
          </ul>

          <h3>Suggested settlements</h3>
          {data.settlements.length === 0 && <p>All settled.</p>}
          <ul>
            {data.settlements.map((s, idx) => (
              <li key={idx}>{s.from} → {s.to} : ₹{s.amount}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
