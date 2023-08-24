import { BULK_SELECT_BUTTON } from '../../Utilities/constants';
import config from '../../config/config.json';

export const prepareFields = (notifPref, emailPref, emailConfig) =>
  Object.entries(notifPref).reduce(
    (acc, [key, value]) => [
      ...acc,
      {
        title: config['notification-preference'][key].title,
        name: key,
        fields: value.sections.reduce((acc, section) => {
          let unsubscribeAllInactive = true;
          const fields = [
            ...section.fields[0].fields.map((field) => {
              unsubscribeAllInactive =
                unsubscribeAllInactive && field.initialValue;
              return {
                ...field,
                group: key,
                section: section.name,
                category: 'notification-preference',
              };
            }),
            ...Object.entries(emailPref).reduce(
              (acc, emailSection) => [
                ...acc,
                ...(emailSection[0] === section.name &&
                emailConfig[emailSection[0]]?.bundle === key
                  ? emailSection?.[1]?.schema?.[0]?.fields?.map((field) => {
                      unsubscribeAllInactive =
                        unsubscribeAllInactive && field.initialValue;
                      return {
                        ...field,
                        group: key,
                        section: section.name,
                        category: 'email-preference',
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
                {
                  name: `bundles[${key}].applications[${section.name}].notifications[${BULK_SELECT_BUTTON}]`,
                  group: key,
                  section: section.name,
                  initialValue: !unsubscribeAllInactive,
                  component: 'bulkSelectButton',
                },
                ...fields,
              ],
            },
          ];
        }, []),
      },
    ],
    []
  );
