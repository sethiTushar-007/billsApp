import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Parse from 'html-react-parser';
import Quill from 'quill';
import 'react-quill/dist/quill.snow.css';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import match from 'autosuggest-highlight/match';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import 'date-fns';
import dateformat from 'dateformat';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
    Edit2 as EditIcon, X as ClearIcon, Plus as AddIcon
} from 'react-feather';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import './styles.css';
import ItemsTable from './ItemsTable';
import TotalTable from './totalTable';
import { base_url, itemQuantityPattern, cleanQuillText, storage, iconsSize } from '../../components/credentials.js';
import PrintPage from './Print/print';
import FileUpload from './FileUpload';
import ConfirmationAlert from '../confirm';
import NewCustomerDialog from '../newCustomer';
const filter = createFilterOptions();

const useStyles1 = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));
const useStyles2 = makeStyles((theme) => ({
    formControl: {
        minWidth: 300,
    },
    selectEmpty: {
        marginTop: theme.spacing(4),
    },
}));

const roundToTwo = (num) => {
    return +(Math.round(num + "e+2") + "e-2");
}

const NewBillDialog = (props) => {
    const classes1 = useStyles1();
    const classes2 = useStyles2();
    const token = props.token;
    const history = useHistory();
    const [invalidBill, setInvalidBill] = useState(false);

    var printPageRef = useRef();

    const [removedDocuments, setRemovedDocuments] = useState([]);

    const [dataToPrint, setDataToPrint] = useState(null);

    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [messageInAlert, setMessageInAlert] = useState('');

    const handleConfirmAlert = (message = '') => {
        setMessageInAlert(message);
        setOpenConfirmAlert(!openConfirmAlert);
    }

    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const handleCustomerOpen = () => {
        setOpenCustomerDialog(!openCustomerDialog);
    }

    const [isPrintSelected, setIsPrintSelected] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [billNo, setBillNo] = useState('');
    const [billId, setBillId] = useState('');
    const [date, setDate] = useState(null);

    const [documents, setDocuments] = useState([]);

    const [customer, setCustomer] = useState(null);
    const [allCustomersInSelect, setAllCustomersInSelect] = useState([]);

    const [remarks, setRemarks] = useState(null);

    const [allItemsInSelect, setAllItemsInSelect] = useState([]);
    const [inputItem, setInputItem] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const [quantity, setQuantity] = useState('0');

    const [finalItems, setFinalItems] = useState([]);

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const [errorQuantity, setErrorQuantity] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => printPageRef.current,
        documentTitle: 'bill_id_' + billId,
    });

    var quill = null;
    const quillImageCallBack = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
            const file = input.files[0];

            const date_string = new Date().getTime().toString() + '.jpeg';
            storage.ref('/images/text-editor/' + date_string).put(file)
                .then(async snapshot => {
                    const downloadURL = await storage.ref("images/text-editor").child(date_string).getDownloadURL();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', downloadURL);
                })
        }
    }

    const initializeQuill = () => {
        quill = new Quill('#editor', {
            theme: 'snow',
            defaultValue: '<p></p>',
            modules: {
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false]}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'size': [] }],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link', 'image'],
                        ['clean'], ['code-block']
                    ],
                    handlers: {
                        'image': () => quillImageCallBack()
                    }
                }
            }
        });
    }

    useEffect(() => {
        if (props.billData) {
            fetch(base_url + "/api/bill-get/?user=" + props.user['pk'] + "&no=" + props['billData'],
                {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token,
                    }
                }).then(response => response.json())
                .then(async data => {
                    setDataToPrint(null);
                    try {
                        if (data.length !== 0) {
                            setBillNo(data[0]['id']);
                            setBillId(data[0]['no']);
                            setCustomer({ name: data[0]['customer_name'], email: data[0]['customer_email'] });
                            setDate(data[0]['date']);
                            setDocuments(data[0]['documents']);
                            setRemarks(data[0]['remarks']['data']);
                            setFinalItems([...data[0]['items']]);
                            setTotalAmount(data[0]['amount']);
                            setInvalidBill(false);
                            initializeQuill();
                        } else {
                            setInvalidBill(true);
                        }
                    } catch (error) {
                        console.error(error);
                        setInvalidBill(true);
                    }
                });
        } else {
            setRemarks("<p></p>");
            setDocuments([]);
            setBillId(new Date().getTime());
            window.setTimeout(() => {
                initializeQuill();
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (inputItem) {
            fetch(base_url + "/api/item-get/?user=" + props.user['pk'] + "&ordering=name&search="+inputItem,
                {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token,
                    }
                }).then(response => response.json())
                .then(data => {
                    try {
                        setAllItemsInSelect(data);
                    } catch (error) {
                        console.error(error);
                    }
                });
        }
    }, [inputItem]);

    const addCustomersInList = () => {
        if (customer) {
            if (customer.name) {
                fetch(base_url + "/api/customer-get/?user=" + props.user['pk'] + "&search=" + customer.name,
                    {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + token,
                        }
                    }).then(response => response.json())
                    .then(data => {
                        try {
                            setAllCustomersInSelect(data);
                        } catch (error) {
                            console.error(error);
                        }
                    });
            } else {
                setCustomer(null);
            }
        } else {
            setAllCustomersInSelect([]);
        }
    }

    useEffect(() => {
        addCustomersInList();
    }, [customer]);

    useEffect(() => {
        (!selectedItem && setQuantity('0'));
        (errorQuantity && setQuantity('0'));
    }, [selectedItem]);

    useEffect(() => {
        (quantity ? ((!quantity.match(itemQuantityPattern)) ? setErrorQuantity(true) : setErrorQuantity(false)) : setErrorQuantity(false));
    }, [quantity]);


    const updateList = (newList) => {
        setFinalItems(newList);
    }

    const saveBillInitiated = (event) => {
        event.preventDefault();
        saveBill();
    }

    const saveBill = async () => {
        let del_docs = [];
        var new_documents = await documents.map((value) => {
            if (value.url.includes('/unsaved/' + props.user.avatar_no)) {
                del_docs.push(value.name);
                return { 'name': value.name, 'url': value.url.replace("/unsaved/", "/saved/") }
            } else {
                return value
            }
        });
        if (del_docs.length > 0) {
            let response = await axios.post(base_url + '/api/document-save/', { 'names': del_docs, 'userid': props.user.avatar_no }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token
                }
            });
        }
        if (removedDocuments.length > 0) {
            let response = await axios.post(base_url + '/api/document-delete/', { 'names': removedDocuments, 'userid': props.user.avatar_no }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token
                }
            });
        }
        var items_id = await finalItems.map((obj) => obj.no);
        items_id.sort();
        const rmk = await cleanQuillText(document.getElementById('editor').innerHTML);
        if (!customer) {
            props.handleMessageSnackbar("Customer's Name should not be empty.", 'error');
            return;
        }
        if (props.billData) {
            axios.patch(base_url + '/api/bill-update/'+billNo,
                {
                    date: new Date(),
                    customer_name: customer.name,
                    customer_email: customer.email,
                    remarks: { "data": rmk },
                    documents: new_documents,
                    items_id: items_id,
                    items: finalItems,
                    amount: totalAmount,
                    quantity: totalQuantity
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token
                    }
                }).then(response => {
                    if (isPrintSelected) {
                        setDataToPrint({
                            customerName: customer.name,
                            items: finalItems,
                            remarks: rmk,
                            amount: roundToTwo(Number(totalAmount)),
                            date: dateformat(new Date(), "dd mmm, yyyy - hh:MM:ss TT").toString(),
                            quantity: totalQuantity,
                            no: billNo
                        });
                        handlePrint();
                    }
                    props.handleMessageSnackbar('Bill updated!', 'success');
                    props.updateData();
                    props.handleClose();
                })
                .catch(error => console.error(error));
        } else {
            axios.post(base_url + '/api/bill-create/',
                {
                    user: props.user['pk'],
                    no: billId,
                    date: new Date(),
                    customer_name: customer.name,
                    customer_email: customer.email,
                    documents: new_documents,
                    remarks: { "data": rmk },
                    items_id: items_id,
                    items: finalItems,
                    amount: totalAmount,
                    quantity: totalQuantity
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token
                    }
                }).then(response => {
                    if (isPrintSelected) {
                        setDataToPrint({
                            customerName: customer.name,
                            items: finalItems,
                            remarks: rmk,
                            amount: roundToTwo(Number(totalAmount)),
                            date: dateformat(new Date(), "dd mmm, yyyy - hh:MM:ss TT").toString(),
                            quantity: totalQuantity,
                            no: response['data']['id']
                        });
                        handlePrint();
                    }
                    props.handleMessageSnackbar('Bill saved!', 'success');
                    props.updateData();
                    props.handleClose();
                }).catch(error => console.error(error));
        }
    }

    const deleteBill = () => {
        handleConfirmAlert();
        axios.post(base_url + '/api/bill-delete/',
            {
                'userid': props.user.avatar_no,
                'ids': [Number(billNo)]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token
                }
            }).then(response => {
                props.updateData();
                props.handleMessageSnackbar('Bill deleted!', 'success');
                props.handleClose();
            }).catch(error => console.error(error));
    }

    const addItem = (event) => {
        event.preventDefault();
        let finalItems1 = finalItems;
        var ind = finalItems1.findIndex(value => value.no === selectedItem['no']);
        const amt = Number(selectedItem['rate']) * Number(quantity);
        if (ind === -1) {
            setFinalItems([{ name: selectedItem['name'], no: selectedItem['no'], rate: selectedItem['rate'], quantity, amount: roundToTwo(amt) }, ...finalItems1]);
        } else {
            let new_quan = (Number(finalItems1[ind]['quantity']) + Number(quantity)).toString();
            let new_amount = roundToTwo(Number(finalItems1[ind]['amount']) + Number(amt));
            finalItems1.splice(ind, 1);
            setFinalItems([{ name: selectedItem['name'], no: selectedItem['no'], rate: selectedItem['rate'], quantity: new_quan, amount: new_amount }, ...finalItems1]);
        }
        setSelectedItem(null);
        setQuantity('0');
    }
    const updateItem = (event) => {
        event.preventDefault();
        let finalItems1 = finalItems;
        var ind = finalItems1.findIndex(value => value.no === currentItem['no']);
        let amt = roundToTwo(Number(selectedItem['rate']) * Number(quantity));
        finalItems1.splice(ind, 1);
        setFinalItems([{ name: currentItem['name'], no: currentItem['no'], rate: currentItem['rate'], quantity, amount: amt }, ...finalItems1]);
        setSelectedItem(null);
        setCurrentItem(null);
        setQuantity('0');
    }

    const manageUpdate = (row) => {
        setCurrentItem(row);
        setSelectedItem({no: row.no, name: row.name, rate: row.rate });
        setQuantity(row.quantity);
    }

    return (
        <div>
            <Dialog
                maxWidth={'lg'}
                fullWidth
                open={props.open}
                onClose={props.handleClose}
                scroll='body'
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <div style={{ background: '#F4F6F8', paddingLeft: 10, paddingRight: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <DialogTitle id="alert-dialog-title">{props.billData ? 'Update Bill' : 'Create Bill'}</DialogTitle>
                    <Tooltip title="Clear">
                        <IconButton aria-label="clear" onClick={() => {
                            props.handleClose();
                        }}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </div>
                <DialogContent>
                    <div style={{ padding: '20px 30px'}}>
                        {invalidBill ? <div>No bill found. Try with accurate bill id.</div> :
                            <div>
                                {dataToPrint &&
                                    <div style={{ overflow: 'hidden', height: 0 }}>
                                        <PrintPage
                                            ref={printPageRef}
                                            dataToPrint={dataToPrint}
                                        />
                                    </div>}
                                {messageInAlert &&
                                    <ConfirmationAlert open={openConfirmAlert} handleClose={() => handleConfirmAlert()} handleSubmit={deleteBill} message={messageInAlert} />
                                }
                                {openCustomerDialog && < NewCustomerDialog open={openCustomerDialog} handleClose={handleCustomerOpen} customerName={(customer && customer.name) && customer.name} handleMessageSnackbar={props.handleMessageSnackbar} updateData={() => setCustomer(null)} />}
                                <form id="billform" onSubmit={saveBillInitiated} style={{ marginTop: 10, marginBottom: 30 }} enctype="multipart/form-data">
                                    <div className="no-date">
                                        {props.billData &&
                                            <TextField
                                                style={{ width: '170px', margin: '20px', pointerEvents: 'none' }}
                                                disabled={!props.billData}
                                                readOnly
                                                value={billNo}
                                                id="outlined-required-billno"
                                                label="Bill Number"
                                                variant="outlined"
                                            />}
                                        <TextField
                                            style={{ width: '170px', margin: '20px', pointerEvents: 'none' }}
                                            required
                                            readonly
                                            value={billId}
                                            id="outlined-required-billid"
                                            label="Bill ID"
                                            variant="outlined"
                                        />
                                        <Autocomplete
                                            value={customer}
                                            required
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'string') {
                                                    setCustomer({ name: newValue });
                                                } else if (newValue && newValue.inputValue) {
                                                    setCustomer({ name: newValue.inputValue });
                                                    handleCustomerOpen();
                                                } else {
                                                    setCustomer(newValue);
                                                }
                                            }}
                                            autoHighlight
                                            onInputChange={((event, newInputValue) => setCustomer({ name: newInputValue }))}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);

                                                // Suggest the creation of a new value
                                                if (customer && customer.name !== undefined) {
                                                    if (allCustomersInSelect.length === 0) {
                                                        filtered.push({
                                                            inputValue: customer.name,
                                                            name: `Add "${customer.name}"`,
                                                        });
                                                    }
                                                }

                                                return filtered;
                                            }}
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            id="customer-name"
                                            options={customer ? allCustomersInSelect : []}
                                            getOptionLabel={(option) => {
                                                // Value selected with enter, right from the input
                                                if (typeof option === 'string') {
                                                    return option;
                                                }
                                                // Add "xxx" option created dynamically
                                                if (option.inputValue) {
                                                    return option.inputValue;
                                                }
                                                // Regular option
                                                return option.name;
                                            }}
                                            renderOption={(option) => {
                                                return (
                                                    <span style={{ fontWeight: 400 }}>{option.name} {option.email && `<${option.email}>`}</span> 
                                                );
                                            }}
                                            style={{ width: 300, margin: 20 }}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField {...params} label="Customer's Name" variant="outlined" />
                                            )}
                                        />
                                        {props.billData &&
                                            <TextField
                                                style={{ width: '230px', margin: '20px', pointerEvents: 'none' }}
                                                required
                                                readonly
                                                value={dateformat(date, "dd mmm, yyyy - hh:MM:ss TT")}
                                                id="outlined-required-date"
                                                label="Last Updated"
                                                variant="outlined"
                                            />}
                                    </div>
                                </form>
                                <hr />
                                <form className="item-form" onSubmit={currentItem ? updateItem : addItem}>
                                    <div style={{ margin: '10px', paddingLeft: '25px', paddingRight: '25px' }}>
                                        {currentItem ?
                                            <TextField
                                                required
                                                style={{ width: "400px" }}
                                                id="outlined-required-selected"
                                                value={currentItem.name + ' - ' + currentItem.no}
                                                readOnly
                                                label="Item"
                                                variant="outlined"
                                            /> :

                                            <Autocomplete
                                                id="highlights-demo"
                                                style={{ width: '400px' }}
                                                required
                                                autoHighlight
                                                onChange={(event, value) => setSelectedItem(value)}
                                                onInputChange={(event, newInputValue) => setInputItem(newInputValue)}
                                                options={inputItem ? allItemsInSelect : []}
                                                value={selectedItem}
                                                getOptionSelected={(option, value) => option.no === value.no}
                                                getOptionLabel={(option) => option.name + ' - ' + option.no}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Item" variant="outlined" />
                                                )}
                                                renderOption={(option, { inputValue }) => {
                                                    const matches = match(option.name + ' - ' + option.no, inputValue);
                                                    const parts = parse(option.name + ' - ' + option.no, matches);
                                                    return (
                                                        <div>
                                                            {parts.map((part, index) => (
                                                                <span key={index} value={part} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                                                    {part.text}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        }
                                    </div>
                                    <FormControl style={{ margin: '10px', width: '150px' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-amount">Rate</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-rate"
                                            startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                            labelWidth={40}
                                            value={currentItem ? currentItem.rate : (selectedItem ? selectedItem.rate : '0')}
                                            readOnly
                                        />
                                    </FormControl>
                                    <TextField
                                        style={{ margin: '10px', width: '150px' }}
                                        required
                                        value={quantity}
                                        disabled={!currentItem && !selectedItem}
                                        defaultValue='0'
                                        onChange={(event) => setQuantity(event.target.value)}
                                        error={errorQuantity}
                                        helperText={errorQuantity && "This value is not acceptable."}
                                        id="outlined-required"
                                        type="number"
                                        label="Quantity"
                                        variant="outlined"
                                    />
                                    <FormControl variant="outlined" style={{ margin: '10px', width: '150px' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                            readOnly
                                            value={((selectedItem && !errorQuantity) ? roundToTwo(Number(selectedItem['rate']) * Number(quantity)) : '0')}
                                            labelWidth={70}
                                        />
                                    </FormControl>
                                    <Tooltip title="Clear">
                                        <IconButton aria-label="clear" onClick={() => {
                                            setSelectedItem(null);
                                            setCurrentItem(null);
                                            setQuantity('0');
                                        }}>
                                            <ClearIcon size={iconsSize} />
                                        </IconButton>
                                    </Tooltip>
                                    {currentItem ?
                                        <Tooltip title="Edit" type="submit" style={{ display: errorQuantity && 'none' }}>
                                            <IconButton aria-label="edit">
                                                <EditIcon size={iconsSize}/>
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Add" type="submit" style={{ display: (!selectedItem || errorQuantity) && 'none' }}>
                                            <IconButton aria-label="add">
                                                <AddIcon size={iconsSize}/>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </form>
                                <hr />
                                <ItemsTable items={finalItems} updateList={updateList} manageUpdate={manageUpdate} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '35px', paddingRight: '35px' }}>
                                    <Paper style={{ width: '500px', height: '500px', paddingLeft: '35px', paddingRight: '35px', paddingTop: '30px', paddingBottom: '10px' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontWeight: 600, fontFamily: 'roboto' }}>Remarks</span>
                                            <hr style={{ marginTop: '20px', marginBottom: '20px' }} />
                                        </div>
                                        <div id="editor" style={{ height: '300px' }}>
                                            {(remarks && remarks.length > 7) && Parse(remarks)}
                                        </div>
                                    </Paper>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <TotalTable style={{ marginLeft: '200px', textAlign: 'right' }} items={finalItems}
                                                updateTotalAmount={(am, quan) => {
                                                    setTotalAmount(am);
                                                    setTotalQuantity(quan);
                                                }} />
                                            <FileUpload handleMessageSnackbar={props.handleMessageSnackbar} documents={documents} updateDocuments={(docs) => setDocuments(docs)} removedDocuments={removedDocuments} updateRemovedDocuments={(docs) => setRemovedDocuments(docs)} />
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={isPrintSelected}
                                                            onChange={() => setIsPrintSelected(!isPrintSelected)}
                                                            name="print"
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Print"
                                                />
                                                
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <Button style={{ marginTop: '20px' }} id="submit-bill" form="billform" type="submit" variant="contained" color="primary">
                                                    {props.billData ? 'Update' : 'Save'}
                                                </Button>
                                                {props.billData &&
                                                    <Button style={{ marginTop: '20px' }} id="delete-bill" variant="contained" color="#ff0000" onClick={() => handleConfirmAlert('Are you sure you want to delete this bill ?')}>
                                                        Delete
                                                    </Button>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
        
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.token,
        loading: state.loading,
        error: state.error,
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(NewBillDialog);