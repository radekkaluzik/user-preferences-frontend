import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components';
import { getEmailSchema } from '../actions';
import { loaderField } from './constants';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

export const getSchema = (app) => !app || !app.loaded ? loaderField : app.schema;

export const calculatePermissions = (permissions) => Promise.all(
    [ permissions ].flat()
    .map(({ method, args }) => insights.chrome?.visibilityFunctions?.[method]?.(...args || []))
).then((visibility) => visibility.every(Boolean));

export const calculateEmailConfig = (
    { 'email-preference': config } = { 'email-preference': {}},
    dispatch = () => {}
) => Object.entries(config).map(([ key, { permissions, url, localFile, ...rest }]) => {
    const isVisible = permissions ? calculatePermissions(permissions) : true;
    (async () => {
        const schemaVisible = await Promise.resolve(isVisible);
        if (schemaVisible) {
            if (localFile) {
                const newMapper = (await import(`../${localFile}`)).default;
                dispatch(getEmailSchema({ schema: newMapper, application: key }));
            } else {
                dispatch(getEmailSchema({ application: key, url }));
            }
        }
    })();

    return {
        [key]: {
            localFile,
            isVisible,
            url,
            ...rest
        }
    };
}).reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const getSection = (key, schema = {}, storeSchema, success = () => {}) => {
    if (schema.isVisible === true) {
        return {
            label: schema?.title,
            name: key,
            fields: schema?.fields || getSchema(storeSchema)
        };
    } else {
        Promise.resolve(schema.isVisible).then(success);

        return {
            label: <Skeleton />,
            name: key,
            fields: loaderField
        };
    }
};

export const concatApps = (apps) => {
    return apps.reduce((acc, { title }, currentIndex) => (
        `${acc}${title}${
            currentIndex < apps.length - 1 ?
                currentIndex < apps.length - 2 ? ',' : ' and'
                : ''
        } `
    ), '');
};

export const distributeSuccessError = (promisses) =>{
    return Promise.allSettled(promisses).then((apps) => {
        return apps.reduce((acc, { value, reason }) => ({
            ...acc,
            [value ? 'success' : 'error']: [
                ...acc[value ? 'success' : 'error'],
                value || reason
            ]
        }), { success: [], error: []});
    });
};

export const dispatchMessages = (dispatch, success, error = []) => {
    if (error.length !== 0 && success.length !== 0) {
        dispatch(addNotification({
            dismissable: false,
            variant: 'success',
            title: 'Preferences successfully saved',
            description: `User's configuration email for ${concatApps(success)} were successfully saved.`
        }));

        dispatch(addNotification({
            dismissable: false,
            variant: 'danger',
            title: 'Preferences unsuccessfully saved',
            description: `User's configuration email for ${concatApps(error)} were unsuccessfully saved.`
        }));
    }

    if (error.length === 0 && success.length !== 0) {
        dispatch(addNotification({
            dismissable: false,
            variant: 'success',
            title: 'Preferences successfully saved'
        }));
    }

    if (error.length !== 0 && success.length === 0) {
        dispatch(addNotification({
            dismissable: false,
            variant: 'danger',
            title: 'Preferences unsuccessfully saved'
        }));
    }
};
