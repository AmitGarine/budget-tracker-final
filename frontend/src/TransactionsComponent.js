import React, { Component } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './App.css';
import { AppContext } from './AppContext';

class TransactionsComponent extends Component {
    static contextType = AppContext;


    constructor(props) {
        super(props);
        this.state = {
            totalExpenses: 0,
            totalIncome: 0,
            balance: 0,
            currency: 'USD',
            exchangeRates: { USD: 1 },
            incomes: [],
            expenses: [],
            originalExpenses: 0,
            originalIncome: 0
        };
        this.chartRef = React.createRef();
        this.chart = null;
    }

    componentDidMount() {
        this.fetchTransactionData();
        this.fetchExchangeRates();
    }

    fetchExchangeRates = () => {
        const apiKey = '0fdb5b17c585d86a0060d1f1'; // Use your API key
        axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
            .then(response => {
                const rates = response.data.conversion_rates;
                this.setState({ exchangeRates: rates }, this.updateTransactionAmounts);
            })
            .catch(error => console.error('Error fetching exchange rates:', error));
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.currency !== this.state.currency) {
            this.updateTransactionAmounts();
        }
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy();
        }
    }

    updateTransactionAmounts = () => {
        const { originalExpenses, originalIncome, exchangeRates, currency } = this.state;
        const rate = exchangeRates[currency] || 1; // Default to 1 if no rate is found to avoid errors
    
        this.setState({
            totalExpenses: originalExpenses * rate,
            totalIncome: originalIncome * rate,
            balance: (originalIncome - originalExpenses) * rate
        }, this.updateChartCurrency); // Update the chart with new data after state update
    };
    

    fetchTransactionData = () => {
        const { userId } = this.context.auth;
        if (!userId) {
            console.error('No user ID provided');
            return;
        }

        Promise.all([
            axios.get(`http://localhost:3002/api/v1/get-incomes?userId=${userId}`),
            axios.get(`http://localhost:3002/api/v1/get-expenses?userId=${userId}`)
        ]).then(([incomesResponse, expensesResponse]) => {
            const incomes = incomesResponse.data;
            const expenses = expensesResponse.data;
            const totalIncomeUSD = incomes.reduce((acc, curr) => acc + curr.amount, 0);
            const totalExpensesUSD = expenses.reduce((acc, curr) => acc + curr.amount, 0);
            this.setState({
                incomes,
                expenses,
                originalExpenses: totalExpensesUSD,
                originalIncome: totalIncomeUSD
            }, () => {
                this.calculateTotals();
                this.buildChart();
            });
        }).catch(error => console.error('Error fetching transactions:', error));
    };

    calculateTotals = () => {
        const { originalExpenses, originalIncome, exchangeRates, currency } = this.state;
        const rate = exchangeRates[currency] || 1;
        this.setState({
            totalExpenses: originalExpenses * rate,
            totalIncome: originalIncome * rate,
            balance: (originalIncome - originalExpenses) * rate
        }, this.updateChartCurrency);
    };

    updateChartCurrency = () => {
        const { incomes, expenses, exchangeRates, currency } = this.state;
        const rate = exchangeRates[currency] || 1;
        const accumulatedIncomes = incomes.map(income => income.amount * rate)
                                          .reduce((acc, curr, index) => [...acc, acc.length ? acc[acc.length - 1] + curr : curr], []);
        const accumulatedExpenses = expenses.map(expense => expense.amount * rate)
                                            .reduce((acc, curr, index) => [...acc, acc.length ? acc[acc.length - 1] + curr : curr], []);

        if (this.chart) {
            this.chart.data.datasets[0].data = accumulatedIncomes;
            this.chart.data.datasets[1].data = accumulatedExpenses;
            this.chart.options.scales.y.title.text = `Cumulative Amount (${currency})`; // Update chart axis label
            this.chart.update();
        }
    };

    handleCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        this.setState({ currency: newCurrency }, this.calculateTotals);
    };

    buildChart = () => {
        const { incomes, expenses, currency, exchangeRates } = this.state;
        const rate = exchangeRates[currency] || 1;
    
        // Check if a chart instance exists and destroy it before creating a new one
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    
        // Convert the amounts using the current exchange rate
        const accumulatedIncomes = incomes.map(income => income.amount * rate).reduce((acc, curr, index) => [...acc, acc.length ? acc[acc.length - 1] + curr : curr], []);
        const accumulatedExpenses = expenses.map(expense => expense.amount * rate).reduce((acc, curr, index) => [...acc, acc.length ? acc[acc.length - 1] + curr : curr], []);
    
        // Get the canvas context
        const ctx = this.chartRef.current.getContext('2d');
    
        // Create a new chart instance on the canvas
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
                            text: 'Cumulative Amount (' + currency + ')'
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
    };
    

    render() {
        const { totalExpenses, totalIncome, balance, currency, exchangeRates } = this.state;
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
                    <select value={currency} onChange={this.handleCurrencyChange}>
                        {Object.keys(exchangeRates).map(key => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }
}

export default TransactionsComponent;
