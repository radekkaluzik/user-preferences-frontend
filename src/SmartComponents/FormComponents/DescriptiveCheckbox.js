import React from 'react';
import { Checkbox } from '@patternfly/react-core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import './descriptiveCheckbox.scss';
import {
  ExclamationTriangleIcon,
  InfoCircleIcon,
} from '@patternfly/react-icons';

// eslint-disable-next-line no-unused-vars
const DescriptiveCheckbox = (props) => {
  const {
    label,
    title,
    description,
    isDanger,
    checkedWarning,
    infoMessage,
    input: { onChange, checked, ...input },
  } = useFieldApi({
    ...props,
    type: 'checkbox',
  });

  return (
    <Checkbox
      {...input}
      isChecked={checked}
      id={`descriptive-checkbox-${input.name}`}
      onChange={(checked, event, ...rest) => {
        onChange(checked, event, ...rest);
      }}
      data-type="descriptive-checkbox"
      className="pref-c-descriptive-checkbox"
      label={
        <span
          className={classNames('pref-c-checkbox-label', {
            'pref-c-checkbox-label-error': isDanger,
          })}
        >
          {label || title}
        </span>
      }
      description={
        <div>
          {description && (
            <>
              <span className="pref-c-checkbox-description">{description}</span>
            </>
          )}
          {!checked && infoMessage && (
            <span className="pref-c-checkbox-info">
              <InfoCircleIcon /> {infoMessage}
            </span>
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
