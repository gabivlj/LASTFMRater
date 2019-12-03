import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import GrampyHome from '../../images/grampy-home.jpeg';
import Grampy from '../../images/grampy.png';

const url = `url(${GrampyHome})`;

function SignInSide({ classes, onSubmit, state, onChange, errors, title }) {
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <form className={classes.form} noValidate onSubmit={onSubmit}>
            {Object.keys(state).map((element, index) => (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                key={element}
                id={element}
                label={errors[element] || state[element].label}
                name={element}
                autoComplete={state[element].autoComplete}
                autoFocus={index === 0}
                onChange={onChange}
                value={state[element].value}
              />
            ))}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <img
              alt="GrampyLogo"
              src={Grampy}
              style={{ width: '84px', marginTop: '50%' }}
            />
            {/* <Box mt={5}>
              <Copyright />
            </Box> */}
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default withStyles(theme => ({
  root: {
    height: '100vh',
    overflowY: 'hidden',
  },
  image: {
    backgroundImage: url,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: '20vh 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: '3px',
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '1vh',
  },
  submit: {
    margin: '3px 0 2px',
  },
}))(SignInSide);
