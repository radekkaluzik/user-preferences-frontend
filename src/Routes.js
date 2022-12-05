import React, { Fragment, Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import pckg from '../package.json';

const Notifications = lazy(() =>
  import(
    /* webpackChunkName: "Notifications" */ './PresentationalComponents/Notifications/Notifications'
  )
);

export const Routes = () => (
  <Suspense fallback={Fragment}>
    <Switch>
      <Route
        path={pckg.routes.notifications}
        component={Notifications}
        rootClass="notifications"
      />
      <Redirect path="*" to={pckg.routes.notifications} push />
    </Switch>
  </Suspense>
);
