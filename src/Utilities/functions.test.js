import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { getSchema, getSection, calculatePermissions, calculateEmailConfig } from './functions';
import { loaderField } from './constants';
import { mock } from '../__mock__/schemaLoader';

describe('getSchema', () => {
    it('should return loader', () => {
        const loader = getSchema();
        expect(loader).toMatchObject(loaderField);
    });

    it('should return loader if not loaded', () => {
        const loader = getSchema({ loaded: false });
        expect(loader).toMatchObject(loaderField);
    });

    it('should return schema', () => {
        const schema = { fields: []};
        const loaded = getSchema({ loaded: true, schema });
        expect(loaded).toMatchObject(schema);
    });
});

describe('getSection', () => {
    it('should return visible schema', () => {
        const section = getSection('first', { isVisible: true });
        expect(section).toMatchObject({ name: 'first', fields: loaderField });
    });

    it('should return visible schema from store', () => {
        const schema = { fields: []};
        const section = getSection('first', { isVisible: true, title: 'Some title' }, { loaded: true, schema });
        expect(section).toMatchObject({
            label: 'Some title',
            name: 'first',
            fields: schema
        });
    });

    it('should return loader', () => {
        const section = getSection();
        const wrapper = mount(section.label);
        expect(toJson(wrapper)).toMatchSnapshot();
        expect(section).toMatchObject({ fields: loaderField });
    });

    it('should call success function', (done) => {
        const success = jest.fn();
        const section = getSection('first', { isVisible: false }, {}, success);
        expect(section).toMatchObject({
            name: 'first',
            fields: loaderField
        });
        setTimeout(() => {
            expect(success).toHaveBeenCalled();
            done();
        });
    });
});

describe('calculatePermissions', () => {
    it('should check visibility of one function', async () => {
        const isVisible = await calculatePermissions({
            method: 'something'
        });
        expect(isVisible).toBe(false);
    });

    it('should check visibility of array of functions', async () => {
        const isVisible = await calculatePermissions([{
            method: 'something'
        }, {
            method: 'something',
            args: [ true ]
        }]);
        expect(isVisible).toBe(false);
    });

    it('should calculate visible for one function', async () => {
        const isVisible = await calculatePermissions([{
            method: 'something',
            args: [ true ]
        }]);
        expect(isVisible).toBe(true);
    });
});

describe('calculateEmailConfig', () => {
    it('should not throw error', async () => {
        const result = await calculateEmailConfig();
        expect(result).toMatchObject({});
    });

    it('should calculate schema with permissions - false', async () => {
        mock.onGet('/api*').reply(200, {});
        const result = calculateEmailConfig({
            'email-preference': {
                test: {
                    permissions: { method: 'something' }
                }
            }
        });
        expect(await result.test.isVisible).toBe(false);
    });

    it('should calculate schema with permissions - true', async () => {
        mock.onGet('/api/test/v1/user-config/email-preference').reply(200, {});
        const result = calculateEmailConfig({
            'email-preference': {
                test: {
                    permissions: { method: 'something', args: [ true ]}
                }
            }
        });
        expect(await result.test.isVisible).toBe(true);
    });

    it('should request localFile', (done) => {
        mock.onGet('/api/test/v1/user-config/email-preference').reply(200, {});
        const dispatch = jest.fn();
        calculateEmailConfig({
            'email-preference': {
                test: {}
            }
        }, dispatch);
        setImmediate(() => {
            expect(dispatch).toHaveBeenCalled();
            expect(dispatch.mock.calls[0][0]).toMatchObject({
                meta: {
                    appName: 'test'
                }
            });
            done();
        });
    });

    it('should request localFile', (done) => {
        const dispatch = jest.fn();
        calculateEmailConfig({
            'email-preference': {
                test: {
                    localFile: 'data/general.json'
                }
            }
        }, dispatch);
        setImmediate(() => {
            expect(dispatch).toHaveBeenCalled();
            expect(dispatch.mock.calls[0][0]).toMatchObject({
                payload: {},
                meta: {
                    appName: 'test'
                }
            });
            done();
        });
    });
});
