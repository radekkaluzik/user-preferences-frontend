import { GET_EMAIL_SCHEMA } from '../action-types';
import config from '../../config/config.json';

export const emailInitialState = Object.keys(config['email-preference']).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: { loaded: false },
  }),
  {}
);

export const setLoadingState = (store, { meta }) => {
  return {
    ...store,
    [meta.appName]: {
      schema: [],
      loaded: false,
    },
  };
};

export const setSchema = (store, { payload, meta }) => {
  return {
    ...store,
    [meta.appName]: {
      schema: payload || [],
      loaded: true,
    },
  };
};

export default {
  [GET_EMAIL_SCHEMA]: setSchema,
  [`${GET_EMAIL_SCHEMA}_FULFILLED`]: setSchema,
  [`${GET_EMAIL_SCHEMA}_PENDING`]: setLoadingState,
  [`${GET_EMAIL_SCHEMA}_REJECTED`]: (state, { payload, ...action }) =>
    setSchema(state, action),
};
