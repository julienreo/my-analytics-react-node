import React, { Component } from 'react';

import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';

class App extends Component {

  state = {
    token: ''
  };

  componentWillMount() {
    // Retrieve `token` from local storage
    const token = localStorage.getItem('token');
    if (token) this.setState({ token });
  }

  // Handle user authentication 
  handleAuthenticate(token) {
    this.setState({ token }, () => {
      // Save token into local storage
      localStorage.setItem('token', token);
    });
  }

  // Handle user logout
  handleLogout() {
    // Remove token from local storage
    localStorage.removeItem('token');
    this.setState({ token: '' });
  }

  render() {
    const { token } = this.state;

    return (
      <React.Fragment>
        {
          token === ''
            ? <SignIn onAuthenticate={(token) => this.handleAuthenticate(token)} />
            : <Dashboard token={token} onLogout={() => this.handleLogout()} />
        }
      </React.Fragment>
    );
  }
}

export default App;
