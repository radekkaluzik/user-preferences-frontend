import { render } from '@testing-library/react';
import React from 'react';

import Loader from './Loader';

describe('Loader component tests', () => {
  it('should render correctly', () => {
    const { container } = render(<Loader size="sm"></Loader>);
    expect(container).toMatchSnapshot();
  });
});
