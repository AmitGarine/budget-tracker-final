import React from 'react';
import axios from 'axios';

class ExpensesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            title: '',
            amount: '',
            category: '',
            description: '',
            selectedDay: 'monday' // Default day is Monday
        }
    }

    componentDidMount() {
        this.fetchExpenses();
    }

    fetchExpenses = () => {
        axios.get('http://localhost:3002/api/v1/get-expenses')
            .then(response => {
                this.setState({ expenses: response.data });
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
            });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    submitExpense = () => {
        const { title, amount, category, description, selectedDay } = this.state;

        const payload = {
            title: title,
            amount: amount,
            type: "expense",
            date: new Date(), // Automatically sets the date to current date/time
            category: category,
            description: description
        };

        axios.post('http://localhost:3002/api/v1/add-expense', payload)
            .then(response => {
                console.log('Expense added:', response);
                this.fetchExpenses(); // Refresh the expenses list
            })
            .catch(error => {
                console.error('Error adding expense:', error);
            });

        // Reset Form
        this.setState({
            title: '',
            amount: '',
            category: '',
            description: '',
            selectedDay: 'monday'
        });
    }

    render() {
        return (
            <div>
                <h3>Expenses</h3>
                <div>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        placeholder="Enter Expense Amount"
                        name="amount"
                        value={this.state.amount}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Category"
                        name="category"
                        value={this.state.category}
                        onChange={this.handleChange}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                    />
                </div>
                
                <div>
                    <button onClick={this.submitExpense}>Submit</button>
                </div>
            </div>
        );
    }
}

export default ExpensesComponent;
