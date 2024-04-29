// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import './App.css';
import React from 'react';

import UserActionsComponent from './UserActionsComponent';
import TransactionsComponent from './TransactionsComponent';
import ExpensesComponent from './ExpensesComponent';
import IncomeComponent from './IncomeComponent';

function App() {
  return (
    <div className="App">
      <header className="AppHeader">
        <h1>Budget Tracker</h1>
      </header>

      <div className="BudgetTrackerContainer">
        <div className='HorizontalStack'>
          <UserActionsComponent />
          <TransactionsComponent />
        </div>
        <div className='VerticalStack'>
          <ExpensesComponent />
          <IncomeComponent />
        </div>
      </div>

    </div>
  );
}

export default App;

