import React, { useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { Bullseye, Spinner, Text } from '@patternfly/react-core';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNotificationsSchema,
  saveNotificationValues,
} from '../../redux/actions/notifications-actions';
import { saveEmailValues } from '../../redux/actions/email-actions';
import { calculateEmailConfig } from '../../Utilities/functions';
import {
  BULK_SELECT_BUTTON,
  BulkSelectButton,
  DATA_LIST,
  DESCRIPTIVE_CHECKBOX,
  DataListLayout,
  DescriptiveCheckbox,
  FORM_TABS,
  INPUT_GROUP,
  InputGroup,
  LOADER,
  Loader,
  TAB_GROUP,
} from '../../SmartComponents/FormComponents';
import config from '../../config/config.json';
import FormTabs from './Tabs';
import FormTabGroup from './TabGroup';
import { prepareFields } from './utils';
import FormTemplate from './NotificationTemplate';
import './notifications.scss';

const Notifications = () => {
  const { auth } = useChrome();
  const dispatch = useDispatch();
  const titleRef = useRef(null);
  const [emailConfig, setEmailConfig] = useState({});

  const emailPref = useSelector(({ emailReducer }) => emailReducer);
  const { bundles: notifPref, loaded } = useSelector(
    ({ notificationsReducer }) => ({
      ...notificationsReducer,
      bundles: Object.entries(notificationsReducer?.bundles || {})?.reduce(
        (acc, [key, value]) => ({
          ...acc,
          ...(config['notification-preference'].includes(key)
            ? { [key]: value }
            : {}),
        }),
        {}
      ),
    })
  );

  useEffect(() => {
    (async () => {
      await auth.getUser();
      setEmailConfig(calculateEmailConfig(config, dispatch));
      dispatch(getNotificationsSchema());
    })();
  }, []);

  const saveValues = (values, formApi) => {
    const notifToSubmit = Object.entries(notifPref).reduce((acc, curr) => {
      const temp = curr[1].sections
        .filter((item) =>
          Object.entries(formApi.getState().dirtyFields).some(
            ([key, value]) =>
              key.includes(curr[0]) &&
              key.includes(item.name) &&
              key.includes('notifications') &&
              value
          )
        )
        .map((item) => item.name);
      const tempToSubmit = [...new Set([...(acc?.[curr[0]] || []), ...temp])];
      return {
        ...acc,
        ...(tempToSubmit.length > 0 ? { [curr[0]]: tempToSubmit } : {}),
      };
    }, {});
    const promises = Object.keys(notifToSubmit).map((bundleName) =>
      dispatch(
        saveNotificationValues({
          bundleName,
          values: {
            bundles: {
              [bundleName]: {
                applications: Object.entries(
                  values.bundles[bundleName].applications
                ).reduce(
                  (acc, [key, value]) => ({
                    ...acc,
                    [key]: {
                      notifications: omit(
                        value.notifications,
                        BULK_SELECT_BUTTON
                      ),
                    },
                  }),
                  {}
                ),
              },
            },
          },
        })
      )
    );
    // temporary submitting of RHEL Advisor email pref.
    if (formApi.getState().dirtyFields['is_subscribed']) {
      const { url, apiName } = emailConfig['advisor'];
      const action = saveEmailValues({
        application: 'advisor',
        values: { is_subscribed: values.is_subscribed },
        url,
        apiName,
      });
      promises.push(dispatch(action));
    }
    formApi.initialize(values);
    Promise.all(promises)
      .then(() => {
        dispatch(
          addNotification({
            dismissable: true,
            variant: 'success',
            title: 'Notification preferences successfully saved',
          })
        );
      })
      .catch(() => {
        dispatch(
          addNotification({
            dismissable: true,
            variant: 'danger',
            title: 'Notification preferences unsuccessfully saved',
          })
        );
      });
  };

  return loaded && Object.values(emailPref).every((value) => value.loaded) ? (
    <div id="notifications-container" className="pref-notifications--container">
      <div className="pref-notifications--wrapper">
        <div id="notifications-grid" className="pref-notifications--grid">
          <div ref={titleRef} className="pref-notifications--head">
            <PageHeaderTitle
              className="pref-notifications--title sticky"
              title="My Notifications"
            />
            <Text className="pref-notifications--subtitle">
              This service allows you to opt-in and out of receiving
              notifications. Your Organization Administrator has configured
              which notifications you can or can not receive in their{' '}
              <a href={`/settings/notifications`}>Settings</a>.
            </Text>
          </div>

          <FormRenderer
            componentMapper={{
              ...componentMapper,
              [DESCRIPTIVE_CHECKBOX]: DescriptiveCheckbox,
              [BULK_SELECT_BUTTON]: BulkSelectButton,
              [LOADER]: Loader,
              [DATA_LIST]: DataListLayout,
              [INPUT_GROUP]: InputGroup,
              [FORM_TABS]: FormTabs,
              [TAB_GROUP]: FormTabGroup,
            }}
            FormTemplate={FormTemplate}
            schema={{
              fields: [
                {
                  component: FORM_TABS,
                  name: 'notifTabs',
                  titleRef,
                  bundles: notifPref,
                  fields: prepareFields(notifPref, emailPref, emailConfig),
                },
              ],
            }}
            onSubmit={saveValues}
          />
        </div>
      </div>
    </div>
  ) : (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );
};

export default Notifications;
