import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const LogoutAlert = (props) => {
    return (
        <div>
            <Dialog
                open={props.logoutAlertOpen}
                onClose={props.logoutDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"><span style={{ fontSize: 17 }}>Are you sure you want to logout ?</span></DialogTitle>
                <DialogActions>
                    <Button onClick={props.logoutDialog} color="primary">
                        NO
                    </Button>
                    <Button onClick={props.logout} color="primary">
                        YES
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => {
            dispatch(actions.logout());
        }
    }
}

export default connect(null, mapDispatchToProps)(LogoutAlert);