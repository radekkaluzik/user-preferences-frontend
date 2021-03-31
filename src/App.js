import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import { register } from './store';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';
import config from './config/config.json';

const App = (props) => {
  const history = useHistory();
  useEffect(() => {
    (async () => {
      const user = await insights.chrome.auth.getUser();
      if (!user) {
        location.href = './';
      }
    })();

    register({ notifications: notificationsReducer });
    insights.chrome.init();
    insights.chrome.identifyApp('email');

    const appNav = insights.chrome.on('APP_NAVIGATION', (event) => {
      const subNavItems = Object.keys(config?.['notification-preference']);
      history.push(
        `${subNavItems.includes(event.navId) ? '/notifications' : ''}/${
          event.navId
        }`
      );
    });
    return () => appNav();
  }, []);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routes childProps={props} />
    </Fragment>
  );
};

export default App;
