import React from 'react';
import { Form, RendererContext } from '@data-driven-forms/react-form-renderer';
import { fireEvent, getByText, render } from '@testing-library/react';
import Tabs from './Tabs';
import { Router } from 'react-router-dom';

describe('Tabs tests', () => {
  const setSearch = jest.fn();
  const replace = jest.fn();

  const mockHistory = {
    push: jest.fn(),
    replace,
    listen: jest.fn(),
    location: {},
  };

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
  });

  it('should render correctly', () => {
    const { container } = render(
      <Router history={mockHistory}>
        <Form onSubmit={() => undefined}>
          {() => (
            <RendererContext.Provider
              value={{
                formOptions: {
                  renderForm: () => {},
                },
              }}
            >
              <Tabs search="" fields={fields} isLoading={false} />
            </RendererContext.Provider>
          )}
        </Form>
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it('should render loading correctly', () => {
    const { container } = render(
      <Router history={mockHistory}>
        <Form onSubmit={() => undefined}>
          {() => (
            <RendererContext.Provider
              value={{
                formOptions: {
                  renderForm: () => {},
                },
              }}
            >
              <Tabs search="" fields={[]} isLoading />
            </RendererContext.Provider>
          )}
        </Form>
      </Router>
    );
    expect(container).toMatchSnapshot();
  });

  it('should replace history on click', () => {
    const { container } = render(
      <Router history={mockHistory}>
        <Form onSubmit={() => undefined}>
          {() => (
            <RendererContext.Provider
              value={{
                formOptions: {
                  renderForm: () => {},
                },
              }}
            >
              <Tabs search="" fields={fields} isLoading={false} />
            </RendererContext.Provider>
          )}
        </Form>
      </Router>
    );
    expect(replace).toBeCalledTimes(1);
    fireEvent.click(getByText(container, 'Advisor2'));
    expect(replace).toHaveBeenNthCalledWith(2, {
      pathname: undefined,
      search: 'bundle=rhel&app=advisor2',
    });
  });
});
