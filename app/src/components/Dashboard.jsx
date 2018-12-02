import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItems from './ListItems';
import DatePicker from './DatePicker';
import Button from '@material-ui/core/Button';
import Alert from './Alert';
import Visits from './Visits';
import Mobile from './Mobile';
import Countries from './Countries';
import Cities from './Cities';
import Loader from './Loader';

import Config from '../Config';

const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartTitle: {
    marginTop: 20,
    marginBottom: 30,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  datepickerButton: {
    margin: theme.spacing.unit
  }
});

class Dashboard extends React.Component {
  
  state = {
    openDrawer: true,
    datepicker: {
      start: '',
      end: '',
      reset: false
    },
    fetchingVisits: false,
    sites: '',
    selectedSite: '',
    selectedCategory: {
      index: '',
      category: ''
    },
    visits: '',
    error: ''
  };

  async componentWillMount() {
    const { api } = Config;
    const { token, onLogout } = this.props;

    try {
      // Fetch user sites
      const res = await fetch(`${api}/user/sites`, { 
        method: 'GET', 
        headers: { 'x-access-token': token }
      });

      // If authentication fails
      if (res.status === 401 || res.status === 403) {
        // Log user out
        onLogout();
      }

      const sites = await res.json();
      this.setState({ sites });
    }
    catch(err) {
      console.error('Unexpected error when trying to retrieve user sites', err);
    }
  }

  // Handle dashboard drawer opening 
  handleDrawerOpen() {
    this.setState({ openDrawer: true });
  }

  // Handle dashboard drawer closing 
  handleDrawerClose() {
    this.setState({ openDrawer: false });
  }

  // Handle dashboard item click
  handleDashboardClick() {
    // Reset values
    this.setState({ 
      visits: '', 
      datepicker: {
        start: '',
        end: '',
        reset: true
      } 
    });
  }

  // Handle datepicker changes
  handleDatepickerChange(start, end) {
    const newDatepicker = { ...this.state.datepicker };

    // Set datepicker start date
    if (start) 
      newDatepicker.start = start
      
    // Set datepicker end date
    if (end)
      newDatepicker.end = end

    this.setState({ datepicker: newDatepicker });
  }

  // Handle datepicker removal
  handleDatepickerRemove() {
    // Reset datepicker state before removing component (this will allow component to reload)
    const newDatepicker = { ...this.state.datepicker };
    
    newDatepicker.reset = false;

    this.setState({ datepicker: newDatepicker });
  }

  // Filter visits
  filterVisits(visits) {
    const bots = ['google', 'Google', 'bing', 'Bing', 'tracemyfile', 'Pinterest', 'robot'];

    // Parts of ISP / corporations IPs (Microsoft, Facebook, Google, ...)
    const blacklistedIps = ['40.77.', '52.162.', '23.101.', '66.249.', '66.249.', '144.217.', '52.12.', '34.220.', '54.244.', '72.14.', '66.620.', '173.252.'];
    
    const filteredVisits = visits.filter(visit => {
      // Remove crawling bots visits
      const isBot = bots.some(bot => visit.user_agent.indexOf(bot) !== -1);

      // Remove blacklisted IPs
      const isBlacklisted = blacklistedIps.some(ip => visit.ip.includes(ip));
      
      // Remove visits coming from undefind countries
      const undefinedCountry = visit.country === 'N/A';

      return !isBot && !isBlacklisted && !undefinedCountry;
    });

    return filteredVisits;
  }

  // Handle datepicker submit
  async handleDatepickerSubmit() {
    const { api } = Config;

    const { token, onLogout } = this.props;

    const { selectedSite } = this.state;

    const datepicker = { ...this.state.datepicker };
    const selectedCategory = { ...this.state.selectedCategory };

        
    // Check that dates are filled and valid
    const { start, end } = datepicker;

    if ((start !== '' && start !== 'Invalid date') && (end !== '' && end !== 'Invalid date')) {

      this.setState({ fetchingVisits: true });

      // Send request to retrieve selected site visits
      const res = await fetch(`${api}/visits/${selectedSite._id}/?from=${start}&to=${end}`, { 
        method: 'GET', 
        headers: { 'x-access-token': token }
      });

      this.setState({ fetchingVisits: false });

      // If authentication fails
      if (res.status === 401 || res.status === 403) {
        // Log user out
        onLogout();
      }

      // Retrieve visits
      const visits = await res.json();

      // Filter visits
      const filteredVisits = this.filterVisits(visits);

      this.setState({ 
        visits: filteredVisits,
        selectedCategory: {
          // Set default index if empty
          index: selectedCategory.index === '' ? 0 : selectedCategory.index,
          // Set default category if empty
          category: selectedCategory.category === '' ? 'visits' : selectedCategory.category
        }
      });
    } 
    // If dates are not valid, display error message
    else {
      this.setState({ error: 'Dates invalides' }, () => {
        // Clear error message after 3000 ms
        setTimeout(() => this.setState({ error: '' }), 3000);
      });
    }
  }

