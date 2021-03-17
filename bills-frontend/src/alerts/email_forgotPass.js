import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MessageAlert from './messageAlert';
import { base_url } from '../components/credentials.js';

const EmailForgotPass = (props) => {
    const [messageAlert, setMessageAlert] = useState(false);

    return (
        <div>
            <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Saving...'} />
            <Dialog open={props.open} onClose={() => {
                props.handleClose();
            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Enter registered Email for Password Reset link</DialogTitle>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={
                        Yup.object().shape({
                            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),})
                    }
                    onSubmit={async (values) => {
                        let response = await axios.post(base_url + '/api/send-password-reset-email/', {
                            email: values.email,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        if (response && response.status == 200) {
                            props.handleMessageSnackbar('Password Reset link sent !', 'success');
                            props.handleClose();
                        } else {
                            props.handleMessageSnackbar('Error!', 'error');
                            props.handleClose();
                        }
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
                                <DialogContent>
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
                                </DialogContent>
                                <DialogActions>
                                    <Button type="submit" color="primary">
                                        Submit
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                </Formik>
            </Dialog>
        </div>
    );
}

export default EmailForgotPass;