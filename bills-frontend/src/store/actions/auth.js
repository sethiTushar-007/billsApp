import axios from 'axios';
import * as actionTypes from './actionTypes';
import { base_url } from '../../components/credentials';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    let tok = localStorage.getItem('token');
    if (tok) {
        axios.post(base_url + '/rest-auth/logout/', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' Token ' + tok
            }
        });
        localStorage.clear();
        addUser(null);
    }
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
            window.location.reload();
        }, expirationTime*1000)
    }
}

export const authLogin = (username, password, handleMessageSnackbar) => {
    return async dispatch => {
        try {
            dispatch(authStart());
            let response = await axios.post(base_url + '/rest-auth/login/', {
                username: username,
                password: password
            });
            let token = await response.data.key;
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
            handleMessageSnackbar('Login success !', 'success', '/bills');

        } catch (error) {
            handleMessageSnackbar((error.response.data['username'] && error.response.data['username'][0]) || (error.response.data['non_field_errors'] && error.response.data['non_field_errors'][0]) || 'Error!', 'error');
        }
    }
}

export const authSocialLogin = (provider, accessToken, idToken, profilePic, handleMessageSnackbar) => {
    return async dispatch => {
        try {
            dispatch(authStart());
            let response = await axios.post(`${base_url}/social-login/${provider}/`, {
                access_token: accessToken,
                id_token: idToken
            });
            let token = await response.data.key;
            const response1 = await fetch(base_url + "/rest-auth/user/",
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token,
                    }
                });
            const data1 = await response1.json();

            const response2 = await fetch(base_url + "/api/userinfo-get/?user=" + data1['pk'],
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token,
                    }
                });
            const data2 = await response2.json();
            if (data2.length > 0) {
                let response3 = await axios.patch(base_url + '/api/userinfo-update/' + data2[0]['id'],
                    {
                        avatar: profilePic
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + token
                        }
                    }
                );
            } else {
                let response4 = await fetch(base_url + '/api/userinfo-create/', {
                    method: 'POST',
                    body: JSON.stringify({
                        user: data1['pk'],
                        no: new Date().getTime().toString(),
                        avatar: profilePic,
                        email: null
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token
                    }
                })
            }
            
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
            localStorage.setItem('token', token);
            localStorage.setItem('expirationDate', expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
            handleMessageSnackbar('Login success !', 'success', '/bills');

        } catch (error) {
            console.error(error);
            handleMessageSnackbar('Login failed !', 'error');
        }
    }
}

export const authSignup = (username, email, password1, password2, handleMessageSnackbar) => {
    return async dispatch => {
        var token = null;
        let response1 = await axios.post(base_url + '/rest-auth/registration/', {
            username: username,
            email: email,
            password1: password1,
            password2: password2,
        }).catch(error => {
            handleMessageSnackbar((error.response.data['username'] && error.response.data['username'][0]) || (error.response.data['email'] && error.response.data['email'][0]) || (error.response.data['non_field_errors'] && error.response.data['non_field_errors'][0]) || (error.response.data['password1'] && error.response.data['password1'][0]) || 'Error!', 'error');
        })
        if (response1 && response1.status==201) {
            token = await response1.data.key;
            if (token) {
                let response2 = await fetch(base_url + '/rest-auth/user/',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + token,
                        }
                    });
                let data1 = await response2.json();
                let response3 = await fetch(base_url + '/api/userinfo-create/', {
                    method: 'POST',
                    body: JSON.stringify({
                        user: data1['pk'],
                        no: new Date().getTime().toString(),
                        avatar: null,
                        email: null
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': ' Token ' + token
                    }
                })
                if (response3.status==201) {
                    let response4 = await axios.post(base_url + '/api/send-email-confirmation/', {
                        username: username,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': ' Token ' + token
                        }
                    });
                    if (response4.status == 200) {
                        handleMessageSnackbar('Email verification link sent !', 'success', '/login');
                    }
                }
            }
        }
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                dispatch(authSuccess(token))
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
            }
        }
    }
}

export const updateBillSet = (openFilters, filterProducts, filterStartDate, filterEndDate, filterAmountMin, filterAmountMax, searchQuery, order, orderBy, page, rowsPerPage) => {
    return {
        type: actionTypes.BILLSET_UPDATE,
        billSet: { openFilters, filterProducts, filterStartDate, filterEndDate, filterAmountMin, filterAmountMax, searchQuery, order, orderBy, page, rowsPerPage}
    }
}

export const updateItemSet = (openFilters, filterRateMin, filterRateMax, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage) => {
    return {
        type: actionTypes.ITEMSET_UPDATE,
        itemSet: { openFilters, filterRateMin, filterRateMax, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage }
    }
}

export const updateCustomerSet = (openFilters, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage) => {
    return {
        type: actionTypes.CUSTOMERSET_UPDATE,
        customerSet: { openFilters, filterStartDate, filterEndDate, searchQuery, order, orderBy, page, rowsPerPage }
    }
}

export const addUser = (user) => {
    return {
        type: actionTypes.USER_ADDED,
        user: user
    }
}