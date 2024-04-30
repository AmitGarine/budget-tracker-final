import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RefreshContext from './RefreshContext';

import UserActionsComponent from './UserActionsComponent';
import TransactionsComponent from './TransactionsComponent';
import ExpensesComponent from './ExpensesComponent';
import IncomeComponent from './IncomeComponent';
import FinancialRecordsComponent from './FinancialRecordsComponent';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger a global refresh across components that need re-fetching data
  const triggerRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);  // Increment key to force remount/re-fetch
  };

  return (
    <Router>
      <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
        <div className="App">
          <header className="AppHeader">
            <h1>Weekly Budget Tracker</h1>
            <nav>
              <Link to="/">Home</Link> | <Link to="/records">Financial Records</Link>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={
              <div className="BudgetTrackerContainer">
                <div className='HorizontalStack'>
                  <div className='ComponentBox UserActionsComponent'>
                    <UserActionsComponent />
                  </div>
                  <div className='ComponentBox TransactionsComponent'>
                    <TransactionsComponent key={refreshKey} />
                  </div>
                </div>
                <div className='VerticalStack'>
                  <div className='ComponentBox ExpensesComponent'>
                    <ExpensesComponent />
                  </div>
                  <div className='ComponentBox IncomeComponent'>
                    <IncomeComponent />
                  </div>
                </div>
              </div>
            } />
            <Route path="/records" element={<FinancialRecordsComponent />} />
          </Routes>
        </div>
      </RefreshContext.Provider>
    </Router>
  );
}

export default App;
