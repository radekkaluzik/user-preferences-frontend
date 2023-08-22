import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
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

export const getNotificationsSchema = (apiVersion = 'v1') =>
  instance.get(
    `/api/notifications/${apiVersion}/user-config/notification-event-type-preference`
  );

export const saveValues = async (values, apiVersion = 'v1') =>
  instance.post(
    `/api/notifications/${apiVersion}/user-config/notification-event-type-preference`,
    values
  );
