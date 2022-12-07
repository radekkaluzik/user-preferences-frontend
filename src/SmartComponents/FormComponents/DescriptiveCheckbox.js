import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import './descriptiveCheckbox.scss';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

// eslint-disable-next-line no-unused-vars
const DescriptiveCheckbox = (props) => {
  const {
    group,
    section,
    label,
    beforeOnChange,
    title,
    description,
    isDanger,
    isGlobal,
    checkedWarning,
    input: { onChange, checked, ...input },
  } = useFieldApi({
    ...props,
    type: 'checkbox',
  });
  const formOptions = useFormApi();

  return (
    <Checkbox
      {...input}
      isChecked={checked}
      id={`descriptive-checkbox-${input.name}`}
      onChange={(checked, event, ...rest) => {
        beforeOnChange(
          isGlobal,
          checked,
          formOptions,
          group,
          section,
          props.name
        );
        onChange(checked, event, ...rest);
      }}
      data-type="descriptive-checkbox"
      className="pref-c-descriptive-checkbox"
      label={
        <span
          className={classNames('pref-c-checkbox-label', {
            'pref-c-checkbox-label-error': isDanger || isGlobal,
          })}
        >
          {label || title}
        </span>
      }
      description={
        <div>
          {description && (
            <span className="pref-c-checkbox-description">{description}</span>
          )}
          {checked && checkedWarning && (
            <span className="pref-c-checkbox-warning">
              <ExclamationTriangleIcon /> {checkedWarning}
            </span>
          )}
        </div>
      }
    />
  );
};

DescriptiveCheckbox.propTypes = {
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  group: PropTypes.string,
  section: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  isDanger: PropTypes.bool,
  isGlobal: PropTypes.bool,
};

DescriptiveCheckbox.defaultProps = {
  name: '',
  label: '',
  isDanger: false,
};

export default DescriptiveCheckbox;
