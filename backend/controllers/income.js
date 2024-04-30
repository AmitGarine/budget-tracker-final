const IncomeSchema = require("../models/incomeModel")


exports.addIncome = async (req, res) => {
    const { title, amount, category, description, date, userId } = req.body;  // Include userId in the request body

    if (!title || !category || !description || !date || !userId) {
        return res.status(400).json({message: 'All fields including user ID are required!'});
    }

    if (amount <= 0) {
        return res.status(400).json({message: 'Amount must be greater than zero'});
    }

    const income = new IncomeSchema({
        user: userId,  // Linking the income to the user
        title, 
        amount, 
        category,
        description, 
        date
    });

    try {
        await income.save();
        res.status(200).json({message: 'Income Added', income});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

exports.getIncomes = async (req, res) => {
    const userId = req.query.userId;  // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({message: 'User ID is required'});
    }

    try {
        const incomes = await IncomeSchema.find({ user: userId }).sort({createdAt: -1});
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    const userId = req.query.userId;  // Get userId from query parameters

    if (!userId) {
        return res.status(400).json({message: 'User ID is required for verification'});
    }

    try {
        const income = await IncomeSchema.findOne({ _id: id, user: userId });
        if (!income) {
            return res.status(404).json({message: 'Income not found or not authorized'});
        }
        await income.deleteOne();
        res.status(200).json({message: 'Income Deleted'});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
};