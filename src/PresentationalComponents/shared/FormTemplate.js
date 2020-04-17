import React, { useState } from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { isEmpty } from 'lodash';

const FormTemplate = ({ formFields }) => {
    const [ noChanges, setNoChanges ] = useState(true);
    const { handleSubmit, reset, subscribe } = useFormApi();
    subscribe(({ dirtyFieldsSinceLastSubmit, pristine, submitSucceeded }) => {
        const empty = isEmpty(dirtyFieldsSinceLastSubmit) || !submitSucceeded && pristine;
        if (noChanges !== empty) {
            setNoChanges(empty);
        }
    }, {
        pristine: true,
        submitSucceeded: true,
        dirtyFieldsSinceLastSubmit: true
    });
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
    formFields: PropTypes.any
};

export default FormTemplate;
