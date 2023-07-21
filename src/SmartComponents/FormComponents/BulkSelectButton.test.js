import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { render } from '@testing-library/react';
import BulkSelectButton from './BulkSelectButton';

describe('Bulk Select Button tests', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: jest.fn(),
                internalUnRegisterField: jest.fn(),
                renderForm: () => {},
                getState: () => ({
                  dirtyFields: [],
                }),
              },
              validatorMapper: {
                required: () => (value) => value ? undefined : 'required',
              },
            }}
          >
            <BulkSelectButton label="test label" clearedValue {...props} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toBeVisible();
  });
});
