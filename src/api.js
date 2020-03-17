import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';

export const getApplicationSchema = async (application, apiVersion = 'v1', resourceType = '') => {
    return await instance.get(`/api/${application}/${apiVersion}/user-config/${resourceType}`);
};

export const saveValues = async (application, values, apiVersion = 'v1', resourceType = '') => {
    try {
        return await instance.post(`/api/${application}/${apiVersion}/user-config/${resourceType}/`, values);
    } catch {
        return undefined;
    }
};
