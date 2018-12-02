import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  pieContainer: {
    position: 'relative',
    top: '-50px',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    marginTop: 40,
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    }
  }
});

function Countries(props) {
  const { classes, visits } = props;

  // Count visits and unique visits per country
  const visitsPerCountry = {};

  visits.forEach(visit => {
    const { country } = visit;

    if (typeof visitsPerCountry[country] === 'undefined') {
      visitsPerCountry[country] = { 
        visits: 1, 
        uniqueIps: [visit.ip]
      };
    } else {
      visitsPerCountry[country].visits = visitsPerCountry[country].visits + 1;
      
      // If visit is unique, append its IP to `uniqueIps`
      if (!visitsPerCountry[country].uniqueIps.includes(visit.ip)) {
        visitsPerCountry[country].uniqueIps.push(visit.ip);
      }
    }
  });


  // Format visits to match table specs
  const tableVisits = [];

  let id = 0;
  for (const country in visitsPerCountry) {
    tableVisits.push({
      id,
      name:country,
      visits: visitsPerCountry[country].visits,
      uniqueVisits: visitsPerCountry[country].uniqueIps.length
    });
    id += 1;
  }


  // Sort by visits
  tableVisits.sort((a, b) => {
    if (a.visits > b.visits)
      return -1;
    if (a.visits < b.visits)
      return 1;
    return 0;
  });

  return(
    <Paper className={classes.tableWrapper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Pays</TableCell>
            <TableCell>Visites </TableCell>
            <TableCell>Visites uniques</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableVisits.map(n => {
            return (
              <TableRow className={classes.row} key={n.id}>
                <TableCell component="th" scope="row">{n.name}</TableCell>
                <TableCell>{n.visits}</TableCell>
                <TableCell>{n.uniqueVisits}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

Countries.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Countries);