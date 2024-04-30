import React from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './App.css';

class TransactionsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalExpenses: 0,
            totalIncome: 0,
            balance: 0,
            currency: 'USD',
            exchangeRates: { USD: 1, Euro: 0.95, Pound: 0.82, Yen: 135 } // Example rates
        };
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidMount() {
        this.fetchTransactionData();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    fetchTransactionData = () => {
        const incomesPromise = axios.get('http://localhost:3002/api/v1/get-incomes');
        const expensesPromise = axios.get('http://localhost:3002/api/v1/get-expenses');

        Promise.all([incomesPromise, expensesPromise])
            .then(([incomesResponse, expensesResponse]) => {
                const incomes = incomesResponse.data;
                const expenses = expensesResponse.data;
                this.calculateTotals(incomes, expenses);
                this.buildChart(incomes, expenses);
            })
            .catch(error => console.error('Error fetching transactions:', error));
    };

    calculateTotals = (incomes, expenses) => {
        const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

        this.setState({
            totalExpenses,
            totalIncome,
            balance: totalIncome - totalExpenses
        });
    };

    handleCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        this.setState({ currency: newCurrency }, () => this.updateChartCurrency());
    };

    updateChartCurrency = () => {
        if (this.chart) {
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data = dataset.data.map(value =>
                    (value / this.state.exchangeRates[this.state.currency]) * this.state.exchangeRates[this.state.currency]);
            });
            this.chart.update();
        }
    };

    buildChart(incomes, expenses) {
        const ctx = this.chartRef.current.getContext('2d');
        if (this.chart) {
            this.chart.destroy();
        }

        // Accumulate the values for incomes and expenses
        const accumulatedIncomes = incomes.map(income => income.amount).reduce((acc, curr, index) => {
            if (index === 0) {
                acc.push(curr);
            } else {
                acc.push(acc[index - 1] + curr);
            }
            return acc;
        }, []);

        const accumulatedExpenses = expenses.map(expense => expense.amount).reduce((acc, curr, index) => {
            if (index === 0) {
                acc.push(curr);
            } else {
                acc.push(acc[index - 1] + curr);
            }
            return acc;
        }, []);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [
                    {
                        label: 'Income',
                        data: accumulatedIncomes,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    },
                    {
                        label: 'Expenses',
                        data: accumulatedExpenses,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cumulative Amount (' + this.state.currency + ')'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Day of the Week'
                        }
                    }
                }
            }
        });
    }


    render() {
        const { totalExpenses, totalIncome, balance, currency } = this.state;
        return (
            <div>
                <h3>Transactions Overview</h3>
                <canvas ref={this.chartRef} />
                <div className="TransactionsTotalsContainer">
                    <div className="TransactionBox">
                        <h3>Total Expenses</h3>
                        <p>${totalExpenses.toFixed(2)}</p>
                    </div>
                    <div className="TransactionBox">
                        <h3>Total Income</h3>
                        <p>${totalIncome.toFixed(2)}</p>
                    </div>
                    <div className="TransactionBox">
                        <h3>Balance</h3>
                        <p>${balance.toFixed(2)}</p>
                    </div>
                </div>
                <div>
                    Select Currency
                    <select value={currency} onChange={this.handleCurrencyChange}>
                        <option value='USD'>USD</option>
                        <option value='Euro'>Euro</option>
                        <option value='Pound'>Pound</option>
                        <option value='Yen'>Yen</option>
                    </select>
                </div>
            </div>
        );
    }
}

export default TransactionsComponent;
