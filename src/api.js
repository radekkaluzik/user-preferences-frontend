import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
export { instance };

export const getApplicationSchema = async (application, apiVersion = 'v1', resourceType = '', url) => {
    try {
        return await instance.get(`/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`);
    } catch (e) {
        console.log(e);
    }
};

export const saveValues = async (application, values, apiVersion = 'v1', resourceType = '', url) => {
    try {
        return await instance.post(`/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`, values);
    } catch {
        return undefined;
    }
};
