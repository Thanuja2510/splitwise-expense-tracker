import React, { useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AddExpense(){
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [participantsText, setParticipantsText] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const participants = participantsText.split(',').map(s => s.trim()).filter(Boolean);
    if(!description || !amount || !paidBy || participants.length===0){
      setMessage('Please fill all fields');
      return;
    }
    const res = await fetch(`${API}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ description, amount: parseFloat(amount), paidBy, participants })
    });
    if (res.ok) {
      setMessage('Expense added');
      setDescription(''); setAmount(''); setPaidBy(''); setParticipantsText('');
    } else {
      setMessage('Error adding expense');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={submit}>
        <div>
          <label>Description</label><br/>
          <input value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Amount</label><br/>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <label>Paid By (name)</label><br/>
          <input value={paidBy} onChange={e => setPaidBy(e.target.value)} />
        </div>
        <div>
          <label>Participants (comma separated)</label><br/>
          <input value={participantsText} onChange={e => setParticipantsText(e.target.value)} placeholder="Alice, Bob, Charlie" />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Add</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
