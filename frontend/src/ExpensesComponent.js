import React from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 


class ExpensesComponent extends React.Component {
    static contextType = AuthContext;

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
        const { userId } = this.context.auth;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }
        axios.get(`http://localhost:3002/api/v1/get-expenses?userId=${userId}`)
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
        const { userId } = this.context.auth;
        const { title, amount, category, description, selectedDay } = this.state;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }

        const payload = {
            title,
            amount,
            type: "expense",
            date: new Date(),
            category,
            description,
            userId
        };

        axios.post(`http://localhost:3002/api/v1/add-expense?userId=${userId}`, payload)
            .then(response => {
                console.log('Expense added:', response);
                this.fetchExpenses();
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
