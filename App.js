'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Util from './utils/sImoUtils';
import Main from './Main';

import {updateUser, checkUserAuth} from "./actions/userActions";
import { baseApiURL } from "./actions/axiosRequests";

Util.isReachable(baseApiURL, 5000, (res) => {
    console.log("isReachable: ", res);
});

Util.getSessionUser((user) => {
    if (!Util.isEmpty(user)) {
        checkUserAuth(user, (response) => {
            console.log('response: ', response);
            
            if (response && response.data && response.data.isAuthenticated && !Util.isEmpty(response.data.user)) {
                store.dispatch(updateUser(response.data.user));
            }
        });
    }
});


export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Main/>
            </Provider>
        )
    }
}