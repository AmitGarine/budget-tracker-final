import React from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 
import RefreshContext from './RefreshContext';


class UserActionsComponent extends React.Component {
    static contextType = AuthContext; 

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
        axios.post('http://localhost:3002/api/v1/register', { username, password })
            .then(response => {
                // Assuming the backend returns userId and possibly a token
                this.context.login(response.data.userId, response.data.token); 
                this.setState({
                    isLoggedIn: true,
                    message: 'Signup successful! Welcome ' + username
                });
            })
            .catch(error => {
                this.setState({ message: 'Error signing up: ' + error.message });
                console.error('Error signing up:', error);
            });
    }

    handleLogin = () => {
        const { username, password } = this.state;
        axios.post('http://localhost:3002/api/v1/login', { username, password })
            .then(response => {
                this.context.login(response.data.userId, response.data.token); // Set user context
                this.setState({
                    isLoggedIn: true,
                    message: 'Login successful! Welcome ' + username
                });
                this.triggerGlobalRefresh(); // Trigger a refresh after login
            })
            .catch(error => {
                this.setState({ message: 'Error logging in: ' + error.message });
                console.error('Error logging in:', error);
            });
    }
    
    handleLogout = () => {
        this.context.logout(); // Reset user context
        this.setState({
            isLoggedIn: false,
            username: '',
            password: '',
            message: 'Logged out successfully.'
        });
        this.triggerGlobalRefresh(); // Trigger a refresh after logout
    }
    
    triggerGlobalRefresh = () => {
        // Access the triggerRefresh function from RefreshContext
        if (this.props.refreshContext) {
            this.props.refreshContext.triggerRefresh();
        }
    }

    render() {
        const { username, password, message } = this.state;
        return (
            <div>
                <p>Welcome, {this.state.isLoggedIn ? username : 'Guest'}</p>
                {message && <p>{message}</p>}
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