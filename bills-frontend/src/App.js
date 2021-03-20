import 'react-perfect-scrollbar/dist/css/styles.css';
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import * as actions from './store/actions/auth';
import { base_url } from './components/credentials';
import LoadingPage from './components/loading';

const App = (props) => {

    useEffect(() => {
        props.onTryAutoSignup();
    }, []);

    useEffect(() => {
        if (props.isAuthenticated) {
            try {
                fetch(base_url + "/rest-auth/user/",
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + props.token,
                        }
                    }).then(response => response.json())
                    .then(data1 => {
                        fetch(base_url + "/api/userinfo-get/?user=" + data1['pk'],
                            {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': ' Token ' + props.token,
                                }
                            }).then(response => response.json())
                            .then(data2 => {
                                props.addUser({ ...data1, avatar_id: data2[0]['id'], avatar_no: data2[0]['no'], avatar: data2[0]['avatar'], email_smtp: data2[0]['email'], default_subject: data2[0]['subject'], default_body: data2[0]['body'] });
                            })
                    })
            } catch (error) { console.error(error) }
        }
    }, [props.isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
          <GlobalStyles />
          <SnackbarProvider maxSnack={3}>
          <Router>
              <Switch>
                  <Route exact path="/account" render={() => (props.isAuthenticated ? (props.user ? <DashboardLayout page='account' /> : <LoadingPage />) : <Redirect to='/login' />)} />
                    <Route exact path="/customers" render={() => (props.isAuthenticated ? (props.user ? <DashboardLayout page='customers' /> : <LoadingPage />) : <Redirect to='/login' />)} />
                    <Route exact path="/bills" render={() => (props.isAuthenticated ? (props.user ? <DashboardLayout page='bills' /> : <LoadingPage />) : <Redirect to='/login' />)} />
                    <Route exact path="/" render={() => (props.isAuthenticated ? <Redirect to='/bills' /> : <Redirect to='/login' />)} />
                    <Route exact path="/products" render={() => (props.isAuthenticated ? (props.user ? <DashboardLayout page='products' /> : <LoadingPage />) : <Redirect to='/login' />)} />
                    <Route exact path="/login" render={() => (!props.isAuthenticated ? < MainLayout page='login' /> : <Redirect to='/' />)} />
                    <Route exact path="/register" render={() => (!props.isAuthenticated ? < MainLayout page='register' /> : <Redirect to='/' />)} />
                    <Route exact path="/account/verify" render={() => (!props.isAuthenticated ? < MainLayout page='email-verify' /> : <Redirect to='/' />)} />
                    <Route exact path="/password-reset" render={() => (!props.isAuthenticated ? < MainLayout page='password-reset' /> : <Redirect to='/' />)} />
                  <Route exact path="/*" render={() => <MainLayout page='error' />} />
              </Switch>
              </Router>
          </SnackbarProvider>
    </ThemeProvider>
  );
};

const mapStateToProps = state => {
    return {
        token: state.token,
        isAuthenticated: state.token !== null,
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        addUser: (user) => dispatch(actions.addUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);