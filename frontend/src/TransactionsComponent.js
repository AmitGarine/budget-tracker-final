import React from 'react';
import './App.css';

class TransactionsComponent extends React.Component {
    render() {
        return (
            <div>
                <h3>Transactions</h3>
                <div>
                    {/* Chart */}

                </div>

                <div>
                    <p>Total Expenses</p>
                    <p>X</p>
                </div>
                <div>
                    <p>Total Income</p>
                    <p>X</p>
                </div>
                <div>
                    <p>Balance</p>
                    <p>X</p>
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