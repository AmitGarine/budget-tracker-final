import React from 'react';

class ExpensesCompoent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expense: '',
            selectedDay: 'monday' // Default day is Monday
        }
    }

    handleExpenseChange = (event) => {
        this.setState({ expense: event.target.value });
    }

    handleDayChange = (event) => {
        this.setState({ selectedDay: event.target.value });
    }

    submitExpense = () => {
        const { expense, selectedDay } = this.state;

        console.log("Expense:", expense);
        console.log("Day:", selectedDay);
        // Reset Form
        this.setState({ expense: '', selectedDay: 'monday' });
    }

    render() {
        return (
            <div>
                <h3>Expenses</h3>
                <div>
                    <input type='number' placeholder='Enter Expense' value={this.state.expense} onChange={this.handleExpenseChange} />
                </div>
                <div>
                    Enter Date
                    <select value={this.state.selectedDay} onChange={this.handleDayChange}>
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
                    <button onClick={this.submitExpense}>Submit</button>
                </div>
            </div>
        )
    }
}

export default ExpensesCompoent;