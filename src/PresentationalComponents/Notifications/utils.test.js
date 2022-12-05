import { beforeCheckboxOnChange, prepareFields } from './utils';

describe('prepareFields', () => {
  it('should return correct output', () => {
    const notifPref = {
      rhel: {
        name: 'notification-preferences',
        label: null,
        component: 'section',
        sections: [
          {
            name: 'advisor',
            label: 'Test',
            component: null,
            fields: [
              {
                name: null,
                label: null,
                component: null,
                fields: [
                  {
                    name: 'testName',
                    label: 'Instant notification',
                    description: 'Test description.',
                    initialValue: false,
                    component: 'descriptiveCheckbox',
                    validate: [],
                    checkedWarning: 'Test warning.',
                  },
                ],
              },
            ],
          },
        ],
      },
    };
    const emailPref = {
      advisor: {
        schema: [
          {
            fields: [
              {
                name: 'is_subscribed',
                label: 'Weekly Report',
                title: 'Weekly report',
                description:
                  "Subscribe to this account's Test Weekly Report email",
                helperText:
                  "User-specific setting to subscribe a user to the account's weekly reports email",
                component: 'descriptiveCheckbox',
                isRequired: true,
                initialValue: false,
                isDisabled: false,
              },
            ],
          },
        ],
        loaded: true,
      },
    };
    const emailConfig = {
      advisor: {
        isVisible: {},
        url: '/test/',
        apiName: 'name',
        bundle: 'rhel',
        title: 'test',
      },
    };
    const expected =
      '[{"title":"Red Hat Enterprise Linux","name":"rhel","fields":[{"name":"advisor","label":"Test","component":"tabGroup","fields":[{"name":"testName","label":"Instant notification","description":"Test description.","initialValue":false,"component":"descriptiveCheckbox","validate":[],"checkedWarning":"Test warning.","group":"rhel","section":"advisor","category":"notification-preference"},{"name":"is_subscribed","label":"Weekly Report","title":"Weekly report","description":"Subscribe to this account\'s Test Weekly Report email","helperText":"User-specific setting to subscribe a user to the account\'s weekly reports email","component":"descriptiveCheckbox","isRequired":true,"initialValue":false,"isDisabled":false,"group":"rhel","section":"advisor","category":"email-preference"},{"name":"bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]","label":"Unsubscribe from all","isGlobal":true,"initialValue":true,"group":"rhel","section":"advisor","component":"descriptiveCheckbox","validate":[],"category":"notification-preference"}],"bundle":"rhel"}]}]';
    const result = prepareFields(notifPref, emailPref, emailConfig);
    expect(JSON.stringify(result)).toEqual(expected);
  });
});

describe('beforeCheckboxOnChange', () => {
  it('should disable all preferences on unsubscribe-all check', () => {
    const change = jest.fn();
    beforeCheckboxOnChange(
      true,
      true,
      {
        batch: (fn) => fn(),
        getRegisteredFields: () => [
          'bundles[rhel].applications[advisor].notifications[INSTANT]',
          'is_subscribed',
          'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
        ],
        getFieldState: () => ({ value: true }),
        change,
      },
      'rhel',
      'advisor',
      'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]'
    );
    expect(change).toHaveBeenCalledTimes(2);
    expect(change).toHaveBeenNthCalledWith(
      1,
      'bundles[rhel].applications[advisor].notifications[INSTANT]',
      false
    );
    expect(change).toHaveBeenNthCalledWith(2, 'is_subscribed', false);
  });
  it('should disable unsubscribe-all preference on single value check', () => {
    const change = jest.fn();
    beforeCheckboxOnChange(
      false,
      true,
      {
        batch: (fn) => fn(),
        getRegisteredFields: () => [
          'bundles[rhel].applications[advisor].notifications[INSTANT]',
          'is_subscribed',
          'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
        ],
        getFieldState: () => ({ value: true }),
        change,
      },
      'rhel',
      'advisor',
      'is_subscribed'
    );
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenNthCalledWith(
      1,
      'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
      false
    );
  });
  it('should enable unsubscribe-all preference on all values uncheck', () => {
    const change = jest.fn();
    beforeCheckboxOnChange(
      false,
      false,
      {
        batch: (fn) => fn(),
        getRegisteredFields: () => [
          'bundles[rhel].applications[advisor].notifications[INSTANT]',
          'is_subscribed',
          'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
        ],
        getFieldState: () => ({ value: false }),
        change,
      },
      'rhel',
      'advisor',
      'is_subscribed'
    );
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenNthCalledWith(
      1,
      'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
      true
    );
  });
  it('should not enable unsubscribe-all preference on some values uncheck', () => {
    const change = jest.fn();
    beforeCheckboxOnChange(
      false,
      false,
      {
        batch: (fn) => fn(),
        getRegisteredFields: () => [
          'bundles[rhel].applications[advisor].notifications[INSTANT]',
          'is_subscribed',
          'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
        ],
        getFieldState: (field) => ({
          value:
            field ==
            'bundles[rhel].applications[advisor].notifications[INSTANT]',
        }),
        change,
      },
      'rhel',
      'advisor',
      'is_subscribed'
    );
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenNthCalledWith(
      1,
      'bundles[rhel].applications[advisor].notifications[UNSUBSCRIBE_ALL]',
      false
    );
  });
});
