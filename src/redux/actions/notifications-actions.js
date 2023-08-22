import {
  getNotificationsSchema as getSchema,
  saveValues as save,
} from '../../api';
import { ACTION_TYPES } from '../action-types';

export const getNotificationsSchema = (props) => ({
  type: ACTION_TYPES.GET_NOTIFICATIONS_SCHEMA,
  payload: getSchema(props),
  meta: {
    notifications: {
      rejected: {
        variant: 'danger',
        title: "Request for user's configuration failed",
        description: `User's configuration notification for this bundle does not exist.`,
      },
    },
  },
});

export const saveNotificationValues = (values, apiVersion) => ({
  type: ACTION_TYPES.SAVE_NOTIFICATION_SCHEMA,
  payload: save(values, apiVersion),
});
