import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const { logout } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');  
    };

    return (
        <button className='logOutButton' onClick={handleLogout}>Log Out</button>
    );
}

export default LogoutButton;