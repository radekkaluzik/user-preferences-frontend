import omit from 'lodash/omit';
import {
  BULK_SELECT_BUTTON,
  INPUT_GROUP,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents/componentTypes';

// update bulk select button's state after every change
const afterChange = (formOptions, newValue, bundle, app) => {
  if (!newValue) {
    formOptions.change(
      `bundles[${bundle}].applications[${app}].eventTypes[${BULK_SELECT_BUTTON}]`,
      true
    );
  } else {
    const allChecked = Object.entries(
      formOptions.getState().values.bundles?.[bundle]?.applications?.[app]
        .eventTypes || {}
    ).every(([key, value]) => key === BULK_SELECT_BUTTON || value);
    if (
      allChecked &&
      ((bundle !== 'rhel' && app !== 'advisor') ||
        formOptions.getState().values['is_subscribed'])
    ) {
      formOptions.change(
        `bundles[${bundle}].applications[${app}].eventTypes[${BULK_SELECT_BUTTON}]`,
        false
      );
    }
  }
};

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
                (acc, [emailSectionKey, emailSectionValue]) => [
                  ...acc,
                  ...(emailSectionKey === appKey &&
                  emailConfig[emailSectionKey]?.bundle === bundleKey &&
                  emailSectionValue.schema.length !== 0
                    ? [
                        {
                          label: 'Reports',
                          name: 'email-reports',
                          component: INPUT_GROUP,
                          level: 1,
                          fields: emailSectionValue.schema[0]?.fields?.map(
                            (field) => {
                              selectAllActive =
                                selectAllActive && field.initialValue;
                              return {
                                ...omit(field, [
                                  'infoMessage',
                                  'checkedWarning',
                                ]),
                                afterChange: (formOptions, checked) =>
                                  afterChange(
                                    formOptions,
                                    checked,
                                    bundleKey,
                                    appKey
                                  ),
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
                        afterChange: (formOptions, checked) =>
                          afterChange(formOptions, checked, bundleKey, appKey),
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
                    section: appKey,
                    initialValue: !selectAllActive,
                    component: BULK_SELECT_BUTTON,
                    onClick: (formOptions, input) => {
                      formOptions.batch(() => {
                        formOptions.getRegisteredFields().forEach((field) => {
                          if (
                            ((field.includes(bundleKey) &&
                              field.includes(appKey)) ||
                              (field === 'is_subscribed' && // a temporary condition for RHEL Advisor email pref.
                                bundleKey === 'rhel' &&
                                appKey == 'advisor')) &&
                            !field.includes(BULK_SELECT_BUTTON)
                          ) {
                            formOptions.change(field, input.value);
                          }
                        });
                      });
                      input.onChange(!input.value);
                    },
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
