import React, { createContext, useState, useContext } from 'react';

// Creating a combined context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        user: null,
        userId: null,
        token: null
    });

    const [refreshKey, setRefreshKey] = useState(0);  // Manage the refresh key here

    const login = (userId, token) => {
        console.log("Logging in", userId);
        setAuth({
            isLoggedIn: true,
            userId,
            token
        });
    };

    const logout = () => {
        setAuth({
            isLoggedIn: false,
            user: null,
            userId: null,
            token: null
        });
    };

    const triggerRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);  // Increment key to force remount/re-fetch
    };

    // Combine all states and functions into a single context value
    return (
        <AppContext.Provider value={{
            auth,
            login,
            logout,
            refreshKey,
            triggerRefresh
        }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the App context
export const useAppContext = () => useContext(AppContext);