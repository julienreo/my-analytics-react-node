import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import WebIcon from '@material-ui/icons/Web';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class ListItems extends Component {

  state = {
    openSites: true,
    selectedSite: {
      index: '',
      site: ''
    },
    selectedCategory: {
      index: '',
      category: ''
    }
  };

  componentWillReceiveProps(nextProps) {
    const { sites, onSiteClick } = this.props;

    const selectedSite ={ ...this.state.selectedSite };
    const selectedCategory = { ...this.state.selectedCategory };

    // Hide user sites in case dashboard drawer is closed
    if (nextProps.openDrawer !== this.props.openDrawer) {
      this.setState({ openSites: nextProps.openDrawer });
    }

    // When component loads for the first time, set user first site as the default one (in case he owns several)
    if (selectedSite.site === '' && nextProps.sites !== sites) {
      this.setState({ 
        selectedSite: { 
          index: 0, 
          site: nextProps.sites[0] 
        } 
      });
      // Let parent component know that selected site has changed
      onSiteClick(nextProps.sites[0]);
    }

    // When component loads for the first time, set `visits` category as the default one
    if (selectedCategory.index === '' && nextProps.selectedCategory.index !== selectedCategory.index) {
      this.setState({ selectedCategory: nextProps.selectedCategory });
    } 
  }

  // Handle click on user sites
  handleSitesClick() {
    // If dashboard drawer is open
    if (this.props.openDrawer) {
      // Display sites
      this.setState(state => ({ openSites: !state.openSites }));
    } 
  }

  // Handle click on user site
  handleSiteClick(index, site) {
    this.setState({ selectedSite: { index, site } });
    this.props.onSiteClick(site);
  }

  // Handle click on a category
  handleCategoryClick(index, category) {
    this.setState({ selectedCategory: { index, category } }, () => {
      this.props.onCategoryClick(this.state.selectedCategory);
    });
  }

  render() {
    const { classes, sites, visits, onDashboardClick } = this.props;

    return(
      <div>
        <ListItem 
          button
          onClick={() => onDashboardClick()}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
        <Divider />
        <ListItem 
          button 
          onClick={() => this.handleSitesClick()}
        >
          <ListItemIcon>
            <WebIcon />
          </ListItemIcon>
          <ListItemText inset primary="Mes sites" />
          {this.state.openSites ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={this.state.openSites} timeout="auto" unmountOnExit>
          {
            sites !== '' && 
              sites.map((site, index) => {
                const { site: siteName} = site;
                return(
                  <List component="div" disablePadding key={index}>
                  <ListItem 
                    button 
                    className={classes.nested} 
                    selected={this.state.selectedSite.index === index}
                    onClick={() => this.handleSiteClick(index, site)}
                  >
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={siteName.replace('http://', '')} />
                  </ListItem>
                </List>
                );
              })
          }
        </Collapse>
        {
          visits &&
            <React.Fragment>
              <Divider />
              <ListItem 
                button
                selected={this.state.selectedCategory.index === 0}
                onClick={() => this.handleCategoryClick(0, 'visits')}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Visites" />
              </ListItem>
              <ListItem 
                button
                selected={this.state.selectedCategory.index === 1}
                onClick={() => this.handleCategoryClick(1, 'mobile')}
              >
                <ListItemIcon>
                  <PhoneAndroidIcon />
                </ListItemIcon>
                <ListItemText primary="Mobile" />
              </ListItem>
              <ListItem 
                button
                selected={this.state.selectedCategory.index === 2}
                onClick={() => this.handleCategoryClick(2, 'countries')}
              >
                <ListItemIcon>
                  <FlightTakeoffIcon />
                </ListItemIcon>
                <ListItemText primary="Pays" />
              </ListItem>
              <ListItem 
                button
                selected={this.state.selectedCategory.index === 3}
                onClick={() => this.handleCategoryClick(3, 'cities')}
              >
                <ListItemIcon>
                  <LocationCityIcon />
                </ListItemIcon>
                <ListItemText primary="Villes" />
              </ListItem>
            </React.Fragment>
        }
      </div>
    );
  }
}

ListItems.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListItems);