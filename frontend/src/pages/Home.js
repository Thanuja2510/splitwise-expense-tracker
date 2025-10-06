import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Home(){
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/expenses`);
    const data = await res.json();
    setExpenses(data);
    setLoading(false);
  };

  useEffect(()=> { fetchExpenses(); }, []);

  const deleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await fetch(`${API}/api/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
  };

  return (
    <div>
      <h2>All Expenses</h2>
      {loading ? <p>Loading...</p> : (
        <div>
          {expenses.length === 0 && <p>No expenses yet.</p>}
          <ul>
            {expenses.map(e => (
              <li key={e._id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}>
                <div><strong>{e.description}</strong> — ₹{e.amount}</div>
                <div>Paid by: {e.paidBy} | Participants: {e.participants.join(', ')} | {new Date(e.date).toLocaleDateString()}</div>
                <button onClick={() => deleteExpense(e._id)} style={{ marginTop: 8 }}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
