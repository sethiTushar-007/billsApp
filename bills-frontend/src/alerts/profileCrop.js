import React, {useState} from 'react';
import AvatarEditor from 'react-avatar-editor';
import {
    Slider,Typography,
    Button,
    Dialog, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core';
const ProfileCrop = (props) => {

    const [zoom, setZoom] = useState(1.2);
    const [rotate, setRotate] = useState(0);

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title"></DialogTitle>
                <DialogContent>
                <AvatarEditor
                    image='https://firebasestorage.googleapis.com/v0/b/firstreactapp-f0586.appspot.com/o/DSC06980.JPG?alt=media&token=d93e187d-507b-43fa-8f8c-b97c6ee55194'
                    width={250}
                    height={250}
                    border={50}
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
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        Save
                    </Button>
                </DialogActions>
        </Dialog>
    );
}
export default ProfileCrop;