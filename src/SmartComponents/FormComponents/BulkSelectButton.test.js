import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { fireEvent, getByRole, render } from '@testing-library/react';
import BulkSelectButton from './BulkSelectButton';

const mockInputOnChange = jest.fn();

jest.mock('@data-driven-forms/react-form-renderer/use-field-api', () =>
  jest.fn((props) => ({
    ...props,
    input: {
      onChange: mockInputOnChange,
      value: true,
    },
  }))
);

describe('BulkSelectButton tests', () => {
  const onChangeMock = jest.fn();

  afterEach(() => {
    mockInputOnChange.mockReset();
    onChangeMock.mockReset();
  });

  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: jest.fn(),
                internalUnRegisterField: jest.fn(),
                getState: () => ({
                  dirtyFields: [],
                }),
              },
            }}
          >
            <BulkSelectButton label="My button" {...props} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  it('should toggle correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <RendererContext.Provider
            value={{
              formOptions: {
                internalRegisterField: jest.fn(),
                internalUnRegisterField: jest.fn(),
                batch: (callback) => callback(),
                getRegisteredFields: () => ['rhel[advisor]', 'rhel[sources]'],
                change: onChangeMock,
              },
            }}
          >
            <BulkSelectButton
              label="My button"
              group="rhel"
              section="sources"
              {...props}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );

    fireEvent.click(getByRole(container, 'button'));
    expect(onChangeMock).toHaveBeenCalledWith('rhel[sources]', true);
    expect(mockInputOnChange).toHaveBeenCalledWith(false);
  });
});
