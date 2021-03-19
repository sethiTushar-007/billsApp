import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import { itemRatePattern, base_url } from '../components/credentials.js';
import MessageAlert from './messageAlert';

const ItemSaveDialog = (props) => {
    const [messageAlert, setMessageAlert] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (props.itemToUpdate) {
            setError(false);
        }
    }, [props.itemToUpdate]);

    const saveItem = async (name, rate) => {
        if (name && rate) {
            setMessageAlert(true);
            
            if (props.itemToUpdate) {
                var id = props.itemToUpdate.id;
                let response = await axios.patch(base_url + '/api/item-update/' + id,
                    {
                        name,
                        rate,
                        date: new Date()
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + props.token
                        }
                    }).catch(error => {
                        setMessageAlert(false);
                        props.handleMessageSnackbar(error.response.data.name, 'error');
                    });
                if (response && response.status == 200) {
                    props.updateData();
                    setMessageAlert(false);
                    props.handleClose();
                    props.handleMessageSnackbar('Item updated', 'success');
                }
            } else {
                let no = new Date().getTime();
                let response = await axios.post(base_url + '/api/item-create/',
                    {
                        user: props.user['pk'],
                        no,
                        name,
                        rate,
                        date: new Date()
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + props.token
                        }
                    }).catch(error => {
                        setMessageAlert(false);
                        props.handleMessageSnackbar(error.response.data.name, 'error');
                    })
                if (response && response.status == 201) {
                    props.updateData();
                    setMessageAlert(false);
                    props.handleClose();
                    props.handleMessageSnackbar('Item saved', 'success');
                }
            }
        }
    }

    return (
        <div>
            <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Saving...'} />
            <Dialog open={props.open} onClose={() => {
                setError(false);
                props.handleClose();
            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new item</DialogTitle>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    setError(false);
                    saveItem(event.target.name.value, event.target.rate.value);
                }}>
                    <DialogContent>
                        {props.itemToUpdate && <div>
                            <TextField
                                style={{ margin: '10px', width: '200px', pointerEvents: 'none' }}
                                required
                                id="no"
                                type="text"
                                label="ID"
                                value={props.itemToUpdate.no}
                                readOnly
                                variant="outlined"
                            /><br/></div>
                        }
                        <TextField
                            autoFocus={props.itemToUpdate ? false : true}
                            style={{ margin: '10px', width: '200px' }}
                            required
                            defaultValue={props.itemToUpdate ? props.itemToUpdate.name : ''}
                            id="name"
                            type="text"
                            label="Name"
                            variant="outlined"
                        />
                        <br />
                        <FormControl variant="outlined" style={{ margin: '10px', width: '200px' }}>
                            <InputLabel htmlFor="rate">Rate</InputLabel>
                            <OutlinedInput
                                id="rate"
                                inputProps={{ step: '0.01' }}
                                required
                                defaultValue={props.itemToUpdate ? props.itemToUpdate.rate : ''}
                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                onChange={(event) => {
                                    if (event.target.value) {
                                        if ((event.target.value.length > 13 || !event.target.value.match(itemRatePattern))) {
                                            setError(true);
                                        } else {
                                            setError(false);
                                        }
                                    }
                                }}
                                error={error}
                                type="number"
                                helperText={error && "This value is not acceptable."}
                                labelWidth={50}
                            />
                            {error && <FormHelperText style={{ color: 'red' }} id="rate-helper-text">{'{Max10}.{Max2}'}</FormHelperText>}
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setError(false);
                            props.handleClose();
                        }} color="primary">
                            Cancel
              </Button>
                        <Button type="submit" color="primary" disabled={error}>
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
        user: state.user
    }
}

export default connect(mapStateToProps, null)(ItemSaveDialog);