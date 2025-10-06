const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

 
router.post('/', async (req, res) => {
  try {
    const { description, amount, paidBy, participants, date } = req.body;
    if (!description || !amount || !paidBy || !participants || participants.length===0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const expense = new Expense({ description, amount, paidBy, participants, date });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.get('/balances', async (req, res) => {
  try {
    const expenses = await Expense.find();
     
    const net = {};  
    expenses.forEach(exp => {
      const amt = exp.amount;
      const participants = exp.participants;
      const share = parseFloat((amt / participants.length).toFixed(2));
       
       
      const payer = exp.paidBy;
      if (!net[payer]) net[payer] = 0;
      net[payer] += (amt - share);

      participants.forEach(p => {
        if (!net[p]) net[p] = 0;
        net[p] -= share;
      });

       
       
      net[payer] += share;  
       
    });

     
     
    const cleanNet = {};
    expenses.forEach(exp => {
      const total = exp.amount;
      const parts = exp.participants;
      const share = parseFloat((total / parts.length).toFixed(2));
      const payer = exp.paidBy;
      if (!cleanNet[payer]) cleanNet[payer] = 0;
       
      cleanNet[payer] += parseFloat((total - share).toFixed(2));
      parts.forEach(p => {
        if (!cleanNet[p]) cleanNet[p] = 0;
        cleanNet[p] -= share;
      });
    
    });

  
    const finalNet = {};
    expenses.forEach(exp => {
      const total = exp.amount;
      const parts = exp.participants;
      const share = parseFloat((total / parts.length).toFixed(2));

    
      parts.forEach(name => {
        finalNet[name] = (finalNet[name] || 0) - share;
      });

      finalNet[exp.paidBy] = (finalNet[exp.paidBy] || 0) + total;
    });

    
    Object.keys(finalNet).forEach(k => finalNet[k] = parseFloat(finalNet[k].toFixed(2)));

    const creditors = [];
    const debtors = [];
    Object.entries(finalNet).forEach(([name, bal]) => {
      if (bal > 0) creditors.push({ name, amount: bal });
      else if (bal < 0) debtors.push({ name, amount: Math.abs(bal) });
    });

    
    creditors.sort((a,b)=> b.amount - a.amount);
    debtors.sort((a,b)=> b.amount - a.amount);

    const settlements = [];
    let i=0, j=0;
    while(i<debtors.length && j<creditors.length){
      const owe = debtors[i];
      const cred = creditors[j];
      const amount = Math.min(owe.amount, cred.amount);
      settlements.push({ from: owe.name, to: cred.name, amount: parseFloat(amount.toFixed(2)) });
      owe.amount -= amount;
      cred.amount -= amount;
      if (Math.abs(owe.amount) < 0.01) i++;
      if (Math.abs(cred.amount) < 0.01) j++;
    }

    res.json({ net: finalNet, settlements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
