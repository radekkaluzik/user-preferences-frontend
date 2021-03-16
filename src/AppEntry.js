import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import PropTypes from 'prop-types';

const UserReferences = ({ logger }) => (
  <Provider store={init(logger).getStore()}>
    <Router basename={getBaseName(window.location.pathname, 1)}>
      <App />
    </Router>
  </Provider>
);

UserReferences.propTypes = {
  logger: PropTypes.func,
};

export default UserReferences;
