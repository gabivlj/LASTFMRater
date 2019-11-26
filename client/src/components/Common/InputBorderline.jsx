import React from 'react';
import purple from '@material-ui/core/colors/purple';
import { withStyles, TextField, Chip } from '@material-ui/core';
import PropTypes from 'prop-types';
import FaceIcon from '@material-ui/icons/Face';

const propTypes__ = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool.isRequired,
  error: PropTypes.string,
  style: PropTypes.object,
};

const defaultProps = {
  style: {},
};

const InputBorderline = ({
  classes,
  label,
  name,
  value,
  error,
  onChange,
  cleanErrors,
  type,
  style,
  ...props
}) => {
  return (
    <div>
      <div>
        {error && error.trim().length > 0 ? (
          <Chip
            icon={<FaceIcon />}
            label={error}
            onDelete={() => cleanErrors()}
            className={classes.chip}
            color="secondary"
          />
        ) : null}
      </div>

      <div>
        <TextField
          id={type}
          type={type}
          className={`${classes.margin} ${props.className}`}
          style={style}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          fullWidth
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
          }}
          onChange={onChange}
          value={value}
          name={name}
          label={label}
          variant="outlined"
          multiline
          {...props}
        />
      </div>
    </div>
  );
};
// proptypes
InputBorderline.propTypes = propTypes__;
InputBorderline.defaultProps = defaultProps;
// styles for material-ui
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  notchedOutline: {},
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  chip: {
    margin: theme.spacing.unit,
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500],
    },
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500],
    },
  },
  formControl: {
    margin: theme.spacing.unit,
  },
});

export default withStyles(styles)(InputBorderline);
