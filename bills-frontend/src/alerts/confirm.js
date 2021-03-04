import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmationAlert = (props) => {
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"><span style={{fontSize: 17}}>{props.message}</span></DialogTitle>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        NO
                    </Button>
                    <Button onClick={props.handleSubmit} color="primary">
                        YES
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConfirmationAlert;