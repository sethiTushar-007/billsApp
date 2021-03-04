import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import * as actions from '../../../store/actions/auth';
import { default_avatar, base_url, storage, allowedExtensionsForImage } from '../../../components/credentials';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100,
  }
}));

const Profile = (props) => {
    const classes = useStyles();

    const handleUploadPicture = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.jpeg, .jpg, .png');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            if (!allowedExtensionsForImage.exec(file.name)) {
                props.handleMessageSnackbar("Invalid file !", "error");
            } else {
                props.handleMessageSnackbar('Uploading...');
                const date_string = new Date().getTime().toString() + '.jpeg';
                try {
                    storage.ref('/images/user-avatars/' + date_string).put(file)
                        .then(async snapshot => {
                            const downloadURL = await storage.ref("images/user-avatars/").child(date_string).getDownloadURL();
                            let response = await axios.patch(base_url + '/api/userinfo-update/' + props.user.avatar_id,
                                {
                                    avatar: downloadURL.toString()
                                },
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': ' Token ' + props.token
                                    }
                                }
                            );
                            if (response.status == 200) {
                                props.handleMessageSnackbar('Picture uploaded!', 'success');
                                if (props.user.avatar) {
                                    let old_url = props.user.avatar;
                                    storage.refFromURL(old_url).delete();
                                }
                                props.addUser({ ...props.user, avatar: downloadURL.toString() });
                            }
                        })
                } catch (error) {
                    props.handleMessageSnackbar('Uploading failed!', 'error');
                }
            }
        }
    }
    const handleRemovePicture = async () => {
        let old_url = props.user.avatar;
        let response = await axios.patch(base_url + '/api/userinfo-update/' + props.user.avatar_id,
            {
                avatar: null
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + props.token
                }
            }
        );
        if (response.status == 200) {
            storage.refFromURL(old_url).delete();
            props.addUser({ ...props.user, avatar: null });
        }
    }

  return (
    <Card
      className={clsx(classes.root, props.className)}
      {...props}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
              >

                  <Avatar
                      className={classes.avatar}
                      src={props.user.avatar || default_avatar}
                  >

                  </Avatar>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {props.user.username}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
          <CardActions>
              {props.user.avatar ?
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Button
                          color="primary"
                          fullWidth
                          variant="text"
                          onClick={handleRemovePicture}
                      >
                          Remove picture
                        </Button>
                      <Button
                          color="primary"
                          fullWidth
                          variant="text"
                          onClick={handleUploadPicture}
                      >
                          Upload picture
                        </Button>
                  </div>
                  :
                  <Button
                      color="primary"
                      fullWidth
                      variant="text"
                      onClick={handleUploadPicture}
                  >
                      Upload picture
                    </Button>
}
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
