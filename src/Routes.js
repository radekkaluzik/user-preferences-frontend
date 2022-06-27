import React, { Fragment, Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import pckg from '../package.json';

const Email = lazy(() =>
  import(
    /* webpackChunkName: "Email" */ './PresentationalComponents/Email/Email'
  )
);

const Notification = lazy(() =>
  import(
    /* webpackChunkName: "Notification" */ './PresentationalComponents/Notification/Notification'
  )
);

export const Routes = () => (
  <Suspense fallback={Fragment}>
    <Switch>
      <Route path={pckg.routes.email} component={Email} rootClass="email" />
      <Route
        path={pckg.routes.notification}
        component={Notification}
        rootClass="notification"
      />
      <Redirect path="*" to={pckg.routes.email} push />
    </Switch>
  </Suspense>
);
