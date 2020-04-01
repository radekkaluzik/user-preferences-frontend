import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
export { instance };

export const getApplicationSchema = (application, apiVersion = 'v1', resourceType = '', url) => (
    instance.get(`/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`)
);

export const saveValues = async (application, values, apiVersion = 'v1', resourceType = '', url) => {
    try {
        return await instance.post(`/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`, values);
    } catch {
        return undefined;
    }
};
