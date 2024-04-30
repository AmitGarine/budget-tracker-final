const { addExpense, getExpenses, deleteExpense } = require('../controllers/expenses')
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income')
const { registerUser, loginUser, getAllUsers } = require('../controllers/auth');


const router = require('express').Router()

router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpenses)
    .delete('/delete-expense/:id', deleteExpense)
    .post('/register', registerUser)
    .post('/login', loginUser)
    .get('/users', getAllUsers); 

module.exports = router