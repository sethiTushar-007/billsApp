import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const MessageAlert = (props) => {
    return (
        <Snackbar
            open={props.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            onClose={props.handleClose}
            message={props.message}/>
    );
}
export default MessageAlert;