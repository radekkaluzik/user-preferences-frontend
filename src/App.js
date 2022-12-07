import React, { Fragment, useEffect } from 'react';
import { Routes } from './Routes';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';

const App = (props) => {
  useEffect(() => {
    (async () => {
      const user = await insights.chrome.auth.getUser();
      if (!user) {
        location.href = './';
      }
    })();
  }, []);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routes childProps={props} />
    </Fragment>
  );
};

export default App;
