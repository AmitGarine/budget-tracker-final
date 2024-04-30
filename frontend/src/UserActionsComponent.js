import React from 'react';
import './App.css'

class UserActionsComponent extends React.Component {
    render() {
        return (
            <div>
                <p>Welcome,</p>
                <h3>USER NAME</h3>

                <div>
                    <button>Log In</button>
                </div>
                
                <div>
                    <button>Sign Up</button>
                </div>

                <div>
                    <button>Log Out</button>
                </div>
            </div>)
    }
}

export default UserActionsComponent;