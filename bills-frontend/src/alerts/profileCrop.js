import React, {useState, useRef} from 'react';
import AvatarEditor from 'react-avatar-editor';
import { connect } from 'react-redux';
import axios from 'axios';
import {
    Slider,Typography,
    Button,
    Dialog, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core';
import * as actions from '../store/actions/auth';
import MessageAlert from './messageAlert';
import { storage, base_url } from '../components/credentials.js';

const ProfileCrop = (props) => {

    const cropperRef = useRef();
    const [zoom, setZoom] = useState(1.2);
    const [rotate, setRotate] = useState(0);
    const [messageAlert, setMessageAlert] = useState(false);

    function dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }


    const saveProfile = async () => {
        setMessageAlert(true);
        const date_string = new Date().getTime().toString() + '.jpeg';
        const canvas = await cropperRef.current.getImage().toDataURL();
        const file = await dataURLtoFile(canvas, date_string);
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
                        setMessageAlert(false);
                        props.handleMessageSnackbar('Picture uploaded!', 'success');
                        if (props.user.avatar) {
                            let old_url = props.user.avatar;
                            old_url.includes('https://firebasestorage.googleapis.com/') && storage.refFromURL(old_url).delete();
                        }
                        props.addUser({ ...props.user, avatar: downloadURL.toString() });
                        props.handleClose();
                    }
                })
        } catch (error) {
            setMessageAlert(false);
            props.handleMessageSnackbar('Uploading failed!', 'error');
        }
    }

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Uploading...'} />
            <DialogTitle id="form-dialog-title"></DialogTitle>
                <DialogContent>
                <AvatarEditor
                    ref={cropperRef}
                    image={props.imageToCrop}
                    width={250}
                    height={250}
                    border={50}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]}
                    scale={zoom}
                    rotate={rotate}
                />
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="discrete-slider-custom" style={{ fontWeight: 500 }} color="primary" gutterBottom>
                            Zoom
                        </Typography>
                        <Slider
                            style={{width: 150}}
                            value={zoom}
                            onChange={(event, newValue) => setZoom(newValue)}
                            defaultValue={1.2}
                            valueLabelDisplay="auto"
                            min={0}
                            step={0.1}
                            max={5}
                            />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography id="discrete-slider-custom" style={{fontWeight: 500}} color="primary" gutterBottom>
                            Rotate
                        </Typography>
                        <Slider
                            style={{width: 150}}
                            value={rotate}
                            onChange={(event, newValue) => setRotate(newValue)}
                            defaultValue={0}
                            valueLabelDisplay="auto"
                            min={0}
                            step={1}
                            max={360}
                        />
                    </div>
                </div>
                </DialogContent>
                <DialogActions>
                    <Button type="submit" color="primary" onClick={saveProfile} disabled={messageAlert}>
                        Save
                    </Button>
                </DialogActions>
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

const mapDispatchToProps = dispatch => {
    return {
        addUser: (user) => dispatch(actions.addUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCrop);