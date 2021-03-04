import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Dialog, DialogContent, DialogActions, DialogTitle,
    Typography,
    TextField,
    makeStyles
} from '@material-ui/core';
import MessageAlert from './messageAlert';
import { base_url, default_avatar, storage, allowedExtensionsForImage } from '../components/credentials.js';

const NewCustomerDialog = (props) => {
    const [messageAlert, setMessageAlert] = useState(false);

    const [file, setFile] = useState(null);
    const [src, setSrc] = useState(null);

    const uploadAvatar = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.jpg, .jpeg, .png');
        input.click();
        input.onchange = async () => {
            let f = input.files[0];
            if (!allowedExtensionsForImage.exec(f.name)) {
                props.handleMessageSnackbar("Invalid file !", "error");
            } else {
                setFile(f);
                setSrc(URL.createObjectURL(f));
            }
        }
    }
    const removeAvatar = () => {
        setFile(null);
        setSrc(null);
    }


    const saveCustomer = async (name, email, phone) => {
        setMessageAlert(true);
        props.handleClose();
        if (file) {
            const date_string = new Date().getTime().toString() + '.jpeg';
            storage.ref('/images/customer-avatars/' + date_string).put(file)
                .then(async snapshot => {
                    const downloadURL = await storage.ref("images/customer-avatars/").child(date_string).getDownloadURL();
                    let response = await axios.post(base_url + '/api/customer-create/',
                        {
                            user: props.user['pk'],
                            no: new Date().getTime(),
                            name: name,
                            date: new Date(),
                            avatar: downloadURL.toString(),
                            email: email,
                            phone: phone
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': ' Token ' + props.token
                            }
                        });
                    if (response.status == 201) {
                        setFile(null);
                        setSrc(null);
                        props.updateData();
                        setMessageAlert(false);
                        props.handleMessageSnackbar('Customer saved!', 'success');
                    }
                })

        } else {
            let response = await axios.post(base_url + '/api/customer-create/',
                {
                    user: props.user['pk'],
                    no: new Date().getTime(),
                    name: name,
                    date: new Date(),
                    avatar: null,
                    email: email,
                    phone: phone
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + props.token
                    }
                });
            if (response.status==201) {
                setFile(null);
                setSrc(null);
                props.updateData();
                setMessageAlert(false);
                props.handleMessageSnackbar('Customer saved!', 'success');
            }
        }
        }
        return (
            <div>
                <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Saving...'} />
                <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add new Customer</DialogTitle>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        saveCustomer(event.target.name.value, event.target.mail.value, event.target.phone.value);
                    }}>
                        <DialogContent>
                            <CardContent>
                                <Box
                                    alignItems="center"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Avatar
                                        style={{ width: 100, height: 100 }}
                                        src={src || default_avatar}
                                    />
                                </Box>
                                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                                {src ?
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <Button
                                            onClick={removeAvatar}
                                            color="primary"
                                            fullWidth
                                            variant="text"
                                        >
                                            Remove picture
                                </Button>
                                        <Button
                                            color="primary"
                                            fullWidth
                                            onClick={uploadAvatar}
                                            variant="text"
                                        >
                                            Change picture
                        </Button>
                                    </div>
                                    :
                                    <Button
                                        color="primary"
                                        fullWidth
                                        onClick={uploadAvatar}
                                        variant="text"
                                    >
                                        Select picture
                        </Button>}
                                <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                            </CardContent>
                            <TextField
                                autoFocus={!props.customerToUpdate}
                                style={{ margin: '10px', width: '300px' }}
                                required
                                defaultValue={props.customerName}
                                id="name"
                                type="text"
                                label="Name"
                                variant="outlined"
                            />
                            <br />
                            <TextField
                                style={{ margin: '10px', width: '300px' }}
                                id="mail"
                                type="email"
                                label="Email"
                                variant="outlined"
                            />
                            <br />
                            <TextField
                                style={{ margin: '10px', width: '300px' }}
                                id="phone"
                                type="number"
                                label="Phone No."
                                variant="outlined"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={props.handleClose} color="primary">
                                Cancel
              </Button>
                            <Button type="submit" color="primary">
                                Save
              </Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        loading: state.loading,
        error: state.error,
        user: state.user
    }
}

export default connect(mapStateToProps, null)(NewCustomerDialog);