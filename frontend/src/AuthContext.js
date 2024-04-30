import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        user: null,
        userId: null,
        token: null
    });

    const login = (userId, token) => {
        console.log("Logging in", userId);  // Log to verify this is being called

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

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);