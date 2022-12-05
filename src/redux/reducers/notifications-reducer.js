import {
  GET_NOTIFICATION_SCHEMA,
  GET_NOTIFICATION_SCHEMAS,
} from '../action-types';

export const notificationsInitialState = {};

export const setLoadingState = (store, { meta }) => {
  return {
    ...store,
    bundleName: meta.bundleName,
    schema: {},
    loaded: false,
  };
};

export const setSchemas = (store, { payload }) => ({
  ...store,
  bundles: payload,
});

export const setSchema = (store, { payload, meta }) => {
  return {
    ...store,
    bundleName: meta.bundleName,
    schema: payload || {},
    loaded: true,
  };
};

export default {
  [GET_NOTIFICATION_SCHEMAS]: setSchemas,
  [GET_NOTIFICATION_SCHEMA]: setSchema,
  [`${GET_NOTIFICATION_SCHEMA}_FULFILLED`]: setSchema,
  [`${GET_NOTIFICATION_SCHEMA}_PENDING`]: setLoadingState,
  [`${GET_NOTIFICATION_SCHEMA}_REJECTED`]: (state, { payload, ...action }) =>
    setSchema(state, action),
};