  // Handle user site click
  handleSiteClick(site) {
    this.setState({ selectedSite: site });
  }

  // Handle category click
  handleCategoryClick(selectedCategory) {
    this.setState({ selectedCategory });
  }

  render() {
    const { classes, onLogout } = this.props;

    const { openDrawer, fetchingVisits, sites, visits, datepicker, error } = this.state;
    
    const selectedCategory = { ...this.state.selectedCategory };

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, openDrawer && classes.appBarShift)}
        >
          <Toolbar disableGutters={!openDrawer} className={classes.toolbar}>
            {
              error &&
                <div id="dashboard-error-alert">
                  <Alert 
                    error={error}
                    onErrorClose={() => this.setState({ error: '' })}
                  />
                </div>
            }
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={() => this.handleDrawerOpen()}
              className={classNames(
                classes.menuButton,
                openDrawer && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Tableau de bord
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={() => onLogout()}
            >
              <ExitToAppIcon fontSize="large"/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !openDrawer && classes.drawerPaperClose),
          }}
          open={openDrawer}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={() => this.handleDrawerClose()}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItems 
              openDrawer={openDrawer}
              sites={sites}
              selectedCategory={selectedCategory}
              visits={visits}
              onSiteClick={(selectedSite) => this.handleSiteClick(selectedSite)}
              onDashboardClick={() => this.handleDashboardClick()}
              onCategoryClick={(selectedCategory) => this.handleCategoryClick(selectedCategory)}
            />
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <div id="datepicker-wrapper">
            <div id="datepicker">
            {
              !datepicker.reset && 
                <React.Fragment>
                  <DatePicker
                    label="Date de début"
                    onChange={(event) => this.handleDatepickerChange(event, null)}
                    onRemove={() => this.handleDatepickerRemove()}
                  />
                  <DatePicker
                    label="Date de fin"
                    onChange={(event) => this.handleDatepickerChange(null, event)}
                    onRemove={() => this.handleDatepickerRemove()}
                  />
                  <div id="datepicker-submit">
                    {
                      fetchingVisits
                        ?
                          <Loader />
                        :
                          <Button 
                              variant="contained" 
                              color="primary" 
                              className={classes.datepickerButton}
                              onClick={() => this.handleDatepickerSubmit()}
                            >
                            Valider
                          </Button>
                    }
                  </div>
                </React.Fragment>
            }
            </div>
          </div>
          {
            visits !== '' && selectedCategory.category === 'visits' &&
              <React.Fragment>
                <Typography variant="h4" gutterBottom component="h2" className={classes.chartTitle}>
                  Visites
                </Typography>
                <Visits visits={visits} />
              </React.Fragment>
          }
          {
            visits !== '' && selectedCategory.category === 'mobile' &&
              <React.Fragment>
                <Typography variant="h4" gutterBottom component="h2" className={classes.chartTitle}>
                  Mobile
                </Typography>
                <Mobile visits={visits} />
              </React.Fragment>
          }
          {
            visits !== '' && selectedCategory.category === 'countries' &&
              <React.Fragment>
                <Typography variant="h4" gutterBottom component="h2" className={classes.chartTitle}>
                  Pays
                </Typography>
                <Countries visits={visits} />
              </React.Fragment>
          }
          {
            visits !== '' && selectedCategory.category === 'cities' &&
              <React.Fragment>
                <Typography variant="h4" gutterBottom component="h2" className={classes.chartTitle}>
                  Villes
                </Typography>
                <Cities visits={visits} />
              </React.Fragment>
          }
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);