import React, { useEffect, useRef } from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { BULK_SELECT_BUTTON } from './componentTypes';
import './BulkSelectButton.scss';

const BulkSelectButton = (props) => {
  const formOptions = useFormApi();
  const dirtyFieldsRef = useRef(formOptions.getState().dirtyFields);
  const {
    group,
    section,
    input: { ...input },
  } = useFieldApi({
    ...props,
    type: 'button',
  });
  useEffect(() => {
    if (
      JSON.stringify(dirtyFieldsRef.current) !==
      JSON.stringify(formOptions.getState().dirtyFields)
    ) {
      let notIsSubscribed;
      formOptions.batch(() => {
        formOptions.getRegisteredFields().forEach((field) => {
          if (
            !field.includes(BULK_SELECT_BUTTON) &&
            ((field.includes(group) && field.includes(section)) ||
              (field === 'is_subscribed' && // a temporary condition for RHEL Advisor email pref.
                group === 'rhel' &&
                section == 'advisor')) &&
            formOptions.getFieldState(field).value == false
          ) {
            notIsSubscribed = true;
          }
        });
      });
      formOptions.change(input.name, notIsSubscribed ?? false);
      dirtyFieldsRef.current = formOptions.getState().dirtyFields;
    }
  });

  return (
    <Button
      className="pref-c-bulk-select-button"
      variant="secondary"
      {...input}
      id={`button-${input.name}`}
      onClick={() => {
        formOptions.batch(() => {
          formOptions.getRegisteredFields().forEach((field) => {
            if (
              ((field.includes(group) && field.includes(section)) ||
                (field === 'is_subscribed' && // a temporary condition for RHEL Advisor email pref.
                  group === 'rhel' &&
                  section == 'advisor')) &&
              !field.includes(BULK_SELECT_BUTTON)
            ) {
              formOptions.change(field, input.value);
            }
          });
        });
        formOptions.change(input.name, !input.value);
      }}
    >
      {input.value == true ? 'Select all' : 'Deselect All'}
    </Button>
  );
};

BulkSelectButton.propTypes = {
  group: PropTypes.string,
  section: PropTypes.string,
  name: PropTypes.string,
};

BulkSelectButton.defaultProps = {
  name: '',
};

export default BulkSelectButton;
