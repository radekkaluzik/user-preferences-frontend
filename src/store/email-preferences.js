import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { ACTION_TYPES } from '../constants';

const defaultState = {};

export const loading = (store, { meta }) => {
  return {
    ...store,
    [meta.appName]: {
      schema: [],
      loaded: false,
    },
  };
};

export const getSchema = (store, { payload, meta }) => {
  return {
    ...store,
    [meta.appName]: {
      schema: payload || [],
      loaded: true,
    },
  };
};

export default {
  emailPreferences: applyReducerHash(
    {
      [ACTION_TYPES.GET_EMAIL_SCHEMA]: getSchema,
      [`${ACTION_TYPES.GET_EMAIL_SCHEMA}_FULFILLED`]: getSchema,
      [`${ACTION_TYPES.GET_EMAIL_SCHEMA}_PENDING`]: loading,
      // eslint-disable-next-line no-unused-vars
      [`${ACTION_TYPES.GET_EMAIL_SCHEMA}_REJECTED`]: (
        state,
        { payload, ...action }
      ) => getSchema(state, action),
    },
    defaultState
  ),
};
