import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { RegistryContext, registry } from './Utilities/store';

const UserReferences = () => (
  <RegistryContext.Provider
    value={{
      getRegistry: () => registry,
    }}
  >
    <Provider store={registry.getStore()}>
      <App />
    </Provider>
  </RegistryContext.Provider>
);

export default UserReferences;
