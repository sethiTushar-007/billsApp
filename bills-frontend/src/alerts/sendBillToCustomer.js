import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import dateformat from 'dateformat';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MessageAlert from './messageAlert';
import { base_url } from '../components/credentials.js';

function SendBillToCustomer(props) {
    const [messageAlert, setMessageAlert] = useState(false);

    const sendEmail = (to, subject, body) => {
        var idToMail = props.idToMail;
        setMessageAlert(true);
        props.handleClose();
        axios.post(base_url + '/api/mail-bill/',
            { idToMail, to, date: dateformat(new Date(), "dd mmm, yyyy - hh:MM:ss TT").toString(), subject, body, user: props.user.avatar_id }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' Token ' + props.token
            }
        }).then((response) => {
            setMessageAlert(false);
            if (response.status === 200) {
                props.handleMessageSnackbar(`Bill sent to ${to} !`, 'success');
            }
        }).catch((error) => {
            setMessageAlert(false);
            props.handleMessageSnackbar('Email failed!', 'error');
        })

	}
    return (
        <div>
            <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Sending...'} />
            <Dialog style={{ padding: '20px' }} open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Email (Bill is attached to this mail)</DialogTitle>
                <form autoComplete="off" onSubmit={(event) => {
                    event.preventDefault();
                    sendEmail(event.target.mailTo.value, event.target.subject.value, event.target.body.value);
                }}>
                    <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TextField
                                    style={{ width: '500px' }}
                                    readOnly
                                    value={props.user.email_smtp}
                                    type="email"
                                    label="From"
                                    variant="outlined"
                                />
                                <TextField
                                    style={{ width: '500px', marginLeft: '10px' }}
                                    required
                                    id="mailTo"
                                    defaultValue={props.mailTo}
                                    type="email"
                                    label="To"
                                    variant="outlined"
                                />
                            </div>
                            <TextField
                                style={{ marginTop: '30px', width: '100%' }}
                                required
                                id="subject"
                                defaultValue={props.user.default_subject}
                                type="text"
                                label="Subject"
                                variant="outlined"
                            />
                            <TextField
                                style={{ marginTop: '30px', marginBottom: '30px', width: '100%' }}
                                id="body"
                                label="Body"
                                required
                                defaultValue={props.user.default_body}
                                placeholder="Type..."
                                multiline
                                variant="outlined"
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.handleClose} color="primary">
                            Cancel
              </Button>
                        <Button type="submit" color="primary">
                            Send
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

export default connect(mapStateToProps, null)(SendBillToCustomer);