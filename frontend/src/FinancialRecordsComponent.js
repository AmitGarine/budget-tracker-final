import React, { Component } from 'react';
import axios from 'axios';
import RefreshContext from './RefreshContext';  // Ensure this path is correct

class FinancialRecordsComponent extends Component {
    static contextType = RefreshContext;  // Using contextType to consume context

    state = {
        expenses: [],
        incomes: [],
        isLoading: false,  // Track loading state
        error: null  // Track errors
    };

    componentDidMount() {
        this.fetchFinancialRecords();
    }

    fetchFinancialRecords = () => {
        this.setState({ isLoading: true, error: null });
        const expensesPromise = axios.get('http://localhost:3002/api/v1/get-expenses');
        const incomesPromise = axios.get('http://localhost:3002/api/v1/get-incomes');

        Promise.all([expensesPromise, incomesPromise])
            .then(([expensesResponse, incomesResponse]) => {
                this.setState({
                    expenses: expensesResponse.data,
                    incomes: incomesResponse.data,
                    isLoading: false
                });
            })
            .catch(error => {
                console.error('Error fetching financial records:', error);
                this.setState({ error: 'Failed to fetch data', isLoading: false });
            });
    };

    deleteRecord = (id, type) => {
        this.setState({ isLoading: true });
        const endpoint = type === 'expense' ? 'delete-expense' : 'delete-income';
        axios.delete(`http://localhost:3002/api/v1/${endpoint}/${id}`)
            .then(() => {
                alert(`${type} deleted successfully`);
                this.fetchFinancialRecords();  // Refresh the local component state
                this.context.triggerRefresh(); // Trigger refresh in TransactionsComponent via context
            })
            .catch(error => {
                console.error(`Error deleting ${type}:`, error);
                alert(`Failed to delete ${type}`);
                this.setState({ isLoading: false });
            });
    };

    render() {
        const { expenses, incomes, isLoading, error } = this.state;
        return (
            <div>
                {error && <p className="error">{error}</p>}
                {isLoading ? <p>Loading...</p> : (
                    <>
                        <h2>Expenses</h2>
                        <ul>
                            {expenses.map(expense => (
                                <li key={expense._id}>
                                    {expense.title} - ${expense.amount}
                                    <button onClick={() => this.deleteRecord(expense._id, 'expense')}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <h2>Incomes</h2>
                        <ul>
                            {incomes.map(income => (
                                <li key={income._id}>
                                    {income.title} - ${income.amount}
                                    <button onClick={() => this.deleteRecord(income._id, 'income')}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    }
}

export default FinancialRecordsComponent;
