import React from 'react';
import axios from 'axios';

class IncomeComponent extends React.Component {
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
        axios.get('http://localhost:3002/api/v1/get-incomes')
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
        const { title, amount, category, description, selectedDay } = this.state;

        const payload = {
            title: title,
            amount: amount,
            type: "income",
            date: new Date(), // Automatically sets the date to current date/time
            category: category,
            description: description
        };

        axios.post('http://localhost:3002/api/v1/add-income', payload)
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
                    <select
                        name="selectedDay"
                        value={this.state.selectedDay}
                        onChange={this.handleChange}
                    >
                        <option value='monday'>Monday</option>
                        <option value='tuesday'>Tuesday</option>
                        <option value='wednesday'>Wednesday</option>
                        <option value='thursday'>Thursday</option>
                        <option value='friday'>Friday</option>
                        <option value='saturday'>Saturday</option>
                        <option value='sunday'>Sunday</option>
                    </select>
                </div>
                <div>
                    <button onClick={this.submitIncome}>Submit</button>
                </div>
                <div>
                    <ul>
                        {this.state.incomes.map(income => (
                            <li key={income._id}>{income.title} - {income.amount} - {income.category}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default IncomeComponent;
