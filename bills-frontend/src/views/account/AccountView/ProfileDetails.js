import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import { base_url } from '../../../components/credentials';
import * as actions from '../../../store/actions/auth';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [username, setUsername] = useState(props.user.username);

    const handleSaveDetails = async (event) => {
        event.preventDefault();
        let response = await axios.patch(base_url + '/rest-auth/user/',
            { username: username },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + props.token
                }
            }
        ).catch(error => {
            props.handleMessageSnackbar((error.response.data['username'] && error.response.data['username'][0]) || 'Error!', 'error');
        })
        if (response && response.status == 200) {
            props.handleMessageSnackbar('Username updated!', 'success');
            props.addUser({ ...props.user, username: username });
        } else {
            console.log(response);
        }
    }

  return (
    <form
      autoComplete="off"
      onSubmit={handleSaveDetails}
      noValidate
      className={clsx(classes.root, props.className)}
      {...props}
    >
      <Card>
        <CardHeader
          title="Profile"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Username"
                id="username"
                name="username"
                onChange={(event) => setUsername(event.target.value)}
                required
                value={username}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
            <TextField
                style={{pointerEvents: 'none'}}
                fullWidth
                label="Email Address"
                name="email"
                readOnly
                value={props.user.email}
                variant="outlined"
              />
            </Grid>
            </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
        <Button
            type='submit'
            color="primary"
            variant="contained"
          >
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
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
        addUser: (user) => dispatch(actions.addUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetails);
