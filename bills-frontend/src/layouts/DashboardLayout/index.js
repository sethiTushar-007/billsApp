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

    const shortcut_pages = ['bills', 'customers', 'products', 'account'];

    useEffect(() => {
        shortcut.remove("F5");
        let next_page = shortcut_pages[(shortcut_pages.indexOf(props.page) + 1) % shortcut_pages.length];
        console.log(next_page);
        shortcut.add("F5", () => history.push(`/${next_page}`));
    }, [props.page]);

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
            <div className={classes.root} style={{position: 'relative'}}>
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
