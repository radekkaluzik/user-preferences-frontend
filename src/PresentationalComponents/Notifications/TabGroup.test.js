import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { render } from '@testing-library/react';
import TabGroup from './TabGroup';

describe('TabGroup tests', () => {
  it('should render rest of the form', () => {
    const renderForm = jest.fn();
    render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm,
              },
            }}
          >
            <TabGroup fields={[]} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(renderForm).toHaveBeenCalledTimes(1);
  });
});
