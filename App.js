'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { isReachable, getSessionUser, isEmpty} from './utils/sImoUtils';
import Main from './Main';

import {updateUser, checkUserAuth} from "./actions/userActions";
import { baseApiURL } from "./actions/axiosRequests";

isReachable(baseApiURL, 5000).then(res => console.log("is " + baseApiURL + " Reachable: ", res));

getSessionUser((user) => {
    if (!isEmpty(user)) {
        checkUserAuth(user, (response) => {
            if (response && response.data && response.data.isAuthenticated && !isEmpty(response.data.user)) {
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