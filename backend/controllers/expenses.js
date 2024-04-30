const ExpenseSchema = require("../models/expenseModel")


exports.addExpense = async (req, res) => {
    const { title, amount, category, description, date, userId } = req.body;  // Include userId in the request body

    if (!title || !category || !description || !date || !userId) {
        return res.status(400).json({ message: 'All fields including user ID are required!' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const expense = new ExpenseSchema({
        user: userId,  // Use the userId provided in the request body
        title, 
        amount, 
        category,
        description, 
        date
    });

    try {
        await expense.save();
        res.status(200).json({ message: 'Expense Added', expense });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    const userId = req.query.userId;  // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const expenses = await ExpenseSchema.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    const userId = req.query.userId;  // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required for verification' });
    }

    try {
        const expense = await ExpenseSchema.findOne({ _id: id, user: userId });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found or not authorized' });
        }
        await expense.remove();
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};