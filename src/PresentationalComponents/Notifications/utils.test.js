import { prepareFields } from './utils';

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
      '[{"title":"Red Hat Enterprise Linux","name":"rhel","fields":[{"name":"advisor","label":"Test","component":"tabGroup","fields":[{"name":"bundles[rhel].applications[advisor].notifications[BULK_SELECT_BUTTON]","group":"rhel","section":"advisor","initialValue":true,"component":"bulkSelectButton"},{"name":"testName","label":"Instant notification","description":"Test description.","initialValue":false,"component":"descriptiveCheckbox","validate":[],"checkedWarning":"Test warning.","group":"rhel","section":"advisor","category":"notification-preference"},{"name":"is_subscribed","label":"Weekly Report","title":"Weekly report","description":"Subscribe to this account\'s Test Weekly Report email","helperText":"User-specific setting to subscribe a user to the account\'s weekly reports email","component":"descriptiveCheckbox","isRequired":true,"initialValue":false,"isDisabled":false,"group":"rhel","section":"advisor","category":"email-preference"}],"bundle":"rhel"}]}]';
    const result = prepareFields(notifPref, emailPref, emailConfig);
    expect(JSON.stringify(result)).toEqual(expected);
  });
});
