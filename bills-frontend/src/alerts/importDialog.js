import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MessageAlert from './messageAlert';
import { base_url } from '../components/credentials.js';
import { DialogContentText } from '@material-ui/core';

const formats = {
    products: ['<Product Name>---<Product Rate (number only)>'],
    customers: ["<Customer's Name>---<Email ID>---<Phone Number>"]
}

function ImportDialog(props) {
    const [messageAlert, setMessageAlert] = useState(false);

    const importData = (data) => {
        axios.post(base_url + '/api/import-data/',
            {
                page: props.page,
                user: props.user['pk'],
                no: new Date().getTime(),
                dataToImport: data,
                date: new Date(),
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + props.token
                }
            }).then(response => {
                if (response.status == 201) {
                    props.handleMessageSnackbar('Data Imported!', 'success');
                    props.updateData();
                    props.handleClose();
                }
            }).catch(error => {
                console.error(error);
                props.handleMessageSnackbar(error.response.data.error, 'error');
            });
    }
    return (
        <div>
            <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Sending...'} />
            <Dialog maxWidth="sm" fullWidth={true} style={{ padding: '20px' }} open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Import</DialogTitle>
                <form autoComplete="off" onSubmit={(event) => {
                    event.preventDefault();
                    importData(event.target.body.value);
                }}>
                    <DialogContent>
                        <DialogContentText>Format: {formats[props.page]}</DialogContentText>
                        <DialogContentText>(Do not use headers)</DialogContentText>
                        <TextField
                            style={{ marginTop: '30px', marginBottom: '30px', width: '100%' }}
                            id="body"
                            label="Body"
                            required
                            multiline
                            variant="outlined"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Submit
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
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(ImportDialog);