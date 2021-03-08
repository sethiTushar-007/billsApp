import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

import FacebookIcon from '../../icons/Facebook';
import GoogleIcon from '../../icons/Google';
import * as actions from '../../store/actions/auth';
import Page from '../../components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = (props) => {
    const classes = useStyles();

    const responseGoogle = (response) => {
        console.log(response);
    }

    const responseFacebook = (response) => {
        console.log(response);
    }

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().max(255).required('Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values, {setSubmitting}) => {
                props.onAuth(values.username, values.password, props.handleMessageSnackbar);
                setTimeout(() => {
                    setSubmitting(false);
                }, 3000);
            }}
          >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
            }) => (
            <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                    >              

                    <FacebookLogin
                        appId="482438449783753"
                        callback={responseFacebook}
                        onFailure={() => props.handleMessageSnackbar('Login Failed!', 'error')}
                        render={renderProps => (
                            <Button
                                color="primary"
                                fullWidth
                                startIcon={<FacebookIcon />}
                                onClick={renderProps.onClick}
                                size="large"
                                variant="contained"
                            >
                                Login with Facebook
                            </Button>
                        )}
                    />
                        
                    
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    >
                    <GoogleLogin
                        clientId="315793660470-dainbj6n4qfaci4tc1pcio7dqctlnr7g.apps.googleusercontent.com"
                        render={renderProps => (
                            <Button
                                fullWidth
                                startIcon={<GoogleIcon />}
                                onClick={renderProps.onClick}
                                size="large"
                                variant="contained"
                            >
                                Login with Google
                            </Button>
                        )}
                        onSuccess={responseGoogle}
                        onFailure={() => props.handleMessageSnackbar('Login Failed!', 'error')}
                    />
                    
                  </Grid>
                </Grid>
                <Box
                  mt={3}
                  mb={1}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Username"
                  margin="normal"
                  name="username"
                  id="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="text"
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  id="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign in now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don&apos;t have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, password, handleMessageSnackbar) => dispatch(actions.authLogin(username, password, handleMessageSnackbar))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
