import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import DataListLayout from './DataListLayout';

describe('DataListLayout checkbox tests', () => {

    it('should render correctly', () => {
        const wrapper = mount(
            <DataListLayout
                label="test label"
                sections={ [{ label: 'test', fields: [{ fields: []}]}] }
                formOptions={ {
                    renderForm: () => 'test'
                } }
            />
        );
        expect(toJson(wrapper.find('DataListLayout'))).toMatchSnapshot();
    });
});
