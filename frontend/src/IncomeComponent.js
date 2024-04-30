import React from 'react';
import './App.css';

class IncomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            income: '',
            selectedDay: 'monday' // Default day is monday
        }
    }

    handleIncomeChange = (event) => {
        this.setState({ income: event.target.value });
    }

    handleDayChange = (event) => {
        this.setState({ selectedDay: event.target.value });
    }


    submitIncome = () => {
        const { income, selectedDay } = this.state;

        console.log("Income:", income);
        console.log("Day:", selectedDay);
        // Reset Form
        this.setState({ income: '', selectedDay: 'monday' })
    };


    render() {
        return (
            <div>
                <h3>Income</h3>
                <div>
                    <input type='number' placeholder='Enter Income' value={this.state.income} onChange={this.handleIncomeChange} />
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
                    <button onClick={this.submitIncome}>Submit</button>
                </div>
            </div>
        )
    }
}

export default IncomeComponent;