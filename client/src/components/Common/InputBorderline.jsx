import React from 'react'
import purple from '@material-ui/core/colors/purple'
import { withStyles, TextField } from '@material-ui/core'
import PropTypes from 'prop-types'

const propTypes__ = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  multiline: PropTypes.bool.isRequired
}
const InputBorderline = ({
  classes,
  label,
  name,
  value,
  onChange,
  ...props
}) => {
  return (
    <TextField
      className={classes.margin + ' ' + props.className}
      InputLabelProps={{
        classes: {
          root: classes.cssLabel,
          focused: classes.cssFocused
        }
      }}
      InputProps={{
        classes: {
          root: classes.cssOutlinedInput,
          focused: classes.cssFocused,
          notchedOutline: classes.notchedOutline
        }
      }}
      onChange={onChange}
      value={value}
      name={name}
      label={label}
      variant="outlined"
      id="Borderline input"
      multiline
      {...props}
    />
  )
}
// proptypes
InputBorderline.propTypes = propTypes__
// styles for material-ui
const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  notchedOutline: {},
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing.unit
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500]
    }
  },
  cssOutlinedInput: {
    '&$cssFocused $notchedOutline': {
      borderColor: purple[500]
    }
  },
  formControl: {
    margin: theme.spacing.unit
  }
})

export default withStyles(styles)(InputBorderline)
