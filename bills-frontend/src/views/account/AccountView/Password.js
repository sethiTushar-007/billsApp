import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,Checkbox,
  CardHeader,
  Divider,
  TextField,Typography,
  makeStyles
} from '@material-ui/core';
import * as actions from '../../../store/actions/auth';
import { base_url } from '../../../components/credentials';

const useStyles = makeStyles(({
  root: {}
}));

const Password = (props) => {
    const classes = useStyles();

    const [showPasswords, setShowPasswords] = useState(false);

  const [values, setValues] = useState({
    password: '',
    confirm: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

    const handleUpdatePassword = async (event) => {
        event.preventDefault();
        if (values.password === values.confirm) {
            let response = await axios.post(base_url + '/api/password-update/', {
                uid: props.user.pk,
                password: values.password
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + props.token
                    }
                }).catch(error => props.handleMessageSnackbar(error.response.data.error[0],'error'));
            if (response && response.status == 200) {
                props.handleMessageSnackbar('Password updated!', 'success');
                props.logout();
            }
        } else {
            props.handleMessageSnackbar('Passwords do not match!', 'error');
        }
    }

  return (
      <form
          onSubmit={handleUpdatePassword}
          className={clsx(classes.root, props.className)}
          {...props}
    >
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            required
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type={showPasswords ? "text" : "password"}
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            required
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type={showPasswords ? "text" : "password"}
            value={values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="space-between"
          p={2}
        >
            <Box
                alignItems="center"
                display="flex"
                ml={-1}
            >
                <Checkbox
                    checked={showPasswords}
                    onChange={() => setShowPasswords(!showPasswords)}
                />
                <Typography
                    color="textSecondary"
                    variant="body1"
                >
                    Show Passwords
            </Typography>
            </Box>
          <Button
            color="primary"
            variant="contained"
            type='submit'
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        token: state.token,
        loading: state.loading,
        error: state.error,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(actions.logout());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Password);
