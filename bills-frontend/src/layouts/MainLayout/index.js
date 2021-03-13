import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import TopBar from './TopBar';
import { SnackbarProvider, useSnackbar } from 'notistack';
import LoginView from '../../views/auth/LoginView';
import NotFoundView from '../../views/errors/NotFoundView';
import RegisterView from '../../views/auth/RegisterView';
import EmailVerifyPage from '../../components/emailVerify';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
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

const MainLayout = (props) => {
    const classes = useStyles();
    const history = useHistory();

    // Snackbar
    const { enqueueSnackbar } = useSnackbar();
    const handleMessageSnackbar = (message, variant = 'simple', to='') => {
        if (variant == 'simple') {
            enqueueSnackbar(message);
        } else {
            enqueueSnackbar(message, { variant });
        }
        if (to) {
            history.push(to);
        }
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div className={classes.root}>
              <TopBar />
              <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                <div className={classes.content}>
                    {props.page === 'login' && <LoginView handleMessageSnackbar={handleMessageSnackbar} />}
                    {props.page === 'register' && <RegisterView handleMessageSnackbar={handleMessageSnackbar}/>}
                    {props.page === 'error' && <NotFoundView />}
                    {props.page === 'email-verify' && <EmailVerifyPage handleMessageSnackbar={handleMessageSnackbar} />}
                  </div>
                </div>
              </div>
            </div>
        </SnackbarProvider>
  );
};

export default MainLayout;
