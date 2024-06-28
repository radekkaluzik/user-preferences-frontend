import notificationsReducer, {
  notificationsInitialState,
} from './notifications-reducer';
import { callReducer } from '../../test/redux-helpers';
import { GET_NOTIFICATIONS_SCHEMA } from '../action-types';

describe('Email reducer', () => {
  let initialState;
  const reducer = callReducer(notificationsReducer);

  beforeEach(() => {
    initialState = notificationsInitialState;
  });

  it('should set loading state', () => {
    const expectedState = {
      loaded: false,
    };
    expect(
      reducer(initialState, {
        type: `${GET_NOTIFICATIONS_SCHEMA}_PENDING`,
      })
    ).toEqual(expectedState);
  });

  it('should set payload on success', () => {
    const payload = { bundles: { console: {} } };
    const expectedState = {
      ...initialState,
      bundles: payload.bundles,
      meta: undefined,
      loaded: true,
    };
    expect(
      reducer(initialState, {
        type: `${GET_NOTIFICATIONS_SCHEMA}_FULFILLED`,
        payload,
      })
    ).toEqual(expectedState);
  });

  it('should set payload on reject', () => {
    const payload = {};
    const expectedState = {
      ...initialState,
      bundles: payload,
      meta: undefined,
      loaded: true,
    };
    expect(
      reducer(initialState, {
        type: `${GET_NOTIFICATIONS_SCHEMA}_REJECTED`,
        payload,
      })
    ).toEqual(expectedState);
  });
});
