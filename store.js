'use strict';

import thunk from 'redux-thunk'
import { applyMiddleware, compose, combineReducers, createStore } from 'redux'

import userReducer from './reducers/userReducer'

const allReducers = combineReducers({
    user: userReducer
});

const devTools = window.devToolsExtension && window.devToolsExtension();

const allStoreEnhanchers = devTools ? compose(
    applyMiddleware(thunk),
    devTools
) : compose(applyMiddleware(thunk));

export default createStore(
    allReducers,
    {
        user: {}
    },
    allStoreEnhanchers
);