import './App.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, AppContext } from './AppContext';

import UserActionsComponent from './UserActionsComponent';
import TransactionsComponent from './TransactionsComponent';
import ExpensesComponent from './ExpensesComponent';
import IncomeComponent from './IncomeComponent';
import FinancialRecordsComponent from './FinancialRecordsComponent';

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="App">
          <header className="AppHeader">
            <h1>Budget Tracker</h1>
            <Navigation />
          </header>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/records" element={<FinancialRecordsComponent />} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
}

function HomePage() {
  const { auth, refreshKey } = useContext(AppContext);

  return (
    <div key={refreshKey}>  { }
      {!auth.isLoggedIn ? (
        <UserActionsComponent />
      ) : (
        <div className="BudgetTrackerContainer">
          <div className='HorizontalStack'>
            <div className='TransactionsComponent'>
              <TransactionsComponent />

            </div>
          </div>

          <div className='VerticalStack'>
            <div className='ExpensesComponent'>
              <ExpensesComponent />
            </div>
            <div className='IncomeComponent'>
              <IncomeComponent />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Navigation() {
  const { auth } = useContext(AppContext);

  return (
    auth.isLoggedIn && (
      <nav>
        <Link to="/">Home</Link> | <Link to="/records">Financial Records</Link>
      </nav>
    )
  );
}

export default App;