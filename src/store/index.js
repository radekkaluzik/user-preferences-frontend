import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
export { default as emailPreferences } from './email-preferences';
export { default as notificationPreferences } from './notification-preferences';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';

let registry;

export function init(...middleware) {
  if (!registry) {
    registry = new ReducerRegistry({}, [
      promiseMiddleware,
      notificationsMiddleware({ autoDismiss: true }),
      ...middleware.filter((item) => typeof item !== 'undefined'),
    ]);
  }
  return registry;
}

export function getStore() {
  return registry.getStore();
}

export function register(...args) {
  return registry.register(...args);
}
