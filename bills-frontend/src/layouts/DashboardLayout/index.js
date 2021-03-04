import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { SnackbarProvider, useSnackbar } from 'notistack';

import NavBar from './NavBar';
import TopBar from './TopBar';

import AccountView from '../../views/account/AccountView';
import CustomerListView from '../../views/customer/CustomerListView';
import ProductListView from '../../views/product/ProductListView';
import DashboardView from '../../views/reports/DashboardView';

import LogoutAlert from '../../alerts/logout';
import { shortcut } from '../../components/shortcuts.js';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const DashboardLayout = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        shortcut.add("F1", () => history.push('/bills'));
        shortcut.add("F3", () => history.push('/customers'));
        shortcut.add("F5", () => history.push('/products'));
        shortcut.add("F7", () => history.push('/account'));
        return () => {
            shortcut.remove("F1");
            shortcut.remove("F3");
            shortcut.remove("F5");
            shortcut.remove("F7");
        }
    }, []);

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();
    const handleMessageSnackbar = (message, variant='simple') => {
        if (variant == 'simple') {
            enqueueSnackbar(message);
        } else {
            enqueueSnackbar(message, { variant });
        }
    };

    // Logout dialog
    const [logoutAlertOpen, setLogoutAlertOpen] = useState(false);
    const logoutDialog = () => {
        setLogoutAlertOpen(!logoutAlertOpen);
    }

    return (
        <SnackbarProvider maxSnack={3}>
            <div className={classes.root}>
                <LogoutAlert logoutAlertOpen={logoutAlertOpen} logoutDialog={logoutDialog} />
                
                <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} logoutDialog={logoutDialog} />
                <NavBar
                onMobileClose={() => setMobileNavOpen(false)}
                        openMobile={isMobileNavOpen}
                        logoutDialog={logoutDialog}
                />
                <div className={classes.wrapper}>
                    <div className={classes.contentContainer}>
                            <div className={classes.content}>
                            {props.page === 'account' && <AccountView handleMessageSnackbar={handleMessageSnackbar} handleMessageSnackbar={handleMessageSnackbar} />}
                            {props.page === 'customers' && <CustomerListView handleMessageSnackbar={handleMessageSnackbar} />}
                            {props.page === 'bills' && <DashboardView handleMessageSnackbar={handleMessageSnackbar} handleMessageSnackbar={handleMessageSnackbar}/>}
                            {props.page === 'products' && <ProductListView handleMessageSnackbar={handleMessageSnackbar} />}
                            </div>
                    </div>
                </div>
            </div>
        </SnackbarProvider>
  );
};

export default DashboardLayout;
