import emailReducer, { emailInitialState } from './email-reducer';
import { callReducer } from '../../test/redux-helpers';
import { GET_EMAIL_SCHEMA } from '../action-types';

describe('Email reducer', () => {
  let initialState;
  const reducer = callReducer(emailReducer);

  beforeEach(() => {
    initialState = emailInitialState;
  });

  it('should set loading state', () => {
    const expectedState = {
      ...initialState,
      advisor: {
        schema: [],
        loaded: false,
      },
    };
    expect(
      reducer(initialState, {
        type: `${GET_EMAIL_SCHEMA}_PENDING`,
        meta: { appName: 'advisor' },
      })
    ).toEqual(expectedState);
  });

  it('should set payload on success', () => {
    const payload = {};
    const expectedState = {
      ...initialState,
      advisor: {
        schema: payload,
        loaded: true,
      },
    };
    expect(
      reducer(initialState, {
        type: `${GET_EMAIL_SCHEMA}_FULFILLED`,
        payload,
        meta: { appName: 'advisor' },
      })
    ).toEqual(expectedState);
  });

  it('should set payload on reject', () => {
    const payload = [];
    const expectedState = {
      ...initialState,
      advisor: {
        schema: payload,
        loaded: true,
      },
    };
    expect(
      reducer(initialState, {
        type: `${GET_EMAIL_SCHEMA}_REJECTED`,
        payload,
        meta: { appName: 'advisor' },
      })
    ).toEqual(expectedState);
  });
});
