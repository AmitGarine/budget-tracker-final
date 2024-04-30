// import React, { Component, useEffect, useRef } from 'react';
// import Chart from 'chart.js/auto';

// import './App.css';

// class TransactionsComponent extends React.Component {
//     constructor(props) {
//         super(props);
//         this.chartRef = React.createRef();
//         this.chart = null; // Store reference to the chart instance

//     }

//     componentDidMount() {
//         this.buildChart();
//     }

//     componentWillUnmount() {
//         if (this.chart) {
//             this.chart.destroy(); // Destroy the chart instance when the component unmounts
//         }
//     }

//     buildChart() {
//         const ctx = this.chartRef.current.getContext('2d');
//         if (this.chart) {
//             this.chart.destroy(); // Destroy previous chart instance if exists
//         }
//         new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
//                 datasets: [{
//                     label: 'Transaction Amount',
//                     data: [1, 2, 3, 4, 5, 6, 7],
//                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         title: {
//                             display: true,
//                             text: 'Amount ($)'
//                         }
//                     },
//                     x: {
//                         title: {
//                             display: true,
//                             text: 'Day of the Week'
//                         }
//                     }
//                 }
//             }
//         });
//     }

//     render() {
//         return (
//             <div>
//                 <h3>Transactions</h3>
//                 <div>
//                     <canvas ref={this.chartRef} width='400' height='200'></canvas>
//                 </div>

//                 <div className="TransactionsTotalsContainer">
//                     <div className="TransactionBox">
//                         <h3>Total Expenses</h3>
//                         <div>
//                             <p id='TotalExpenses'>
//                                 $0
//                             </p>
//                         </div>
//                     </div>
//                     <div className="TransactionBox">
//                         <h3>Total Income</h3>
//                         <div>
//                             <p id='TotalIncome'>
//                                 $0
//                             </p>
//                         </div>
//                     </div>
//                     <div className="TransactionBox">
//                         <h3>Balance</h3>
//                         <div>
//                             <p id='Balance'>
//                                 $0
//                             </p>
//                         </div> {/* Replace this with your dynamic data */}
//                     </div>
//                 </div>

//                 <div>
//                     Select Currency
//                     <select>
//                         <option value='USD'>USD</option>
//                         <option value='Euro'>Euro</option>
//                         <option value='Pound'>Pound</option>
//                         <option value='Yen'>Yen</option>
//                     </select>
//                 </div>
//             </div>
//         )
//     }

// }

// export default TransactionsComponent;

import React from 'react';
import Chart from 'chart.js/auto';
import './App.css';

class TransactionsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
        this.chart = null; // Store reference to the chart instance
    }

    componentDidMount() {
        this.buildChart();
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.destroy(); // Destroy the chart instance when the component unmounts
        }
    }

    buildChart() {
        const ctx = this.chartRef.current.getContext('2d');
        if (this.chart) {
            this.chart.destroy(); // Destroy previous chart instance if exists
        }
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [
                    {
                        label: 'Income',
                        data: [10, 15, 20, 25, 30, 35, 40], // Example data for income
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                        fill: false
                    },
                    {
                        label: 'Expenses',
                        data: [5, 10, 15, 20, 25, 30, 35], // Example data for expenses
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        fill: false
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
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
        return (
            <div>
                <h3>Transactions</h3>
                <div>
                    <canvas ref={this.chartRef} width='400' height='200'></canvas>
                </div>

                <div className="TransactionsTotalsContainer">
                    <div className="TransactionBox">
                        <h3>Total Expenses</h3>
                        <div>
                            <p id='TotalExpenses'>
                                $0
                            </p>
                        </div>
                    </div>
                    <div className="TransactionBox">
                        <h3>Total Income</h3>
                        <div>
                            <p id='TotalIncome'>
                                $0
                            </p>
                        </div>
                    </div>
                    <div className="TransactionBox">
                        <h3>Balance</h3>
                        <div>
                            <p id='Balance'>
                                $0
                            </p>
                        </div> {/* Replace this with your dynamic data */}
                    </div>
                </div>

                <div>
                    Select Currency
                    <select>
                        <option value='USD'>USD</option>
                        <option value='Euro'>Euro</option>
                        <option value='Pound'>Pound</option>
                        <option value='Yen'>Yen</option>
                    </select>
                </div>
            </div>
        )
    }
}

export default TransactionsComponent;
