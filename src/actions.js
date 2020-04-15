import { getApplicationSchema, saveValues as save } from './api';
import { ACTION_TYPES } from './constants';

export const getEmailSchema = ({ application, apiVersion, resourceType = 'email-preference', schema, url }) => ({
    type: ACTION_TYPES.GET_EMAIL_SCHEMA,
    payload: schema || getApplicationSchema(application, apiVersion, resourceType, url),
    meta: {
        appName: application
    }
});

export const saveEmailValues = ({ application, values, apiVersion, resourceType = 'email-preference', url, title }) => ({
    type: ACTION_TYPES.SAVE_EMAIL_SCHEMA,
    payload: save(application, values, apiVersion, resourceType, url).then(data => ({ ...data, application, title })),
    meta: {
        appName: application
    }
});
