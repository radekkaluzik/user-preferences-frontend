import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import { register } from './store';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';
import './App.scss';

const App = (props) => {
    const history = useHistory();
    useEffect(() => {
        (async () => {
            const user = await insights.chrome.auth.getUser();
            if (!user) {
                location.href = './';
            }
        })();

        register({ notifications });
        insights.chrome.init();
        insights.chrome.identifyApp('user-preferences');

        const appNav = insights.chrome.on('APP_NAVIGATION', event => history.push(`/${event.navId}`));
        return () => appNav();
    }, []);

    return (
        <Fragment>
            <NotificationsPortal />
            <Routes childProps={ props } />
        </Fragment>
    );
};

export default App;
