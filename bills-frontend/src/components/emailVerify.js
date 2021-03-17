import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import NotFoundView from '../views/errors/NotFoundView.js';
import { base_url } from './credentials.js';

const EmailVerifyPage = (props) => {
    const location = useLocation();
    const [isError, setIsError] = useState(false);

    useEffect(async () => {
        let query = queryString.parse(location.search);
        let response = await axios.post(base_url + '/api/verify-email/', {
            'username': query.user,
            'key': query.key
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(error => console.log(error));
        if (response && response.status == 200) {
            props.handleMessageSnackbar('Email verified. Now login with your account.', 'success', '/login')
        } else {
            setIsError(true);
        }
    }, []);

    return (
        <div style={{height: '100%'}}>
            {!isError ? <span>Loading...</span> : <NotFoundView/>}
        </div>
    );
}

export default EmailVerifyPage;