import React from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';

class ExpensesComponent extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            title: '',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().slice(0, 10) // Use today's date as the default
        };
    }

    componentDidMount() {
        this.fetchExpenses();
    }

    fetchExpenses = () => {
        const { userId } = this.context.auth;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }
        axios.get(`http://localhost:3002/api/v1/get-expenses?userId=${userId}`)
            .then(response => {
                this.setState({ expenses: response.data });
            })
            .catch(error => console.error('Error fetching expenses:', error));
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    submitExpense = () => {
        const { userId } = this.context.auth;
        const { title, amount, category, description, date } = this.state;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }

        const payload = {
            title,
            amount,
            type: "expense",
            date, // Include the selected date
            category,
            description,
            userId
        };

        axios.post(`http://localhost:3002/api/v1/add-expense?userId=${userId}`, payload)
            .then(response => {
                console.log('Expense added:', response);
                this.fetchExpenses();
                this.context.triggerRefresh(); // Trigger any global state updates if needed
            })
            .catch(error => console.error('Error adding expense:', error));

        this.setState({
            title: '',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().slice(0, 10) // Reset date to today
        });
    }

    render() {
        return (
            <div className="ExpensesContainer">
                <h3>Expenses</h3>
                <input type="text" placeholder="Title" name="title" value={this.state.title} onChange={this.handleChange} />
                <input type="number" placeholder="Enter Expense Amount" name="amount" value={this.state.amount} onChange={this.handleChange} />
                <input type="date" name="date" value={this.state.date} onChange={this.handleChange} />
                <input type="text" placeholder="Category" name="category" value={this.state.category} onChange={this.handleChange} />
                <input type="text" placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
                <button className='submitButton' onClick={this.submitExpense}>Submit</button>
            </div>
        );
    }
}

export default ExpensesComponent;
