import React from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 


class IncomeComponent extends React.Component {
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            incomes: [],
            title: '',
            amount: '',
            category: '',
            description: '',
            selectedDay: 'monday' // Default day is Monday
        }
    }

    componentDidMount() {
        this.fetchIncomes();
    }

    fetchIncomes = () => {
        const { userId } = this.context.auth;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }
        axios.get(`http://localhost:3002/api/v1/get-incomes?userId=${userId}`)
            .then(response => {
                this.setState({ incomes: response.data });
            })
            .catch(error => {
                console.error('Error fetching incomes:', error);
            });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    submitIncome = () => {
        const { userId } = this.context.auth;
        const { title, amount, category, description, selectedDay } = this.state;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }

        const payload = {
            title,
            amount,
            type: "income",
            date: new Date(),
            category,
            description,
            userId
        };

        axios.post(`http://localhost:3002/api/v1/add-income?userId=${userId}`, payload)
            .then(response => {
                console.log('Income added:', response);
                this.fetchIncomes(); // Refresh the incomes list
            })
            .catch(error => {
                console.error('Error adding income:', error);
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
                <h3>Income</h3>
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
                        placeholder="Enter Income Amount"
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
                    <button onClick={this.submitIncome}>Submit</button>
                </div>
            </div>
        );
    }
}

export default IncomeComponent;
