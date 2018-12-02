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

function Cities(props) {
  const { classes, visits } = props;

  // Count visits and unique visits per city
  const visitsPerCity = {};

  visits.forEach(visit => {
    const { city } = visit;

    if (typeof visitsPerCity[city] === 'undefined') {
      visitsPerCity[city] = { 
        visits: 1, 
        uniqueIps: [visit.ip],
        country: visit.country
      };
    } else {
      visitsPerCity[city].visits = visitsPerCity[city].visits + 1;
      
      // If visit is unique, append its IP to `uniqueIps`
      if (!visitsPerCity[city].uniqueIps.includes(visit.ip)) {
        visitsPerCity[city].uniqueIps.push(visit.ip);
      }
    }
  });

  
  // Format visits to match table specs (and have country displayed with city)
  const tableVisits = [];
  
  let id = 0;
  for (const city in visitsPerCity) {
    tableVisits.push({
      id,
      name: `${city} (${visitsPerCity[city].country})`,
      visits: visitsPerCity[city].visits,
      uniqueVisits: visitsPerCity[city].uniqueIps.length
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
            <TableCell>Villes</TableCell>
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

Cities.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cities);