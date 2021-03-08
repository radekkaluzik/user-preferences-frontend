import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
export { instance };

instance.interceptors.response.use((response) => {
  if (response?.config?.data) {
    try {
      return JSON.parse(response.config.data);
    } catch (_e) {
      return response.config.data;
    }
  }

  return response;
});

export const getApplicationSchema = (
  application,
  apiVersion = 'v1',
  resourceType = '',
  url
) =>
  instance.get(
    `/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`
  );

export const saveValues = async (
  application,
  values,
  apiVersion = 'v1',
  resourceType = '',
  url
) =>
  instance.post(
    `/api/${application}/${apiVersion}${url || `/user-config/${resourceType}`}`,
    values
  );
