import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';
import PortalNav from './SmartComponents/ServicePortal/PortalNav';
import { Main } from '@red-hat-insights/insights-frontend-components';
import { NotificationsPortal } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { Grid, GridItem } from '@patternfly/react-core';
import { MIN_SCREEN_HEIGHT } from './constants/ui-constants';
import '@red-hat-insights/insights-frontend-components/components/Notifications.css';

import 'whatwg-fetch';
import { AppPlaceholder } from './PresentationalComponents/Shared/LoaderPlaceholders';

class App extends Component {
  state = {
    chromeNavAvailable: true,
    auth: false
  }

  componentDidMount () {
    insights.chrome.init();
    insights.chrome.auth.getUser().then(() => this.setState({ auth: true }));
    try {
      insights.chrome.identifyApp('service-portal');
    } catch (error) {
      this.setState({
        chromeNavAvailable: false
      });
    }
  }

  componentWillUnmount () {
    if (this.state.chromeNavAvailable) {
      this.appNav();
      this.buildNav();
    }
  }

  render () {
    const { auth } = this.state;
    if (!auth) {
      return <AppPlaceholder />;
    }

    return (
      <React.Fragment>
        <NotificationsPortal />
        <Main style={ { marginLeft: 0, padding: 0 } }>
          <Grid style={ { minHeight: MIN_SCREEN_HEIGHT } }>
            <GridItem style={ { backgroundColor: '#FFFFFF' } } sm={ 4 } md={ 4 } lg={ 2 } xl={ 2 }>
              <PortalNav />
            </GridItem >
            <GridItem sm={ 8 } md={ 8 } lg={ 10 } xl={ 10 }>
              <Routes childProps={ this.props } />
            </GridItem>
          </Grid>
        </Main>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  history: PropTypes.object
};

export default withRouter (connect()(App));
