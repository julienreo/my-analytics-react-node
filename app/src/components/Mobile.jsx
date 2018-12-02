import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PieChart from 'recharts/lib/chart/PieChart';
import Pie from 'recharts/lib/polar/Pie';
import Cell from 'recharts/lib/component/Cell';
import Typography from '@material-ui/core/Typography';
import Legend from 'recharts/lib/component/Legend';
import Tooltip from 'recharts/lib/component/Tooltip';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  pieContainer: {
    position: 'relative',
    top: '-40px',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
    marginBottom: '40px'
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

function Mobile(props) {
  const { classes, visits, onPieEnter } = props;

  // Count visits and unique visits per device (desktop or mobile)
  const visitsDistribution = {
    mobile: {
      visits: 0,
      uniqueIps: []
    },
    desktop: {
      visits: 0,
      uniqueIps: []
    }
  };

  visits.forEach(visit => {
    const { is_mobile: isMobile } = visit;
    const { ip } = visit;

    if (isMobile === true) {
      visitsDistribution.mobile.visits += 1;

      // If visit is unique, append its IP to `uniqueIps`
      if (!visitsDistribution.mobile.uniqueIps.includes(ip)) {
        visitsDistribution.mobile.uniqueIps.push(ip);
      }
    } else {
      visitsDistribution.desktop.visits += 1;

      // If visit is unique, append its IP to `uniqueIps`
      if (!visitsDistribution.desktop.uniqueIps.includes(ip)) {
        visitsDistribution.desktop.uniqueIps.push(ip);
      }
    }
  });


  // Chart config
  const desktopVisits = visitsDistribution.desktop.visits;
  const mobileVisits = visitsDistribution.mobile.visits;

  const desktopUniqueVisits = visitsDistribution.desktop.uniqueIps.length;
  const mobileUniqueVisits = visitsDistribution.mobile.uniqueIps.length;

  const COLORS = ['#82ca9d', '#8884d8'];
  
  const RADIAN = Math.PI / 180; 
            
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65;
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);
   
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const totalVisits = [
    {name: 'Ordinateur', value: desktopVisits}, 
    {name: 'Mobile', value: mobileVisits}
  ];

  const totalUniqueVisits = [
    {name: 'Ordinateur', value: desktopUniqueVisits}, 
    {name: 'Mobile', value: mobileUniqueVisits}
  ];

  return(
    <React.Fragment>
      <Typography component="div" className={classes.pieContainer}>
        <PieChart width={800} height={400} onMouseEnter={onPieEnter}>
          <Pie
            data={totalVisits}
            dataKey="value"
            cx={300} 
            cy={200} 
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140} 
            fill="#8884d8"
            legendType="circle"
          >
            {
              totalVisits.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)
            }
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Typography>
      <Paper className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Total des visites depuis un ordinateur</TableCell>
              <TableCell>Total des visites depuis un mobile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell>{desktopVisits}</TableCell>
              <TableCell>{mobileVisits}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Typography component="div" className={classes.pieContainer}>
        <PieChart width={800} height={400} onMouseEnter={onPieEnter}>
          <Pie
            data={totalUniqueVisits}
            dataKey="value"
            cx={300} 
            cy={200} 
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={140} 
            fill="#8884d8"
            legendType="circle"
          >
            {
              totalUniqueVisits.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index} />)
            }
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Typography>
      <Paper className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Total des visites uniques depuis un ordinateur</TableCell>
              <TableCell>Total des visites uniques depuis un mobile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.row}>
              <TableCell>{desktopUniqueVisits}</TableCell>
              <TableCell>{mobileUniqueVisits}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
}

Mobile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Mobile);