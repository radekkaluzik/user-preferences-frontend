import React from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { isEmpty } from 'lodash';
import { FormSpy } from '@data-driven-forms/react-form-renderer';

const FormTemplate = ({ formFields, dirtyFieldsSinceLastSubmit, submitSucceeded, pristine }) => {
    const { handleSubmit, reset } = useFormApi();
    const noChanges = isEmpty(dirtyFieldsSinceLastSubmit) || !submitSucceeded && pristine;
    return (
        <form onSubmit={ handleSubmit }>
            { formFields }
            <div>
                <Button
                    className="pref-email__form-button"
                    type="submit"
                    isDisabled={ noChanges }
                    variant="primary">Submit</Button>
                <Button
                    variant="link"
                    isDisabled={ noChanges }
                    onClick={ () => reset() }>
                        Cancel
                </Button>
            </div>
        </form>
    );
};

FormTemplate.propTypes = {
    formFields: PropTypes.any,
    dirtyFieldsSinceLastSubmit: PropTypes.arrayOf(PropTypes.shape({
        [PropTypes.string]: PropTypes.oneOfType([ PropTypes.string, PropTypes.number, PropTypes.bool ])
    })),
    submitSucceeded: PropTypes.bool,
    pristine: PropTypes.bool
};

const FormTemplateWithSpies = (formProps) => (
    <FormSpy subscription={ {
        pristine: true,
        submitSucceeded: true,
        dirtyFieldsSinceLastSubmit: true
    } }>
        { (props) => <FormTemplate { ...props } { ...formProps }/> }
    </FormSpy>
);

export default FormTemplateWithSpies;
