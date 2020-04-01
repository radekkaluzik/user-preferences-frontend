import { instance } from '../api';

import MockAdapter from 'axios-mock-adapter';

export const mock = new MockAdapter(instance);
