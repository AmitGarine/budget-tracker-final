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

                <div className="TransactionsTotalsContainer">
                    <div className="Box">
                        <h3>Total Expenses</h3>
                        <div>$1000</div> {/* Replace this with your dynamic data */}
                    </div>
                    <div className="Box">
                        <h3>Total Income</h3>
                        <div>$2000</div> {/* Replace this with your dynamic data */}
                    </div>
                    <div className="Box">
                        <h3>Balance</h3>
                        <div>$1000</div> {/* Replace this with your dynamic data */}
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