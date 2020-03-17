import { getApplicationSchema, saveValues as save } from './api';
import { ACTION_TYPES } from './constants';
import config from './config.json';

export const getEmailSchema = ({ application, apiVersion, resourceType = 'email-preference', schema }) => ({
    type: ACTION_TYPES.GET_EMAIL_SCHEMA,
    payload: schema || getApplicationSchema(application, apiVersion, resourceType),
    meta: {
        appName: application,
        notifications: {
            rejected: {
                variant: 'danger',
                title: 'Request for user user\'s configuration failed',
                description: `User's configuration email for ${config['email-preference']?.[application]?.title} application does not exist.`
            }
        }
    }
});

export const saveEmailValues = ({ application, values, apiVersion, resourceType = 'email-preference' }) => ({
    type: ACTION_TYPES.SAVE_EMAIL_SCHEMA,
    payload: save(application, values, apiVersion, resourceType),
    meta: {
        notifications: {
            fulfilled: {
                variant: 'success',
                title: 'User\'s configuration for email saved',
                // eslint-disable-next-line max-len
                description: `User's configuration email for ${config['email-preference']?.[application]?.title} application were replaced with new values.`
            }
        },
        appName: application
    }
});
