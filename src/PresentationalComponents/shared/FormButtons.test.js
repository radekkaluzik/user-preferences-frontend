import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { render } from '@testing-library/react';
import FormButtonWithSpies from './FormButtons';

describe('FormButtons tests', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => null,
                internalRegisterField: () => undefined,
                internalUnRegisterField: () => undefined,
              },
            }}
          >
            <FormButtonWithSpies
              dirtyFieldsSinceLastSubmit={{ oepnshift: true }}
              submitSucceeded
              pristine
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });
});
