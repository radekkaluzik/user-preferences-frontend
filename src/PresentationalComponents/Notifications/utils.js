import { UNSUBSCRIBE_ALL } from '../../Utilities/constants';
import config from '../../config/config.json';

export const prepareFields = (notifPref, emailPref, emailConfig) =>
  Object.entries(notifPref).reduce(
    (acc, [key, value]) => [
      ...acc,
      {
        title: config['notification-preference'][key].title,
        name: key,
        fields: value.sections.reduce((acc, section) => {
          let unsubscribeAllInactive = false;
          const fields = [
            ...section.fields[0].fields.map((field) => {
              unsubscribeAllInactive =
                unsubscribeAllInactive || field.initialValue;
              return {
                ...field,
                group: key,
                section: section.name,
                category: 'notification-preference',
                beforeOnChange: beforeCheckboxOnChange,
              };
            }),
            ...Object.entries(emailPref).reduce(
              (acc, emailSection) => [
                ...acc,
                ...(emailSection[0] === section.name &&
                emailConfig[emailSection[0]]?.bundle === key
                  ? emailSection[1].schema[0]?.fields.map((field) => {
                      unsubscribeAllInactive =
                        unsubscribeAllInactive || field.initialValue;
                      return {
                        ...field,
                        group: key,
                        section: section.name,
                        category: 'email-preference',
                        beforeOnChange: beforeCheckboxOnChange,
                      };
                    }) || []
                  : []),
              ],
              []
            ),
          ];
          return [
            ...acc,
            {
              ...section,
              bundle: key,
              component: 'tabGroup',
              fields: [
                ...fields,
                {
                  name: `bundles[${key}].applications[${section.name}].notifications[${UNSUBSCRIBE_ALL}]`,
                  label: 'Unsubscribe from all',
                  isGlobal: true,
                  initialValue: !unsubscribeAllInactive,
                  group: key,
                  section: section.name,
                  component: 'descriptiveCheckbox',
                  validate: [],
                  category: 'notification-preference',
                  beforeOnChange: beforeCheckboxOnChange,
                },
              ],
            },
          ];
        }, []),
      },
    ],
    []
  );

export const beforeCheckboxOnChange = (
  isGlobal,
  checked,
  formOptions,
  group,
  section,
  fieldName
) => {
  if (isGlobal) {
    formOptions.batch(() => {
      formOptions.getRegisteredFields().forEach((field) => {
        if (
          checked &&
          typeof formOptions.getFieldState(field).value === 'boolean' &&
          ((field.includes(group) && field.includes(section)) ||
            (field === 'is_subscribed' && // a temporary condition for RHEL Advisor email pref.
              group === 'rhel' &&
              section == 'advisor')) &&
          !field.includes(UNSUBSCRIBE_ALL)
        ) {
          formOptions.change(field, false);
        }
      });
    });
  } else if (checked) {
    const foundUnsubscribe = formOptions
      .getRegisteredFields()
      .find(
        (field) =>
          typeof formOptions.getFieldState(field).value === 'boolean' &&
          field.includes(group) &&
          field.includes(section) &&
          field.includes(UNSUBSCRIBE_ALL)
      );
    foundUnsubscribe && formOptions.change(foundUnsubscribe, false);
  } else {
    let unsubscribeAllInactive = true;
    let foundUnsubscribe;
    formOptions.batch(() => {
      formOptions.getRegisteredFields().forEach((field) => {
        if (
          typeof formOptions.getFieldState(field).value === 'boolean' &&
          ((field.includes(group) && field.includes(section)) ||
            (field === 'is_subscribed' && // a temporary condition for RHEL Advisor email pref.
              group === 'rhel' &&
              section == 'advisor'))
        ) {
          if (field.includes(UNSUBSCRIBE_ALL)) {
            foundUnsubscribe = field;
          } else if (
            formOptions.getFieldState(field).value &&
            field !== fieldName
          ) {
            unsubscribeAllInactive = false;
          }
        }
      });
    });
    foundUnsubscribe &&
      formOptions.change(foundUnsubscribe, unsubscribeAllInactive);
  }
};
