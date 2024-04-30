import React from 'react';

// Creating a context with a default value
const RefreshContext = React.createContext({
  refreshKey: 0,
  triggerRefresh: () => {}  // This function will be overridden by the provider
});

export default RefreshContext;
