import React from 'react';
import InputBorderline from '../../../Common/InputBorderline';
import PropTypes from 'prop-types';

const propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const GeneralForm = ({
  name,
  description,
  onChange,
  img,
  labelRef,
  ...props
}) => (
  <div className="row container">
    <div className="col-lg-4">
      <InputBorderline
        value={name}
        onChange={onChange}
        name="name"
        label="Title of your playlist"
        multiline={false}
        fullWidth
      />
    </div>
    <div className="col-lg-8">
      <InputBorderline
        value={description}
        onChange={onChange}
        name="description"
        label="Description of your playlist"
        multiline
        fullWidth
      />
    </div>
  </div>
);

GeneralForm.propTypes = propTypes;

export default GeneralForm;
