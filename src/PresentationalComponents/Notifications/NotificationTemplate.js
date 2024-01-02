import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import WarningModal from '@patternfly/react-component-groups/dist/dynamic/WarningModal';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import FormButtons from '../shared/FormButtons';
// import pathnames from '../../Utilities/pathnames';

const NotificationsTemplate = ({ schema, formFields }) => {
  const formApi = useFormApi();
  const [isVisibleDialog, setVisibleDialog] = useState(false);

  const { chromeHistory } = useChrome();
  const [triggerExit, setTriggerExit] = useState({
    confirmed: false,
    path: '',
  });

  const handleGoToIntendedPage = useCallback(
    (location) => chromeHistory.push(location),
    [chromeHistory]
  );

  useEffect(() => {
    const navigationAllowed =
      !formApi.getState().dirty || triggerExit.confirmed;
    if (navigationAllowed) {
      handleGoToIntendedPage(triggerExit.path);
    }
    // Let's comment this out to allow proper navigation
    // const unblock = chromeHistory.block(({ location }) => {
    //   if (
    //     !location.pathname?.includes(pathnames.notifications.link) &&
    //     formApi.getState().dirty
    //   ) {
    //     setVisibleDialog(true);
    //   }
    //   setTriggerExit((obj) => ({ ...obj, path: location.pathname }));
    //   return navigationAllowed;
    // });

    // return () => {
    //   unblock();
    // };
  }, [
    handleGoToIntendedPage,
    chromeHistory,
    triggerExit.confirmed,
    triggerExit.path,
  ]);

  return (
    <>
      <WarningModal
        isOpen={isVisibleDialog}
        title="Unsaved changes"
        onConfirm={() => {
          setTriggerExit((obj) => ({
            ...obj,
            confirmed: true,
          }));
          setVisibleDialog(false);
        }}
        onClose={() => setVisibleDialog(false)}
      >
        Your page contains unsaved changes. Do you want to leave?
      </WarningModal>

      <form onSubmit={formApi.handleSubmit} style={{ display: 'contents' }}>
        {schema.title}
        {formFields}
        <FormButtons />
      </form>
    </>
  );
};

NotificationsTemplate.propTypes = {
  schema: PropTypes.shape({
    title: PropTypes.node,
  }),
  formFields: PropTypes.array,
};

export default NotificationsTemplate;
