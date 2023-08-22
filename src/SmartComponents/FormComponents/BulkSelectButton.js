import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { BULK_SELECT_BUTTON } from './componentTypes';
import './BulkSelectButton.scss';

const BulkSelectButton = (props) => {
  const formOptions = useFormApi();
  const { input, group, section } = useFieldApi({
    ...props,
    type: 'button',
  });

  return (
    <Button
      className="pref-c-bulk-select-button"
      variant="secondary"
      {...input}
      id={`bulk-select-${section}`}
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
        input.onChange(!input.value);
      }}
    >
      {input.value ? 'Select' : 'Deselect'} all
    </Button>
  );
};

BulkSelectButton.propTypes = {
  group: PropTypes.string,
  section: PropTypes.string,
};

export default BulkSelectButton;
