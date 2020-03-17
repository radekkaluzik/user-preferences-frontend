import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { register } from './store';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';
import './App.scss';

class App extends Component {

    componentDidMount () {
        register({ notifications });
        insights.chrome.init();
        insights.chrome.identifyApp('user-preferences');

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => this.props.history.push(`/${event.navId}`));
    }

    componentWillUnmount () {
        this.appNav();
    }

    render () {
        return (
            <Fragment>
                <NotificationsPortal />
                <Routes childProps={ this.props } />
            </Fragment>
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter (connect()(App));
