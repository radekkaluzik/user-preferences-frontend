import React from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import FormButtons from '../shared/FormButtons';

const NotificationsTemplate = ({ schema, formFields }) => {
  const { handleSubmit } = useFormApi();

  return (
    <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
      {schema.title}
      {formFields}
      <FormButtons />
    </form>
  );
};

NotificationsTemplate.propTypes = {
  schema: PropTypes.shape({
    title: PropTypes.node,
  }),
  formFields: PropTypes.array,
};

export default NotificationsTemplate;
