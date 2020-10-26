import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DescriptiveCheckbox from './DescriptiveCheckbox';
import { Form } from '@data-driven-forms/react-form-renderer';

describe('Descriptive checkbox tests', () => {
  it('should render correctly', () => {
    const wrapper = mount(
      <Form onSubmit={() => undefined}>
        {(props) => (
          <DescriptiveCheckbox label="test label" clearedValue {...props} />
        )}
      </Form>
    );
    expect(toJson(wrapper.find('DescriptiveCheckbox'))).toMatchSnapshot();
  });
});
