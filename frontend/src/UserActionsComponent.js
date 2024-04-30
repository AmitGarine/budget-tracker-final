import React from 'react';
import axios from 'axios';
import { AppContext } from './AppContext';
import './App.css';

class UserActionsComponent extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false,
            message: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSignup = () => {
        const { username, password } = this.state;
        console.log('Username:', username);
        console.log('Password:', password);
        axios.post('http://localhost:3002/api/v1/register', { username, password })
            .then(response => {
                this.context.login(response.data.userId);
                this.setState({
                    isLoggedIn: true,
                    message: 'Signup successful! Welcome ' + username
                });
            })
            .catch(error => {
                this.setState({ message: 'Username already taken' });
            });
    }

    handleLogin = () => {
        const { username, password } = this.state;
        axios.post('http://localhost:3002/api/v1/login', { username, password })
            .then(response => {
                this.context.login(response.data.userId, response.data.token);
                this.setState({
                    isLoggedIn: true,
                    message: 'Login successful! Welcome ' + username
                });
                this.context.triggerRefresh();
            })
            .catch(error => {
                if (error.response) {
                    this.setState({ message: 'Invalid username/password', username: '', password: '' });
                }
            });
    };

    handleLogout = () => {
        this.context.logout();
        this.setState({
            isLoggedIn: false,
            username: '',
            password: '',
            message: 'Logged out successfully.'
        });
        this.context.triggerRefresh();
    };

    render() {
        const { username, password, message } = this.state;
        return (
            <div className="user-actions">
                <p>Welcome, {this.state.isLoggedIn ? username : 'Guest'}</p>
                {message && <p className="error-message">{message}</p>}
                {!this.state.isLoggedIn ? (
                    <div>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={this.handleInputChange}
                            placeholder="Username"
                        />
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={this.handleInputChange}
                            placeholder="Password"
                        />
                        <button onClick={this.handleLogin}>Log In</button>
                        <button onClick={this.handleSignup}>Sign Up</button>
                    </div>
                ) : (
                    <button onClick={this.handleLogout}>Log Out</button>
                )}
            </div>
        );
    }
}

export default UserActionsComponent;