import React from 'react';
import DescriptiveCheckbox from './DescriptiveCheckbox';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { fireEvent, getByRole, render } from '@testing-library/react';

describe('Descriptive checkbox tests', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: () => undefined,
                internalUnRegisterField: () => undefined,
              },
            }}
          >
            <DescriptiveCheckbox label="test label" clearedValue {...props} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  it('should call beforeOnChange correctly', () => {
    const beforeOnChange = jest.fn();
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: () => undefined,
                internalUnRegisterField: () => undefined,
              },
            }}
          >
            <DescriptiveCheckbox
              label="test label"
              group="testGroup"
              section="testSection"
              clearedValue
              {...props}
              beforeOnChange={beforeOnChange}
              isGlobal
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    fireEvent.click(getByRole(container, 'checkbox'));
    expect(beforeOnChange).toHaveBeenCalledTimes(1);
    expect(beforeOnChange).toHaveBeenNthCalledWith(
      1,
      true,
      false,
      expect.anything(),
      'testGroup',
      'testSection',
      ''
    );
  });
});
