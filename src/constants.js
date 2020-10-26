export const GET_EMAIL_SCHEMA = '@@EMAIL/GET_SCHEMA';
export const SAVE_EMAIL_SCHEMA = '@@EMAIL/SAVE_VALUES';

export const ACTION_TYPES = ['_PENDING', '_FULFILLED', '_REJECTED'].reduce(
  (acc, curr) => ({
    ...acc,
    ...{
      [`${GET_EMAIL_SCHEMA}${curr}`]: GET_EMAIL_SCHEMA,
      [`${SAVE_EMAIL_SCHEMA}${curr}`]: SAVE_EMAIL_SCHEMA,
    },
  }),
  {
    GET_EMAIL_SCHEMA,
    SAVE_EMAIL_SCHEMA,
  }
);
