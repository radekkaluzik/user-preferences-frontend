import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { fireEvent, getByText, render } from '@testing-library/react';
import Tabs from './Tabs';

const mockedNavigate = jest.fn();
const mockedLocation = jest.fn(() => ({}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
  useLocation: () => mockedLocation,
}));

describe('Tabs tests', () => {
  const setSearch = jest.fn();
  const replace = jest.fn();

  const fields = [
    {
      title: 'Red Hat Enterprise Linux',
      name: 'rhel',
      fields: [
        {
          name: 'advisor',
          label: 'Advisor',
          component: 'tabGroup',
          fields: [],
          bundle: 'rhel',
        },
        {
          name: 'advisor2',
          label: 'Advisor2',
          component: 'tabGroup',
          fields: [{}],
          bundle: 'rhel',
        },
      ],
    },
  ];

  afterEach(() => {
    setSearch.mockReset();
    replace.mockReset();
    mockedNavigate.mockReset();
    mockedLocation.mockReset();
  });

  it('should render correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <Tabs
              search=""
              fields={fields}
              isLoading={false}
              bundles={{ rhel: { label: 'RHEL' } }}
            />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  it('should render loading correctly', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <Tabs search="" fields={[]} bundles={{}} isLoading />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(container).toMatchSnapshot();
  });

  it('should replace URL on click', () => {
    const { container } = render(
      <Form onSubmit={() => undefined}>
        {() => (
          <RendererContext.Provider
            value={{
              formOptions: {
                renderForm: () => {},
              },
            }}
          >
            <Tabs search="" fields={fields} isLoading={false} bundles={{}} />
          </RendererContext.Provider>
        )}
      </Form>
    );
    expect(mockedNavigate).toBeCalledTimes(1);
    fireEvent.click(getByText(container, 'Advisor2'));
    expect(mockedNavigate).toHaveBeenNthCalledWith(
      2,
      { pathname: undefined, search: 'bundle=rhel&app=advisor2' },
      { replace: true }
    );
  });
});
