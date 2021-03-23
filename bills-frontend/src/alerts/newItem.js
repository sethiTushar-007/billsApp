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
import { itemRatePattern, base_url } from '../components/credentials.js';
import MessageAlert from './messageAlert';

const ItemSaveDialog = (props) => {
    const [messageAlert, setMessageAlert] = useState(false);
    const [rate, setRate] = useState('0');

    useEffect(() => {
        if (props.open) {
            if (props.itemToUpdate) {
                setRate(props.itemToUpdate.rate);
            } else {
                setRate('0');
            }
        }
    }, [props.open]);

    const saveItem = async (name, rate) => {
        if (name && rate) {
            setMessageAlert(true);
            
            if (props.itemToUpdate) {
                var id = props.itemToUpdate.id;
                let response = await axios.patch(base_url + '/api/item-update/' + id,
                    {
                        user: props.user['pk'],
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
                        status: 'save',
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
                props.handleClose();
            }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new item</DialogTitle>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    saveItem(event.target.name.value, rate);
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
                                value={rate}
                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                onChange={(event) => {
                                    let r = event.target.value;
                                    if (r) {
                                        if (r.length <= itemRatePattern.maxLength && r.match(itemRatePattern.pattern)) {
                                            if (Number(r) >= 0 && Number(r) < 1) {
                                                setRate(r);
                                            } else if (Number(r) >= 1) {
                                                setRate(r[0] === '0' ? r.slice(1, r.length) : r);
                                            }
                                        }
                                    } else {
                                        setRate('0');
                                    }
                                }}
                                type="number"
                                labelWidth={50}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            props.handleClose();
                        }} color="primary">
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
        user: state.user
    }
}

export default connect(mapStateToProps, null)(ItemSaveDialog);