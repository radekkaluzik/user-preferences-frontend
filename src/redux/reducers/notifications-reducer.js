import { GET_NOTIFICATIONS_SCHEMA } from '../action-types';

export const notificationsInitialState = {};

export const setLoadingState = (store) => {
  return {
    ...store,
    loaded: false,
  };
};

export const setSchema = (store, { payload, meta }) => ({
  ...store,
  bundles: payload?.bundles || {},
  meta,
  loaded: true,
});

export default {
  [GET_NOTIFICATIONS_SCHEMA]: setSchema,
  [`${GET_NOTIFICATIONS_SCHEMA}_FULFILLED`]: setSchema,
  [`${GET_NOTIFICATIONS_SCHEMA}_PENDING`]: setLoadingState,
  [`${GET_NOTIFICATIONS_SCHEMA}_REJECTED`]: (state, { payload, ...action }) =>
    setSchema(state, action),
};
