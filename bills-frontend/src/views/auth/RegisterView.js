import React, {useState} from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
    Container,
    FormControlLabel,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from '../../components/Page';
import * as actions from '../../store/actions/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
   },
   avatar: {
       height: 100,
       width: 100
   }
}));

const RegisterView = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const [showPasswords, setShowPasswords] = useState(false);

  return (
    <Page
      className={classes.root}
      title="Register"
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
              email: '',
              username: '',
              password1: '',
              password2: '',
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                username: Yup.string().max(255).required('Username is required'),
                password1: Yup.string().max(255).required('Password is required'),
                password2: Yup.string().max(255).required('Password is required'),
              })
            }
            onSubmit={(values) => {
                props.onAuth(values.username, values.email,
                    values.password1, values.password2, props.handleMessageSnackbar);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Create new account
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Use your email to create new account
                  </Typography>
            </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  required
                  helperText={touched.username && errors.username}
                  label="Username"
                  margin="normal"
                  name="username"
                  id="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  required
                  helperText={touched.email && errors.email}
                  label="Email Address"
                  margin="normal"
                  name="email"
                  id="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password1 && errors.password1)}
                  fullWidth
                  helperText={touched.password1 && errors.password1}
                  required
                  label="Set Password"
                  margin="normal"
                  name="password1"
                  id="password1"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={showPasswords ? "text" : "password"}
                  value={values.password1}
                  variant="outlined"
                />
                <TextField
                    error={Boolean(touched.password2 && errors.password2)}
                    fullWidth
                    required
                    helperText={touched.password2 && errors.password2}
                    label="Confirm Password"
                    margin="normal"
                    name="password2"
                    id="password2"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type={showPasswords ? "text" : "password"}
                    value={values.password2}
                    variant="outlined"
                />
                <Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showPasswords}
                            onChange={() => setShowPasswords(!showPasswords)}
                            color="primary"
                        />
                    }
                    label="Show Passwords"

                />
                </Box>
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={props.loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up now
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Sign in
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
        onAuth: (username, email, password1, password2, handleMessageSnackbar) => dispatch(actions.authSignup(username, email, password1, password2, handleMessageSnackbar))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);
