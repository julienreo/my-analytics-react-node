import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Alert from './Alert';
import Loader from './Loader';

import Config from '../Config';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class SignIn extends Component {

  state = {
    authenticating: false,
    error: ''
  };

  // Handle login page form submit 
  async handleSubmit(email, password) {
    const { api } = Config;
    const { onAuthenticate } = this.props;

    // Handle user authentication
    this.setState({ authenticating: true });

    try {
      const res = await fetch(`${api}/user/login`, { 
        method: 'POST', 
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      this.setState({ authenticating: false });

      // If authentication succeeds
      if (res.status === 200) {

        // Retrieve and save token
        const auth = await res.json();
        onAuthenticate(auth.token);
      } 
      // Display corresponding error message
      else {
        const error = await res.json();
        this.setState({ error: error.message });
      }
    }
    catch(err) {
      console.error('Unexpected error when trying to authenticate user', err);
    }
  }

  render() {
    const { classes } = this.props;
    const { error, authenticating } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Connexion
          </Typography>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Mot de passe</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" />
            </FormControl>
            {
              error &&
                <div id="auth-error-alert">
                  <Alert 
                    error={error}
                    onErrorClose={() => this.setState({ error: '' })}
                  />
                </div>
            }
            {
              authenticating
                ? 
                  <Loader />
                :
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => this.handleSubmit(
                      document.getElementById('email').value,
                      document.getElementById('password').value
                    )}
                  >
                    Connexion
                  </Button>
            }
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);