import React from 'react';
import {
  act,
  fireEvent,
  getAllByRole,
  getByRole,
  getByText,
  queryByText,
  render,
} from '@testing-library/react';
import Notifications from './Notifications';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import * as API from '../../api';
import * as NotificationsActions from '../../redux/actions/notifications-actions';
import * as EmailActions from '../../redux/actions/email-actions';
import { Provider } from 'react-redux';
import {
  GET_NOTIFICATIONS_SCHEMA,
  SAVE_EMAIL_SCHEMA,
  SAVE_NOTIFICATION_SCHEMA,
} from '../../redux/action-types';
import * as functions from '../../Utilities/functions';
import { calculateEmailConfigResponse, userPrefInitialState } from './testData';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    location: {},
  }),
}));

describe('Notifications tests', () => {
  const middlewares = [promiseMiddleware];
  let mockStore;
  let initialState;

  const calculateEmailConfig = jest.spyOn(functions, 'calculateEmailConfig');
  const getApplicationSchema = jest.spyOn(API, 'getApplicationSchema');
  const getNotificationsSchemaSpy = jest.spyOn(
    NotificationsActions,
    'getNotificationsSchema'
  );
  const saveNotificationValues = jest.spyOn(
    NotificationsActions,
    'saveNotificationValues'
  );
  const saveEmailValues = jest.spyOn(EmailActions, 'saveEmailValues');
  const emptyResolve = Promise.resolve({
    fields: [],
  });

  beforeEach(() => {
    mockStore = configureStore(middlewares);
    initialState = userPrefInitialState;
  });

  afterEach(() => {
    calculateEmailConfig.mockReset();
    getApplicationSchema.mockReset();
    getNotificationsSchemaSpy.mockReset();
    saveNotificationValues.mockReset();
    saveEmailValues.mockReset();
  });

  it('should render correctly', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    getNotificationsSchemaSpy.mockImplementation(() => ({
      type: GET_NOTIFICATIONS_SCHEMA,
      payload: Promise.resolve({
        bundles: {},
      }),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <Provider store={mockStore(initialState)}>
          <Notifications />
        </Provider>
      );
    });
    expect(wrapper.container).toMatchSnapshot();
  });

  it('should render empty state on filter', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    getNotificationsSchemaSpy.mockImplementation(() => ({
      type: GET_NOTIFICATIONS_SCHEMA,
      payload: Promise.resolve({
        bundles: {},
      }),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <Provider store={mockStore(initialState)}>
          <Notifications />
        </Provider>
      );
    });
    fireEvent.change(getByRole(wrapper.container, 'searchbox'), {
      target: { value: 'someText' },
    });
    expect(
      getByText(wrapper.container, 'No matching applications found')
    ).toBeVisible();
    fireEvent.click(getByText(wrapper.container, 'Clear filters'));
    expect(
      queryByText(wrapper.container, 'No matching applications found')
    ).toEqual(null);
    expect(getByText(wrapper.container, 'Console')).toBeVisible();
  });

  it('should submit correctly', async () => {
    getApplicationSchema.mockImplementation(() => emptyResolve);
    calculateEmailConfig.mockImplementation(() => calculateEmailConfigResponse);
    getNotificationsSchemaSpy.mockImplementation(() => ({
      type: GET_NOTIFICATIONS_SCHEMA,
      payload: Promise.resolve({
        bundles: {},
      }),
    }));
    saveNotificationValues.mockImplementation(() => ({
      type: SAVE_NOTIFICATION_SCHEMA,
      payload: Promise.resolve({}),
    }));
    saveEmailValues.mockImplementation(() => ({
      type: SAVE_EMAIL_SCHEMA,
      payload: Promise.resolve({}),
    }));
    let wrapper;
    await act(async () => {
      wrapper = render(
        <Provider store={mockStore(initialState)}>
          <Notifications />
        </Provider>
      );
    });
    expect(queryByText(wrapper.container, 'Save')).toEqual(null);
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(0));
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(1));
    expect(getByText(wrapper.container, 'Save')).toBeEnabled();
    fireEvent.click(getByText(wrapper.container, 'Cancel'));
    expect(queryByText(wrapper.container, 'Save')).toEqual(null);
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(0));
    fireEvent.click(getAllByRole(wrapper.container, 'checkbox').at(1));
    fireEvent.click(getByText(wrapper.container, 'Save'));
    expect(queryByText(wrapper.container, 'Save')).toEqual(null);
    expect(saveNotificationValues).toHaveBeenCalledTimes(1);
    expect(saveNotificationValues).toHaveBeenCalledWith({
      bundles: {
        console: {
          applications: {
            sources: {
              eventTypes: {},
            },
          },
        },
      },
    });
    expect(saveEmailValues).toHaveBeenCalledTimes(1);
    expect(saveEmailValues).toHaveBeenCalledWith({
      apiName: 'insights',
      application: 'advisor',
      url: '/user-preferences/',
      values: { is_subscribed: true },
    });
  });
});
