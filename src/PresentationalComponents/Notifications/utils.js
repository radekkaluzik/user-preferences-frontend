import omit from 'lodash/omit';
import {
  BULK_SELECT_BUTTON,
  INPUT_GROUP,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents/componentTypes';

export const prepareFields = (notifPref, emailPref, emailConfig) =>
  Object.entries(notifPref).reduce((acc, [bundleKey, bundleData]) => {
    return [
      ...acc,
      {
        title: bundleData?.label,
        name: bundleKey,
        fields: Object.entries(bundleData.applications).reduce(
          (acc, [appKey, appData]) => {
            let selectAllActive = true;
            const fields = [
              ...Object.entries(emailPref).reduce(
                (acc, emailSection) => [
                  ...acc,
                  ...(emailSection[0] === appKey &&
                  emailConfig[emailSection[0]]?.bundle === bundleKey
                    ? [
                        {
                          label: 'Reports',
                          name: 'email-reports',
                          component: INPUT_GROUP,
                          level: 1,
                          fields: emailSection[1].schema[0]?.fields.map(
                            (field) => {
                              selectAllActive =
                                selectAllActive && field.initialValue;
                              return {
                                ...omit(field, [
                                  'infoMessage',
                                  'checkedWarning',
                                ]),
                                group: bundleKey,
                                section: appKey,
                                category: 'email-preference',
                              };
                            }
                          ),
                        },
                      ] || []
                    : []),
                ],
                []
              ),
              {
                label: 'Event notifications',
                description:
                  'Select how would you like to receive notifications for each event.',
                name: 'event-notifications',
                component: INPUT_GROUP,
                level: 1,
                fields: [
                  ...appData.eventTypes.map((eventType, idx) => ({
                    label: eventType.label,
                    name: `${eventType.name}-${idx}`,
                    component: INPUT_GROUP,
                    fields: eventType.fields.map((field) => {
                      selectAllActive = selectAllActive && field.initialValue;
                      return {
                        ...omit(field, [
                          'description',
                          'infoMessage',
                          'checkedWarning',
                        ]),
                        group: bundleKey,
                        section: appKey,
                        category: 'notification-preference',
                      };
                    }),
                  })),
                ],
              },
            ];
            return [
              ...acc,
              {
                name: appKey,
                bundle: bundleKey,
                label: appData.label,
                component: TAB_GROUP,
                fields: [
                  {
                    name: `bundles[${bundleKey}].applications[${appKey}].eventTypes[${BULK_SELECT_BUTTON}]`,
                    group: bundleKey,
                    section: appKey,
                    initialValue: !selectAllActive,
                    component: BULK_SELECT_BUTTON,
                  },
                  ...fields,
                ],
              },
            ];
          },
          []
        ),
      },
    ];
  }, []);
