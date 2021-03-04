import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fileDownload from 'js-file-download';
import dateformat from 'dateformat';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import {
    Search as SearchIcon, Edit2 as EditIcon, Mail as MailIcon, Trash2 as DeleteIcon, Filter as FilterIcon, X as ClearIcon, 
} from 'react-feather';
import { lighten, makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Card,
    CardContent,
    InputAdornment,
    SvgIcon,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmationAlert from '../../../alerts/confirm';
import { base_url, iconsSize } from '../../../components/credentials.js';
import * as actions from '../../../store/actions/auth';
import './styles.css';
import NewCustomerDialog from '../../../alerts/newCustomer';
import UpdateCustomerDialog from '../../../alerts/updateCustomer';
import getInitials from '../../../utils/getInitials';
import SendEmailToCustomer from '../../../alerts/sendEmailToCustomer';
import MessageAlert from '../../../alerts/messageAlert';

const headCells = [
    { id: 'avatar', align: 'center', numeric: false, disablePadding: false, label: '' },
    { id: 'name', align: 'left', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'email', align: 'left', numeric: true, disablePadding: false, label: 'Email' },
    { id: 'phone', align: 'left', numeric: true, disablePadding: false, label: 'Phone' },
    { id: 'date', align: 'right', numeric: true, disablePadding: false, label: 'Last updated on' },
    { id: 'actions', numeric: true, disablePadding: true, label: '' }
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
                        inputProps={{ 'aria-label': 'select all' }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {(headCell.id == 'email' || headCell.id == 'phone') ? 
                                <span>{headCell.label}</span>
                            :
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {(orderBy === headCell.id) ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
}
                        
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
    const { openFilters, handleOpenFilters, filterStartDate, filterEndDate, setFilterStartDate, setFilterEndDate, numSelected, handleAlert } = props;
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
                            Items
                        </Typography>
                    )}
            
                {
                    numSelected > 0 && (
                        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                            {numSelected} selected
                        </Typography>
                    )}
                {openFilters ?
                    <Tooltip title="Clear Filters" onClick={() => {
                        handleOpenFilters();
                        setFilterStartDate(null);
                        setFilterEndDate(null);
                    }
                    }>
                        <IconButton aria-label="close">
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
            <Collapse in={openFilters} style={{ marginBottom: 20 }} timeout="auto" unmountOnExit>
                <PerfectScrollbar>
                <Box margin={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography style={{fontWeight: 600, fontFamily: 'roboto'}} gutterBottom component="div">
                        Filter By:
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center'}}>
                        <span style={{ fontWeight: 500, fontFamily: 'roboto' }}>Date</span>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                style={{ marginLeft: 10, maxWidth: 400 }}
                                value={filterStartDate}
                                inputVariant="outlined"
                                format="dd MMM, yyyy"
                                onChange={setFilterStartDate}
                                label="From"
                            />
                            <KeyboardDatePicker
                                style={{ marginLeft: 10, maxWidth: 400}}
                                value={filterEndDate}
                                inputVariant="outlined"
                                format="dd MMM, yyyy"
                                onChange={setFilterEndDate}
                                label="To"
                            />
                        </MuiPickersUtilsProvider>
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
    avatar: {
        margin: theme.spacing(2)
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

const CustomersTable = (props) => {
    const classes1 = useStyles1();
    const classes2 = useStyles2();

    const [exportMenu, setExportMenu] = useState(null);

    const [messageAlert, setMessageAlert] = useState(false);

    const [openNewCustomerDialog, setOpenNewCustomerDialog] = useState(false);
    const [openUpdateCustomerDialog, setOpenUpdateCustomerDialog] = useState(false);
    const [customerToUpdate, setCustomerToUpdate] = useState(null);
    const handleNewCustomerOpen = () => {
        setOpenNewCustomerDialog(!openNewCustomerDialog);
    }
    const handleUpdateCustomerOpen = () => {
        if (openUpdateCustomerDialog) {
            setCustomerToUpdate(null);
        }
        setOpenUpdateCustomerDialog(!openUpdateCustomerDialog);
    }

    const [openSendMailToCustomer, setOpenSendMailToCustomer] = useState(false);
    const [mailTo, setMailTo] = useState(null);
    const handleSendMailToCustomerOpen = () => {
        if (openSendMailToCustomer) {
            setMailTo(null);
        }
        setOpenSendMailToCustomer(!openSendMailToCustomer);
    }

    const [openFilters, setOpenFilters] = useState(false);

    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);

    const [idToBeDeleted, setIdToBeDeleted] = useState(null);

    const [rows, setRows] = useState([]);

    const fetchAllItems = (query = "") => {
        fetch(base_url + "/api/customer-get-withpage/?user=" + props.user['pk'] + "&page_size=" + rowsPerPage + "&page=" + (page+1) + query,
            {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + props.token,
                }
            }).then(response => response.json())
            .then(data => {
                try {
                    setRows([...data['results']]);
                    setTotalCount(data['count']);
                } catch (error) {
                    console.error(error);
                }
            });
    }


    const [openConfirmAlert, setOpenConfirmAlert] = useState(false);
    const [messageInAlert, setMessageInAlert] = useState('');

    const handleConfirmAlert = (message='') => {
        setMessageInAlert(message);
        setOpenConfirmAlert(!openConfirmAlert);
    }

    const manageUpdate = (item) => {
        setCustomerToUpdate(item);
        handleUpdateCustomerOpen();
    }

    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('date');
    const [selected, setSelected] = React.useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalCount, setTotalCount] = useState(0);

    const updateRows = () => {
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
        if (filterStartDate) {
            query = query + "&date_after=" + dateformat(filterStartDate, "yyyy-mm-dd");
        }
        if (filterEndDate) {
            query = query + "&date_before=" + dateformat(filterEndDate, "yyyy-mm-dd");
        }
        fetchAllItems(query);
    }

    useEffect(() => {
        updateRows();
    }, [searchQuery, order, orderBy, page, filterStartDate, filterEndDate, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [filterStartDate, filterEndDate]);

    useEffect(() => {
        setOpenFilters(props.customerSet.openFilters);
        setFilterStartDate(props.customerSet.filterStartDate || '');
        setFilterEndDate(props.customerSet.filterEndDate || '');
        setSearchQuery(props.customerSet.searchQuery || "");
        setOrder(props.customerSet.order || 'desc');
        setOrderBy(props.customerSet.orderBy || 'date');
        setPage(Number(props.customerSet.page) || 0);
        setRowsPerPage(Number(props.customerSet.rowsPerPage) || 5);
    }, []);

    useEffect(() => {
        props.updateCustomerSet(openFilters, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage);
    }, [openFilters, searchQuery, order, orderBy, page, filterStartDate, filterEndDate, rowsPerPage]);

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

    const deleteSingleItem = (id) => {
        setIdToBeDeleted(id);
        handleConfirmAlert('Are you sure you want to remove this customer ?');
    }
    const handleDeleteSingleItem = () => {
        handleConfirmAlert();
        axios.delete(base_url + '/api/customer-update/' + idToBeDeleted,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ' Token ' + props.token
                }
            }).then(response => {
                setIdToBeDeleted(null);
                updateRows();
                props.handleMessageSnackbar('Customer removed !', 'success');
            })
            .catch(error => console.error(error))
    }

    const handleDeleteItem = () => {
        handleConfirmAlert();
        if (isAllSelected) {
            axios.get(base_url + '/api/customers-delete/',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + props.token
                    }
                }).then(response => {
                    setSelected([]);
                    setIsAllSelected(false);
                    updateRows();
                    props.handleMessageSnackbar('All Customers removed!', 'success');
                })
                .catch(error => console.error(error));
        } else {
            const ids = selected.map(s => Number(s.id));
            axios.post(base_url + '/api/customers-delete/',
                {
                    ids
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + props.token
                    }
                }).then(response => {
                    setSelected([]);
                    updateRows();
                    props.handleMessageSnackbar(ids.length + (ids.length === 1 ? ' customer' : ' customers') + ' removed!', 'success');
                })
                .catch(error => console.error(error));
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (item_id) => selected.findIndex(i => i.id===item_id) !== -1;

    const emptyRows = rowsPerPage - rows.length;

    const exportDocument = (type) => {
        setMessageAlert(true);
        setExportMenu(false);
        axios.get(base_url + '/api/export-data/', {
            params: {
                'user': props.user['pk'],
                'type': type,
                'table': 'customers',
                'searchQuery': searchQuery,
                'filterStartDate': filterStartDate ? dateformat(filterStartDate, "yyyy-mm-dd") : null,
                'filterEndDate': filterEndDate ? dateformat(filterEndDate, "yyyy-mm-dd") : null,
                'orderBy': (order === 'asc' ? '' : '-') + orderBy
            },
            responseType: 'blob',
            headers: {
                'Authorization': ' Token ' + props.token,
            }
        }).then(res => {
            setMessageAlert(false);
            fileDownload(res.data, `customers_${new Date().getTime()}.${type}`);
        }).catch(err => {
            setMessageAlert(false);
            console.error(err);
        })
    }

    return (
        <div style={{ height: '100%'}}>
            {messageInAlert &&
                <ConfirmationAlert open={openConfirmAlert} handleClose={() => handleConfirmAlert()} handleSubmit={selected.length===0 ? handleDeleteSingleItem : handleDeleteItem} message={messageInAlert} />
            }
            <NewCustomerDialog updateData={updateRows} open={openNewCustomerDialog} handleClose={handleNewCustomerOpen} handleMessageSnackbar={props.handleMessageSnackbar} />
            {customerToUpdate && <UpdateCustomerDialog updateData={updateRows} open={openUpdateCustomerDialog} handleClose={handleUpdateCustomerOpen} handleMessageSnackbar={props.handleMessageSnackbar} customerToUpdate={customerToUpdate} />}
            <SendEmailToCustomer open={openSendMailToCustomer} handleClose={handleSendMailToCustomerOpen} mailTo={mailTo} handleMessageSnackbar={props.handleMessageSnackbar} />
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
                    onClick={() => handleNewCustomerOpen()}
                >
                    Add Customer
        </Button>
            </Box>
            <Box mt={3}>
                <Card>
                    <CardContent>
                        <Box maxWidth={500}>
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
                                    )
                                }}
                                placeholder="Search customer by name or email id or phone"
                                variant="outlined"
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Box>
            <div className={classes1.root}>
                <Paper className={classes1.paper} style={{ paddingRight: '20px', paddingLeft: '20px', marginTop: 10 }}>
                    <EnhancedTableToolbar openFilters={openFilters} handleOpenFilters={() => setOpenFilters(!openFilters)} filterStartDate={filterStartDate} filterEndDate={filterEndDate} setFilterStartDate={setFilterStartDate} setFilterEndDate={setFilterEndDate} numSelected={isAllSelected ? totalCount : selected.length} handleAlert={() => handleConfirmAlert('Are you sure you want to delete ' + (isAllSelected ? 'all the items ?' : (selected.length === 1 ? 'this item ?' : 'these ' + selected.length + ' items ?')))} />
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
                                    const item = { index, id: row.id, no: row.no, name: row.name, email: row.email, phone: row.phone, avatar: row.avatar};
                                    const isItemSelected = isAllSelected ? true : isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    
                                    return (
                                        <TableRow
                                            hover
                                            className="tableRow"
                                            role="checkbox"
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
                                            <TableCell component="th" style={{width: 50}} id={labelId} scope="row" padding="none" >
                                                <Avatar
                                                    className={classes1.avatar}
                                                    src={row.avatar}
                                                >
                                                    {getInitials(row.name)}
                                                </Avatar>
                                            </TableCell>
                                            <TableCell component="th" align="left" id={labelId} scope="row" padding="none" >
                                                <Typography
                                                    color="textPrimary"
                                                    variant="body2"
                                                >
                                                    {row.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="left" padding='none'>{row.email}</TableCell>
                                            <TableCell align="left" padding= 'none'>{row.phone}</TableCell>
                                            <TableCell align="right" padding='none'>{dateformat(row.date, "dd mmm, yyyy - hh:MM:ss TT")}</TableCell>
                                            <TableCell align="right" style={{ padding: 0, width: 150 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                                    <div className="tableEdit">
                                                        <Tooltip title="Edit" onClick={() => manageUpdate(item)}>
                                                            <IconButton aria-label="Edit">
                                                                <EditIcon size={iconsSize}/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        {(props.user.email_smtp && row.email) &&
                                                            <Tooltip title="Mail" onClick={() => {
                                                            setMailTo(row.email);
                                                            handleSendMailToCustomerOpen();
                                                        }}>
                                                            <IconButton aria-label="Mail">
                                                                <MailIcon size={iconsSize}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        <Tooltip title="Delete">
                                                            <IconButton aria-label="Delete" onClick={() => deleteSingleItem(row.id)}>
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
        loading: state.loading,
        error: state.error,
        customerSet: state.customerSet,
        user: state.user
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateCustomerSet: (openFilters, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage) => dispatch(actions.updateCustomerSet(openFilters, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomersTable);