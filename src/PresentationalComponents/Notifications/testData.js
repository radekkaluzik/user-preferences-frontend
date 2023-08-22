export const userPrefInitialState = {
  notificationsReducer: {
    bundles: {
      console: {
        label: 'Console',
        applications: {
          sources: {
            label: 'Sources',
            eventTypes: [
              {
                name: null,
                label: null,
                component: null,
                fields: [
                  {
                    name: 'bundles[console].applications[sources].notifications[INSTANT]',
                    label: 'Instant notification',
                    component: 'descriptiveCheckbox',
                  },
                  {
                    name: 'is_subscribed',
                    label: 'email test',
                    component: 'descriptiveCheckbox',
                  },
                ],
              },
            ],
          },
        },
      },
    },
    loaded: true,
  },
  emailReducer: {
    advisor: {
      schema: [
        {
          fields: [
            {
              name: 'is_subscribed',
              label: 'Weekly Report',
              title: 'Weekly report',
              description:
                "Subscribe to this account's Advisor Weekly Report email",
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
  },
};

export const userPrefEmptyInitialState = {
  notificationsReducer: {
    bundles: {},
  },
  emailReducer: {},
};

export const calculateEmailConfigResponse = {
  advisor: {
    isVisible: {},
    url: '/user-preferences/',
    apiName: 'insights',
    bundle: 'rhel',
    title: 'Advisor',
  },
  unsubscribe: {
    localFile: 'data/unsubscribe.json',
    isVisible: true,
    title: '',
  },
};
