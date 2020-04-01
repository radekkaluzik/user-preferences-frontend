import React from 'react';
import { Skeleton } from '@redhat-cloud-services/frontend-components';
import { getEmailSchema } from '../actions';
import { loaderField } from './constants';

export const getSchema = (app) => {
    return !app || !app.loaded ? loaderField : app.schema;
};

export const calculatePermissions = (permissions) => {
    return Promise.all(
        [ permissions ].flat()
        .map(({ method, args }) => insights.chrome?.visibilityFunctions?.[method]?.(...args || []))
    ).then((visibility) => visibility.every(Boolean));
};

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
