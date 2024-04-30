import React, { Component } from 'react';
import axios from 'axios';
import RefreshContext from './RefreshContext';  // Ensure this path is correct
import './App.css'
import { AuthContext } from './AuthContext'; 

class FinancialRecordsComponent extends Component {
    static contextType = RefreshContext;
    static contextType = AuthContext;

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
        const { userId } = this.context.auth;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }

        this.setState({ isLoading: true, error: null });
        const expensesPromise = axios.get(`http://localhost:3002/api/v1/get-expenses?userId=${userId}`);
        const incomesPromise = axios.get(`http://localhost:3002/api/v1/get-incomes?userId=${userId}`);

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
        const { userId } = this.context.auth;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }
        this.setState({ isLoading: true });
        const endpoint = type === 'expense' ? 'delete-expense' : 'delete-income';
        axios.delete(`http://localhost:3002/api/v1/${endpoint}/${id}?userId=${userId}`)
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
                        <div>
                            <h2>Expenses</h2>
                            <table className='TransactionsTable'>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Amount</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map(expense => (
                                        <tr key={expense._id}>
                                            <td>{expense.title}</td>
                                            <td>${expense.amount.toFixed(2)}</td>
                                            <td>
                                                <button onClick={() => this.deleteRecord(expense._id, 'expense')}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h2>Incomes</h2>
                            <table className='TransactionsTable'>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Amount</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomes.map(income => (
                                        <tr key={income._id}>
                                            <td>{income.title}</td>
                                            <td>${income.amount.toFixed(2)}</td>
                                            <td>
                                                <button onClick={() => this.deleteRecord(income._id, 'income')}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </>
                )}
            </div>
        );
    }
}

export default FinancialRecordsComponent;
