import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ResponsiveContainer from 'recharts/lib/component/ResponsiveContainer';
import LineChart from 'recharts/lib/chart/LineChart';
import Line from 'recharts/lib/cartesian/Line';
import XAxis from 'recharts/lib/cartesian/XAxis';
import YAxis from 'recharts/lib/cartesian/YAxis';
import CartesianGrid from 'recharts/lib/cartesian/CartesianGrid';
import Tooltip from 'recharts/lib/component/Tooltip';
import Legend from 'recharts/lib/component/Legend';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import 'moment/locale/fr';

const styles = theme => ({
  chartContainer: {
    marginTop: 20,
    marginLeft: -22,
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    marginTop: 40,
  },
  tableContainer: {
    marginTop: 40,
    height: 320,
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

function Visits(props) {
  const { classes, visits } = props;

  // Count visits and unique visits per day
  const visitsPerDay = {};

  visits.forEach(visit => {
    // Format date
    const date = moment.utc(visit.created_at).format('YYYY-MM-DD');

    if (typeof visitsPerDay[date] === 'undefined') {
      visitsPerDay[date] = { 
        visits: 1, 
        uniqueIps: [visit.ip] 
      };
    } else {
      visitsPerDay[date].visits = visitsPerDay[date].visits + 1;
      
      // If visit is unique, append its IP to `uniqueIps`
      if (!visitsPerDay[date].uniqueIps.includes(visit.ip)) {
        visitsPerDay[date].uniqueIps.push(visit.ip);
      }
    }

    return visitsPerDay;
  });

  let totalVisits = 0;
  for (const index in visitsPerDay) {
    totalVisits += visitsPerDay[index].visits;
  }

  let totalUniqueVisits = 0;
  for (const index in visitsPerDay) {
    totalUniqueVisits += visitsPerDay[index].uniqueIps.length;
  }


  // Format visits to match chart spec
  const chartVisits = [];

  for (const date in visitsPerDay) {
    chartVisits.push({
      Date: moment.utc(date).locale('fr').format('DD/ MM'),
      Visites: visitsPerDay[date].visits,
      'Visites uniques': visitsPerDay[date].uniqueIps.length
    });
  }


  // Format visits to match table specs
  const tableVisits = [];

  let id = 0;
  for (const date in visitsPerDay) {
    tableVisits.push({
      id,
      name: moment(date).locale('fr').format('DD MMMM YYYY'),
      visits: visitsPerDay[date].visits,
      uniqueVisits: visitsPerDay[date].uniqueIps.length
    });
    id += 1;
  }

  return(
    <React.Fragment>
      <Typography component="div" className={classes.chartContainer}>
        <ResponsiveContainer width="99%" height={320}>
          <LineChart data={chartVisits}>
            <XAxis dataKey="Date" />
            <YAxis />
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Visites" stroke="#82ca9d" activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="Visites uniques" stroke="#8884d8" activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </Typography>
      <Paper className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Total des visites</TableCell>
              <TableCell>Total des visites uniques</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell>{totalVisits}</TableCell>
              <TableCell>{totalUniqueVisits}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Paper className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Jours</TableCell>
              <TableCell numeric>Visites</TableCell>
              <TableCell numeric>Visites uniques</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableVisits.map(n => {
              return (
                <TableRow className={classes.row} key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell numeric>{n.visits}</TableCell>
                  <TableCell numeric>{n.uniqueVisits}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
}

Visits.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Visits);