import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import fileDownload from 'js-file-download';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    X as ClearIcon, Download as DownloadIcon,
} from 'react-feather';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { base_url, allowedExtensionsForFile, iconsSize } from '../../components/credentials.js';
import './styles.css';

const filesExtensionsMessage = "Only .xlsx,.xls,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx,.txt,.pdf files are allowed.";

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

const FileUpload = (props) => {
    const classes = useStyles();
    const token = localStorage.getItem('token');

    const [anchorEl, setAnchorEl] = useState(null);
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const [documents, setDocuments] = useState([]);
    const [progress, setProgress] = useState(false);

    useEffect(() => {
        setDocuments(props.documents);
    }, [props.documents]);

    const handleFileChange = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.jpeg, .jpg, .png, .xlsx, .xls, .doc, .docx, .ppt, .pptx, .txt, .pdf');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];
            if (!allowedExtensionsForFile.exec(file.name)) {
                props.handleMessageSnackbar("Invalid file !", "error");
                return;
            } else {
                setProgress(true);
                /*
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => console.log(reader.result);
                */
                const date_string = new Date().getTime();
                const fileName = date_string + '_' + file.name;
                let formData = new FormData();
                formData.append('userid', props.user.avatar_no);
                formData.append('fileName', fileName);
                formData.append('file', file);
                axios.post(base_url + '/api/document-upload/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': ' Token ' + token
                    }
                }).then(response => {
                    let docs = documents;
                    props.updateDocuments([{ 'url': response.data['url'], 'name': fileName }, ...docs])
                    setProgress(false);
                })
                    .catch(error => {
                        console.error(error);
                        setProgress(false);
                    })
            }
            
        }
    }

    const handleDownload = (name, url) => {
        axios.get(base_url + '/api/document-download/', {
            params: {
                'url': url
            },
            responseType: 'blob',
            headers: {
                'Authorization': ' Token ' + token,
            }
        }).then(res => {
            fileDownload(res.data, name);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleRemoveFile = async (name, url, idx) => {
        if (url.includes('/saved/' + props.user.avatar_no)) {
            let rem = props.removedDocuments;
            props.updateRemovedDocuments([name, ...rem]);
            let docs = documents;
            let del = await docs.splice(idx, 1);
            props.updateDocuments([...docs]);
        } else {
            axios.post(base_url + '/api/document-delete/', { 'names': [name], 'userid': props.user.avatar_no }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token
                }
            }).then(async (response) => {
                let docs = documents;
                let del = await docs.splice(idx, 1);
                props.updateDocuments([...docs]);
            }).catch(error => console.error(error));
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <Typography>{filesExtensionsMessage}</Typography>
            </Popover>
            <div style={{ display: 'flex', padding: 18, background: '#f8f9fa', justifyContent: 'space-between', alignItems: 'center' }}
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}>
                <div>
                    <label className="file-label" onClick={handleFileChange}>
                        Select File...
                    </label>
                </div>
                {progress ? <div><CircularProgress size="1.3rem" color="secondary" /></div> :
                    <span style={{ opacity: 0.45, fontFamily: 'roboto' }}>Select documents to upload</span>
                }
            </div>
            <div style={{ paddingLeft: 5, display: 'flex', flexDirection: 'column', marginTop: 10, background: '#f8f9fa' }}>
                {documents.map((document, idx) =>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Download" onClick={() => handleDownload(document.name, document.url)}>
                                <IconButton aria-label="download">
                                    <DownloadIcon size={iconsSize} />
                                </IconButton>
                            </Tooltip>
                            <a style={{ textDecoration: 'none', color: '#000', opacity: '0.8', fontFamily: 'roboto' }} href={base_url + document.url} target="_blank">{document.name}</a>
                        </div>
                        <Tooltip title="Remove" onClick={() => handleRemoveFile(document.name, document.url, idx)}>
                            <IconButton aria-label="remove">
                                <ClearIcon size={iconsSize} />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
                
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error,
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(FileUpload);