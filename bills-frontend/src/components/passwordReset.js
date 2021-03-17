import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormHelperText,
    Link,
    TextField,
    Typography,
    makeStyles
} from '@material-ui/core';
import { base_url } from './credentials.js';
import NotFoundView from '../views/errors/NotFoundView.js';
import Page from './Page';

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

const PasswordResetPage = (props) => {
    const classes = useStyles();
    const history = useHistory();

    const location = useLocation();
    const [isError, setIsError] = useState(false);

    const [uid, setUID] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(async () => {
        let query = queryString.parse(location.search);
        let response = await axios.post(base_url + '/api/reset-password-check/', {
            'username': query.user,
            'key': query.key
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(error => console.log(error));
        if (response && response.status == 200) {
            console.log(response.data);
            setUID(response.data['uid']);
            setToken(response.data['key']);
        } else {
            setIsError(true);
        }
    }, []);

    return (
        <div style={{height: '100%'}}>
        { isError ? <NotFoundView/> :
    <Page
        className={classes.root}
        title="Reset Password"
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
                        password1: '',
                        password2: '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            password1: Yup.string().max(255).required('Password is required'),
                            password2: Yup.string().max(255).required('Password is required'),
                        })
                    }
                    onSubmit={async (values, { setSubmitting }) => {
                        let response = await axios.post(base_url + '/api/password-update/', {
                            uid: uid,
                            password: values.password1
                        },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': ' Token ' + token
                                }
                            }).catch(error => console.error(error));
                        if (response && response.status == 200) {
                            props.handleMessageSnackbar('Password updated!', 'success');
                            history.push('/login');
                        }
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
                                        Reset Password
                                        </Typography>
                                </Box>
                                <TextField
                                    error={Boolean(touched.password1 && errors.password1)}
                                    fullWidth
                                    helperText={touched.password1 && errors.password1}
                                    required
                                    label="Set New Password"
                                    margin="normal"
                                    name="password1"
                                    id="password1"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="password"
                                    value={values.password1}
                                    variant="outlined"
                                />
                                <TextField
                                    error={Boolean(touched.password2 && errors.password2)}
                                    fullWidth
                                    required
                                    helperText={touched.password2 && errors.password2}
                                    label="Confirm New Password"
                                    margin="normal"
                                    name="password2"
                                    id="password2"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type="password"
                                    value={values.password2}
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
                                        Submit
                                    </Button>
                                </Box>
                            </form>
                        )}
                </Formik>
            </Container>
        </Box>
    </Page>
}
        </div>
    );
};

export default PasswordResetPage;
