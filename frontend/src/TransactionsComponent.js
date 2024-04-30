import React, { Component } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import './App.css';
import { AppContext } from './AppContext';
import 'chartjs-adapter-date-fns';  // Ensure proper imports for date handling

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
        const apiKey = '0fdb5b17c585d86a0060d1f1';
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
        const rate = exchangeRates[currency] || 1;
        this.setState({
            totalExpenses: originalExpenses * rate,
            totalIncome: originalIncome * rate,
            balance: (originalIncome - originalExpenses) * rate
        }, this.updateChartCurrency);
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
            this.setState({
                incomes,
                expenses,
                originalExpenses: expenses.reduce((acc, curr) => acc + curr.amount, 0),
                originalIncome: incomes.reduce((acc, curr) => acc + curr.amount, 0)
            }, this.calculateTotals);
        }).catch(error => console.error('Error fetching transactions:', error));
    };

    calculateTotals = () => {
        this.updateChartCurrency(); // This triggers chart update after totals are recalculated
    };

    updateChartCurrency = () => {
        const { incomes, expenses, exchangeRates, currency } = this.state;
        const rate = exchangeRates[currency] || 1;
        this.buildChart(incomes, expenses, rate, currency);  // Pass necessary data directly
    };

    handleCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        this.setState({ currency: newCurrency }, this.calculateTotals);
    };

    buildChart = () => {
        const { incomes, expenses, currency, exchangeRates } = this.state;
        const rate = exchangeRates[currency] || 1;
    
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    
        const ctx = this.chartRef.current.getContext('2d');
    
        // Sort and map incomes and expenses to ensure all data points are valid
        const sortedIncomes = incomes
            .filter(inc => inc.date && !isNaN(new Date(inc.date).getTime()))
            .sort((a, b) => new Date(a.date) - new Date(b.date))  // Sort by date
            .map(income => ({
                x: new Date(income.date),
                y: income.amount * rate
            }));
    
        // Calculate cumulative totals for a smoother line graph
        const cumulativeIncomes = sortedIncomes.reduce((acc, curr) => {
            const lastAmount = acc.length > 0 ? acc[acc.length - 1].y : 0;
            curr.y += lastAmount;
            acc.push(curr);
            return acc;
        }, []);
    
        const sortedExpenses = expenses
            .filter(exp => exp.date && !isNaN(new Date(exp.date).getTime()))
            .sort((a, b) => new Date(a.date) - new Date(b.date))  // Sort by date
            .map(expense => ({
                x: new Date(expense.date),
                y: expense.amount * rate
            }));
    
        const cumulativeExpenses = sortedExpenses.reduce((acc, curr) => {
            const lastAmount = acc.length > 0 ? acc[acc.length - 1].y : 0;
            curr.y += lastAmount;
            acc.push(curr);
            return acc;
        }, []);
    
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Income',
                        data: cumulativeIncomes,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false
                    },
                    {
                        label: 'Expenses',
                        data: cumulativeExpenses,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: 'MM/dd/yyyy' // Corrected date format
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: `Cumulative Amount (${currency})`
                        }
                    }
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                },
            }
        });
        
    };
    

    render() {
        const { totalExpenses, totalIncome, balance, currency, exchangeRates } = this.state;
        return (
            <div>
                <h3>Budget Overview</h3>
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
                <div className='SelectBoxContainer'>
                    <select className='select-box' value={currency} onChange={this.handleCurrencyChange}>
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
