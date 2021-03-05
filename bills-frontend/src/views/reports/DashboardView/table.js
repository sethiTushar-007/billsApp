import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { shortcut } from '../../../components/shortcuts.js';
import PerfectScrollbar from 'react-perfect-scrollbar';
import fileDownload from 'js-file-download';
import { useReactToPrint } from 'react-to-print';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import dateformat from 'dateformat';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Fab from '@material-ui/core/Fab';
import MicOffIcon from '@material-ui/icons/MicOff';
import MicIcon from '@material-ui/icons/Mic';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {
    Printer as PrintIcon, Search as SearchIcon, Edit2 as EditIcon, Mail as MailIcon, Trash2 as DeleteIcon, Filter as FilterIcon, X as ClearIcon,
} from 'react-feather';
import {
    Card,
    CardContent,
    InputAdornment,
    Divider,
    SvgIcon,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import TableBody from '@material-ui/core/TableBody';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import './styles.css';
import ConfirmationAlert from '../../../alerts/confirm';
import NewBillDialog from '../../../alerts/NewBill/index';
import SendBillToCustomer from '../../../alerts/sendBillToCustomer';
import * as actions from '../../../store/actions/auth';
import { base_url, iconsSize } from '../../../components/credentials.js';
import PrintPage from '../../../alerts/NewBill/Print/print';
import MessageAlert from '../../../alerts/messageAlert';
import mic from '../../../components/credentials.js';

const headCells = [
    { id: 'id', align: 'left', numeric: false, disablePadding: true, label: 'ID' },
    { id: 'no', align: 'left', numeric: true, disablePadding: false, label: 'Bill No.' },
    { id: 'customer_name', align: 'left', numeric: false, disablePadding: false, label: "Customer's Name" },
    { id: 'amount', align: 'right', numeric: false, disablePadding: false, label: 'Amount' },
    { id: 'date', align: 'right', numeric: false, disablePadding: false, label: 'Last Updated on' },
    { id: 'icons', numeric: false, disablePadding: true, label: '' }
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { openFilters, handleOpenFilters, productsData, filterProductsInput, setFilterProductsInput, filterProducts, setFilterProducts, filterStartDate, setFilterStartDate, filterEndDate, setFilterEndDate, filterAmountMin, filterAmountMax, setFilterAmountMin, setFilterAmountMax, numSelected, handleAlert } = props;

    return (
        <div>
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete" onClick={handleAlert}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>

                ) : (
                        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                            Bills
                        </Typography>
                    )}
                {numSelected > 0 && (
                    <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                        {numSelected} selected
                    </Typography>
                )}
                {openFilters ?
                    <Tooltip title="Clear Filters" onClick={() => {
                        handleOpenFilters();
                        setFilterAmountMin('');
                        setFilterAmountMax('');
                        setFilterProducts([]);
                        setFilterProductsInput('');
                        setFilterStartDate(null);
                        setFilterEndDate(null);
                    }}>
                        <IconButton aria-label="clear">
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                    :
                    <Tooltip title="Filter" onClick={handleOpenFilters}>
                        <IconButton aria-label="filter">
                            <FilterIcon />
                        </IconButton>
                    </Tooltip>
                }
            </Toolbar>
            <Collapse in={openFilters} timeout="auto" unmountOnExit style={{ overflow: 'hidden' }}>
                <PerfectScrollbar>
                <Divider />
                <Box margin={1} style={{marginTop: 20}} >
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography style={{ fontWeight: 600, fontFamily: 'roboto' }} gutterBottom component="div">
                            Filter By:
                    </Typography>
                        <Autocomplete
                            style={{ width: 500 }}
                            multiple
                            freeSolo
                            id="tags-outlined"
                            autoHighlight
                            value={filterProducts}
                            onChange={(event, value) => setFilterProducts(value)}
                            onInputChange={(event, newInputValue) => setFilterProductsInput(newInputValue)}
                            options={filterProductsInput ? productsData : []}
                            getOptionLabel={(option) => option.name}
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Product"
                                    placeholder="Product Name"
                                />
                            )}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontWeight: 500, fontFamily: 'roboto' }}>Date</span>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                style={{ marginLeft: 10, width: 200 }}
                                value={filterStartDate}
                                inputVariant="outlined"
                                format="dd MMM, yyyy"
                                onChange={setFilterStartDate}
                                label="From"
                            />
                            <KeyboardDatePicker
                                style={{ marginLeft: 10, width: 200 }}
                                value={filterEndDate}
                                inputVariant="outlined"
                                format="dd MMM, yyyy"
                                onChange={setFilterEndDate}
                                label="To"
                            />
                        </MuiPickersUtilsProvider>
                               
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500, fontFamily: 'roboto' }}>Amount</span>
                        <TextField
                            style={{ margin: '10px', width: '150px' }}
                            value={filterAmountMin}
                            onChange={(event) => setFilterAmountMin(event.target.value)}
                            placeholder="Min (Rs.)"
                            id="outlined"
                            type="number"
                            variant="outlined"
                        />
                        <TextField
                            style={{ margin: '10px', width: '150px' }}
                            value={filterAmountMax}
                            onChange={(event) => setFilterAmountMax(event.target.value)}
                            placeholder="Max (Rs.)"
                            id="outlined-required"
                            type="number"
                            variant="outlined"
                        />
                    </div>
                    </div>
                    </Box>
                </PerfectScrollbar>
            </Collapse>
        </div>
    );
};

