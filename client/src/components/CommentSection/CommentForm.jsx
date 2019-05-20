import React, { useState } from 'react'
import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }
});

function CommentForm({ onSubmit, classes }) {
  const [text, setText] = useState('');
  return (
    <div>
      <TextField
          id="outlined-bare"
          className={classes.textField}
          defaultValue="Insert something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          margin="normal"
          variant="outlined"
      />
      <Button color="primary" onClick={(e) => { e.preventDefault(); onSubmit(text); }}>
        Submit
      </Button>
    </div>
  )
}

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(CommentForm);