import { getApplicationSchema, saveValues as save } from '../../api';
import { ACTION_TYPES } from '../action-types';
import { notificationConfigForBundle } from '../../Utilities/functions';

export const getNotificationSchemas = (payload) => ({
  type: ACTION_TYPES.GET_NOTIFICATION_SCHEMAS,
  payload,
});

export const getNotificationSchema = ({ bundleName, apiVersion }) => ({
  type: ACTION_TYPES.GET_NOTIFICATION_SCHEMA,
  payload: getApplicationSchema(
    notificationConfigForBundle(bundleName)?.application,
    apiVersion,
    notificationConfigForBundle(bundleName)?.resourceType
  ),
  meta: {
    bundleName,
    notifications: {
      rejected: {
        variant: 'danger',
        title: "Request for user's configuration failed",
        description: `User's configuration notification for this bundle does not exist.`,
      },
    },
  },
});

export const saveNotificationValues = ({ bundleName, values, apiVersion }) => ({
  type: ACTION_TYPES.SAVE_NOTIFICATION_SCHEMA,
  payload: save(
    notificationConfigForBundle(bundleName)?.application,
    values,
    apiVersion,
    notificationConfigForBundle(bundleName)?.resourceType
  ),
  meta: {
    bundleName: bundleName,
    noError: true,
  },
});
