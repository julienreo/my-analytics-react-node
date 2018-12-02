import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

class DatePicker extends Component {

  componentWillUnmount() {
    // Reset datepicker state before removing component
    this.props.onRemove();
  }

  render() {
    const { classes, label, onChange } = this.props;
    
    return (
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label={label}
          type="date"
          className={classes.textField}
          format='MMM DD, YYYY hh:mm A'
          InputLabelProps={{ shrink: true }}
          onChange={(event) => onChange(
            // format date
            moment(event.target.value).format('YYYY-MM-DD')
          )}
        />
      </form>
    );
  }
}

DatePicker.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePicker);