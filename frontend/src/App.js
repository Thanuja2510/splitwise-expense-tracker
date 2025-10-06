import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import Balances from './pages/Balances';

function App() {
  return (
    <Router>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Splitwise Clone - Level 1</h1>
          <nav>
            <Link to="/" style={{ marginRight: 10 }}>Home</Link>
            <Link to="/add" style={{ marginRight: 10 }}>Add Expense</Link>
            <Link to="/balances">Balances</Link>
          </nav>
        </header>

        <main style={{ marginTop: 20 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/balances" element={<Balances />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