const useStyles1 = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    exportButton: {
        marginRight: theme.spacing(1)
    }
}));

const useStyles2 = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const roundToTwo = (num) => {
    return +(Math.round(num + "e+2") + "e-2");
}

const BillsTable = (props) => {
    const token = props.token;
    const history = useHistory();
    const classes1 = useStyles1();
    const classes2 = useStyles2();

    const [isListening, setIsListening] = useState(false);

    const [messageAlert, setMessageAlert] = useState(false);
    const [exportMenu, setExportMenu] = useState(null);

    const [openNewBillDialog, setOpenNewBillDialog] = useState(false);
    const [billToUpdate, setBillToUpdate] = useState(null);
    const handleNewBillOpen = () => {
        if (openNewBillDialog) {
            axios.get(base_url + '/api/document-delete/', {
                params: {
                    'userid': props.user.avatar_no
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token
                }
            });
            setBillToUpdate(null);
        }
        setOpenNewBillDialog(!openNewBillDialog);
    }
    useEffect(() => {
        shortcut.add("F12", () => {
            setOpenNewBillDialog(prev => {
                if (prev) {
                    axios.get(base_url + '/api/document-delete/', {
                        params: {
                            'userid': props.user.avatar_no
                        },
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + token
                        }
                    });
                    setBillToUpdate(null);
                }
                return !prev;
            });
        });
        return () => {
            shortcut.remove("F12");
        }
    }, []);

    const [openSendBillToCustomer, setOpenSendBillToCustomer] = useState(false);
    const [mailTo, setMailTo] = useState(null);
    const [idToMail, setIdToMail] = useState(null);
    const handleSendBillToCustomerOpen = () => {
        if (openSendBillToCustomer) {
            setMailTo(null);
            setIdToMail(null);
        }
        setOpenSendBillToCustomer(!openSendBillToCustomer);
    }


    const [openFilters, setOpenFilters] = useState(false);
    const [productsData, setProductsData] = useState([]);
    const [filterProductsInput, setFilterProductsInput] = useState('');
    const [filterProducts, setFilterProducts] = useState([]);
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [filterAmountMin, setFilterAmountMin] = useState('');
    const [filterAmountMax, setFilterAmountMax] = useState('');

    const [idToBeDeleted, setIdToBeDeleted] = useState(null);

    var printPageRef1 = useRef();
    const [dataToPrint, setDataToPrint] = useState(null);

    const [rows, setRows] = useState([]);

    const fetchAllItems = (query = "") => {
        fetch(base_url + "/api/bill-get-withpage/?user=" + props.user['pk'] + "&page_size=" + rowsPerPage + "&page=" + (page + 1) + query,
            {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token,
                }
            }).then(response => response.json())
            .then(data => {
                try {
                    setDataToPrint(null);
                    setRows([...data['results']]);
                    setTotalCount(data['count']);
                } catch (error) {
                    console.error(error);
                }
            });
    }

    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [messageInAlert, setMessageInAlert] = useState('');

    const handleConfirmAlert = (message = '') => {
        setMessageInAlert(message);
        setOpenConfirmAlert(!openConfirmAlert);
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('date');
    const [selected, setSelected] = React.useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        setOpenFilters(props.billSet.openFilters);
        setFilterProducts(props.billSet.filterProducts);
        setFilterStartDate(props.billSet.filterStartDate || null);
        setFilterEndDate(props.billSet.filterEndDate || null);
        setFilterAmountMin(props.billSet.filterAmountMin || '');
        setFilterAmountMax(props.billSet.filterAmountMax || '');
        setSearchQuery(props.billSet.searchQuery || "");
        setOrder(props.billSet.order || 'desc');
        setOrderBy(props.billSet.orderBy || 'date');
        setPage(Number(props.billSet.page) || 0);
        setRowsPerPage(Number(props.billSet.rowsPerPage) || 5);
    }, []);

    useEffect(() => {
        props.updateBillSet(openFilters, filterProducts, filterStartDate, filterEndDate, filterAmountMin, filterAmountMax, searchQuery, order, orderBy, page, rowsPerPage);
    }, [openFilters, searchQuery, order, orderBy, page, filterAmountMin, filterAmountMax, filterProducts, filterStartDate, filterEndDate, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [filterAmountMin, filterAmountMax, filterProducts, filterStartDate, filterEndDate]);

    useEffect(() => {
        if (filterProductsInput) {
            fetch(base_url + "/api/item-get/?user=" + props.user['pk'] + "&ordering=name&search=" + filterProductsInput,
                {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token,
                    }
                }).then(response => response.json())
                .then(data => {
                    try {
                        setProductsData(data);
                    } catch (error) {
                        console.error(error);
                    }
                });
        }
    }, [filterProductsInput]);

    const updateRows = async () => {
        let query = "";
        if (searchQuery) {
            query = query + "&search=" + searchQuery;
        }
        if (order && orderBy) {
            query = query + "&ordering=" + (order === 'asc' ? '' : '-') + orderBy;
        }
        else {
            query = query + "&ordering=-no";
        }
        if (filterAmountMin) {
            query = query + "&amount_min=" + filterAmountMin;
        }
        if (filterAmountMax) {
            query = query + "&amount_max=" + filterAmountMax;
        }
        if (filterProducts.length > 0) {
            let ids = await filterProducts.map((obj) => obj.no);
            ids.sort();
            query = query + "&items_id=" + ids;
        }
        if (filterStartDate) {
            query = query + '&date_after=' + dateformat(filterStartDate, "yyyy-mm-dd");
        }
        if (filterEndDate) {
            query = query + '&date_before=' + dateformat(filterEndDate, "yyyy-mm-dd");
        }
        fetchAllItems(query);
    }

    useEffect(() => {
        updateRows();
    }, [searchQuery, order, orderBy, page, filterAmountMin, filterAmountMax, filterProducts, filterStartDate, filterEndDate, rowsPerPage]);

    useEffect(() => {
        if (isListening) {
            mic.start();
            mic.onend = () => {
                mic.start();
            }
        } else {
            mic.stop();
            mic.onend = () => {
                console.log('Stopped mic on click');
            }
        }
        mic.onstart = () => {
            console.log('Mic is on');
        }
        mic.onresult = event => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
            setSearchQuery(transcript);
            mic.onerror = event => {
                console.error(event.error)
            }
        }
    }, [isListening]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows;
            setIsAllSelected(true);
            setSelected(newSelecteds);
            return;
        }
        setIsAllSelected(false);
        setSelected([]);
    };

    const handleClick = (event, id, item) => {
        const selectedIndex = selected.findIndex(i => i.id === id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, item);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        if (newSelected.length === totalCount) {
            setIsAllSelected(true);
        } else {
            setIsAllSelected(false);
        }
        setSelected(newSelected);
    };

    const handleDeleteItem = () => {
        handleConfirmAlert();
        if (isAllSelected) {
            axios.get(base_url + '/api/bill-delete/',
                {
                    params: {
                        'userid': props.user.avatar_no
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token
                    }
                }).then(response => {
                    setSelected([]);
                    setIsAllSelected(false);
                    updateRows();
                    props.handleMessageSnackbar('All bills deleted!', 'success');
                })
                .catch(error => console.error(error));
        } else {
            const ids = selected.map(s => Number(s.id));
            axios.post(base_url + '/api/bill-delete/',
                {
                    'userid': props.user.avatar_no,
                    ids
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token
                    }
                }).then(response => {
                    setSelected([]);
                    updateRows();
                    props.handleMessageSnackbar(ids.length + (ids.length === 1 ? ' bill' : ' bills') + ' deleted!', 'success');
                })
                .catch(error => console.error(error));
        }
    }

    const deleteSingleBill = (id) => {
        setIdToBeDeleted(id);
        handleConfirmAlert('Are you sure you want to delete this bill ?');
    }
    const handleDeleteSingleBill = () => {
        handleConfirmAlert();
        axios.post(base_url + '/api/bill-delete/',
            {
                'userid': props.user.avatar_no,
                'ids': [Number(idToBeDeleted)]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + token
                }
            }).then(response => {
                setIdToBeDeleted(null);
                updateRows();
                props.handleMessageSnackbar('Bill Deleted !', 'success');
            })
            .catch(error => console.error(error))
    }

    const handlePrint = useReactToPrint({
        content: () => printPageRef1.current,
        documentTitle: 'bill',
        onAfterPrint: () => setDataToPrint(null)
    });

    const billPrint = (row) => {
        var promise = new Promise((resolve, reject) => {
            try {
                setDataToPrint({
                    customerName: row.customer_name,
                    items: row.items,
                    remarks: row.remarks.data,
                    amount: roundToTwo(Number(row.amount)),
                    date: dateformat(new Date(), "dd mmm, yyyy - hh:MM:ss TT").toString(),
                    quantity: Number(row.quantity),
                    no: row.id
                });
                resolve("Promise resolved successfully");
            }
            catch (error) {
                reject(Error("Promise rejected"));
            }
        });

        promise.then(result => {
            handlePrint();
        }, function (error) {
            console.error(error);
        });
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (item_id) => selected.findIndex(i => i.id === item_id) !== -1;

    const emptyRows = rowsPerPage - rows.length;

    const emailFile = (id, to) => {
        setIdToMail(id);
        setMailTo(to);
        handleSendBillToCustomerOpen();
    }

    const exportDocument = (type) => {
        setExportMenu(false);
        setMessageAlert(true);
        axios.get(base_url + '/api/export-data/', {
            params: {
                'user': props.user['pk'],
                'type': type,
                'table': 'bills',
                'searchQuery': searchQuery,
                'filterProducts': filterProducts.map(value => value.no).join(),
                'filterStartDate': filterStartDate ? dateformat(filterStartDate, "yyyy-mm-dd") : null,
                'filterEndDate': filterEndDate ? dateformat(filterEndDate, "yyyy-mm-dd") : null,
                'filterAmountMin': filterAmountMin || null,
                'filterAmountMax': filterAmountMax || null,
                'orderBy': (order === 'asc' ? '' : '-') + orderBy
            },
            responseType: 'blob',
            headers: {
                'Authorization': ' Token ' + props.token,
            }
        }).then(res => {
            setMessageAlert(false);
            fileDownload(res.data, `bills_${new Date().getTime()}.${type}`);
        }).catch(err => {
            setMessageAlert(false);
            console.error(err);
        })
    }

    return (
        <div style={{ height: '100%'}}>
            {dataToPrint &&
                <div style={{ overflow: 'hidden', height: 0 }}>
                    <PrintPage
                        ref={printPageRef1}
                        dataToPrint={dataToPrint}
                    />
                </div>}
            {messageInAlert &&
                <ConfirmationAlert open={openConfirmAlert} handleClose={() => handleConfirmAlert()} handleSubmit={selected.length === 0 ? handleDeleteSingleBill : handleDeleteItem} message={messageInAlert} />
            }
            {openNewBillDialog && <NewBillDialog updateData={updateRows} billData={billToUpdate} open={openNewBillDialog} handleClose={handleNewBillOpen} handleMessageSnackbar={props.handleMessageSnackbar} />}
            <SendBillToCustomer open={openSendBillToCustomer} handleClose={handleSendBillToCustomerOpen} idToMail={idToMail} mailTo={mailTo} handleMessageSnackbar={props.handleMessageSnackbar} />
            <MessageAlert open={messageAlert} handleClose={() => setMessageAlert(false)} message={'Exporting...'} />

            <Box
                display="flex"
                justifyContent="space-between"
            >
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={(event) => setExportMenu(event.currentTarget)} className={classes1.exportButton}>
                    Export
        </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={exportMenu}
                    keepMounted
                    open={Boolean(exportMenu)}
                    onClose={() => setExportMenu(false)}
                >
                    <MenuItem onClick={() => exportDocument('pdf')}>as pdf</MenuItem>
                    <MenuItem onClick={() => exportDocument('xlsx')}>as xlsx</MenuItem>
                </Menu>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleNewBillOpen}
                >
                    Create Bill
        </Button>
            </Box>
            <Box mt={3}>
                <Card>
                    <CardContent style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Box width='60%'>
                            <TextField
                                fullWidth
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon
                                                fontSize="small"
                                                color="action"
                                            >
                                                <SearchIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    ), endAdornment: (
                                        searchQuery &&
                                        <InputAdornment position="start" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')}>
                                            <SvgIcon
                                                fontSize="small"
                                                color="action"
                                            >
                                                <ClearIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    )
                                }}
                                placeholder="Search bill by name or id"
                                variant="outlined"
                            />
                        </Box>
                        <Fab
                            size='small'
                            onTouchStart={(event) => {
                                event.preventDefault();
                                setIsListening(true);
                            }}
                            onTouchEnd={(event) => {
                                event.preventDefault();
                                setIsListening(false);
                            }}
                            onMouseDown={(event) => {
                                event.preventDefault();
                                setIsListening(true);
                            }}
                            onMouseUp={(event) => {
                                event.preventDefault();
                                setIsListening(false);
                            }}
                            onMouseLeave={(event) => {
                                event.preventDefault();
                                setIsListening(false);
                            }}
                            color={isListening ? 'red' : 'primary'} aria-label="speak">
                            {isListening ? <MicIcon /> : <MicOffIcon />}
                        </Fab>
                    </CardContent>
                </Card>
            </Box>
            <div className={classes1.root} style={{marginTop: 10}}>
                <Paper className={classes1.paper} style={{ paddingRight: '20px', paddingLeft: '20px' }}>
                    <EnhancedTableToolbar openFilters={openFilters} handleOpenFilters={() => setOpenFilters(!openFilters)} productsData={productsData} filterProductsInput={filterProductsInput} setFilterProductsInput={setFilterProductsInput} filterProducts={filterProducts} setFilterProducts={setFilterProducts} filterStartDate={filterStartDate} setFilterStartDate={setFilterStartDate} filterEndDate={filterEndDate} setFilterEndDate={setFilterEndDate} filterAmountMin={filterAmountMin} filterAmountMax={filterAmountMax} setFilterAmountMin={setFilterAmountMin} setFilterAmountMax={setFilterAmountMax} numSelected={isAllSelected ? totalCount : selected.length} handleAlert={() => handleConfirmAlert('Are you sure you want to delete ' + (isAllSelected ? 'all the bills ?' : (selected.length === 1 ? 'this bill ?' : 'these ' + selected.length + ' bills ?')))} />
                    <TableContainer>
                        <Table
                            className={classes1.table}
                            aria-labelledby="tableTitle"
                            size='medium'
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes1}
                                numSelected={isAllSelected ? totalCount : selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={totalCount}
                            />
                            <TableBody>
                                {rows.map((row, index) => {
                                    const item = { index, id: row.id, no: row.no, name: row.name, rate: row.rate };
                                    const isItemSelected = isAllSelected ? true : isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            className="tableRow"
                                            role="checkbox"
                                            hover
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.id}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    disabled={isAllSelected && selected.length !== totalCount}
                                                    onChange={(event) => handleClick(event, row.id, item)}
                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                />
                                            </TableCell>
                                            <TableCell component="th" id={labelId} align="left" scope="row" padding="none">
                                                {row.no}
                                            </TableCell>
                                            <TableCell align="left">{row.id}</TableCell>
                                            <TableCell align="left">{row.customer_name}</TableCell>
                                            <TableCell align="right">Rs. {row.amount}</TableCell>
                                            <TableCell align="right">{dateformat(row.date, "dd mmm, yyyy - hh:MM:ss TT")}</TableCell>
                                            <TableCell align="right" style={{ padding: 0, width: 200 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                    <div className="tableEdit">
                                                        <Tooltip title="Edit" onClick={() => {
                                                            setBillToUpdate(row.no);
                                                            handleNewBillOpen();
                                                        }}>
                                                            <IconButton aria-label="Edit">
                                                                <EditIcon size={iconsSize}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        {props.user.email_smtp &&
                                                            <Tooltip title="Mail" onClick={() => emailFile(row.id, row.customer_email)}>
                                                                <IconButton aria-label="Mail">
                                                                <MailIcon size={iconsSize}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        <Tooltip title="Print" onClick={() => billPrint(row)}>
                                                            <IconButton aria-label="Print">
                                                                <PrintIcon size={iconsSize}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" onClick={() => deleteSingleBill(row.id)}>
                                                            <IconButton aria-label="Delete">
                                                                <DeleteIcon size={iconsSize}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={totalCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        loading: state.loading,
        error: state.error,
        user: state.user,
        billSet: state.billSet
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateBillSet: (openFilters, filterProducts, filterStartDate, filterEndDate, filterAmountMin, filterAmountMax, searchQuery, order, orderBy, page, rowsPerPage) => dispatch(actions.updateBillSet(openFilters, filterProducts, filterStartDate, filterEndDate, filterAmountMin, filterAmountMax, searchQuery, order, orderBy, page, rowsPerPage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillsTable);
