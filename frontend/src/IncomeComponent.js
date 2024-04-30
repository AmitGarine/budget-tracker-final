import React from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';

class IncomeComponent extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            incomes: [],
            title: '',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().slice(0, 10) // Default to today's date
        };
    }

    componentDidMount() {
        this.fetchIncomes();
    }

    fetchIncomes = () => {
        const { userId } = this.context.auth;
        axios.get(`http://localhost:3002/api/v1/get-incomes?userId=${userId}`)
            .then(response => {
                this.setState({ incomes: response.data });
            })
            .catch(error => console.error('Error fetching incomes:', error));
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    submitIncome = () => {
        const { userId } = this.context.auth;
        const { title, amount, category, description, date } = this.state;
        const payload = {
            title,
            amount,
            type: "income",
            date,
            category,
            description,
            userId
        };

        axios.post(`http://localhost:3002/api/v1/add-income?userId=${userId}`, payload)
            .then(() => {
                this.fetchIncomes();
                this.context.triggerRefresh();
            })
            .catch(error => console.error('Error adding income:', error));

        this.setState({
            title: '',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().slice(0, 10)
        });
    }

    render() {
        return (
            <div className='IncomeContainer'>
                <h3>Income</h3>
                <input type="text" placeholder="Title" name="title" value={this.state.title} onChange={this.handleChange} />
                <input type="number" placeholder="Enter Income Amount" name="amount" value={this.state.amount} onChange={this.handleChange} />
                <input type="date" name="date" value={this.state.date} onChange={this.handleChange} />
                <input type="text" placeholder="Category" name="category" value={this.state.category} onChange={this.handleChange} />
                <input type="text" placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
                <button onClick={this.submitIncome}>Submit</button>
            </div>
        );
    }
}

export default IncomeComponent;
