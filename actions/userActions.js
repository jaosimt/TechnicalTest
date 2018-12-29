'use strict';

import { axPOST } from "./axiosRequests";
import { isFunction, timeStamp } from "../utils/sImoUtils";
import { removeStoredItem, setStoreItem, isEmpty } from '../utils/sImoUtils';

export const UPDATE_USER = 'users:updateUser';
export const SHOW_ERROR = 'users:showError';

const base64 = require('base-64');

export function updateUser(newUser) {
    if (!isEmpty(newUser)) {
        newUser.logged_at = timeStamp();
        setStoreItem(base64.encode('user'), base64.encode(JSON.stringify(newUser)));
    } else {
        removeStoredItem(base64.encode('user'));
    }
    
    return {
        type: UPDATE_USER,
        payload: {
            user: newUser
        }
    }
}

export function showError(error){
    removeStoredItem(base64.encode('user'));
    
    return {
        type: SHOW_ERROR,
        payload: {
            user: {
                error: error
            }
        }
    }
}

export function userReset(){
    return dispatch => {
        dispatch(updateUser({}))
    }
}

export function userSignUp(data, callback, failCallback){
    let userData = data.userData;
    const imageData = data.imageData;
    
    log(userData, 'userData');
    log(imageData, 'imageData');
    
    return dispatch => {
        axPOST('/image/upload/profileImage/' + userData.userName, imageData, (response) => {
            if (isFunction(callback)) {
                log(response, 'addUserProfileImageResponse');
                
                if (response.data.length && response.data[0].path) {
                    userData.image = response.data[0].path.replace(/^public\//, '')
                }
                
                axPOST('/user/signup', userData, (response) => {
                    if (isFunction(callback)) {
                        log(response, 'addLoginUserResponse');
                        
                        dispatch(updateUser(response.data));
                        callback(response)
                    }
                }, (error) => {
                    dispatch(showError(error));
                    
                    if (isFunction(failCallback)) {
                        failCallback(error)
                    }
                })
            }
        }, (error) => {
            log(error, 'addUserProfileImageResponseError');
            
            dispatch(showError(error));
            
            if (isFunction(failCallback)) {
                failCallback(error)
            }
        }, { 'content-type': 'multipart/form-data' })
    }
}

export function checkUserAuth(sessionUser, callback){
    if (sessionUser) {
        axPOST("/user/auth", sessionUser, (response) => {
            if (isFunction(callback)) {
                callback(response);
            }
        });
    } else {
        if (isFunction(callback)) {
            callback(null);
        }
        
        log("No session user [ checkUserAuth ]");
    }
}

export function userLogin(data, callback){
    return dispatch => {
        axPOST('/user/login', data, (response) => {
            console.log("userLogin -> response: ", response);
            
            dispatch(updateUser(response.data));
            if (isFunction(callback)) {
                callback(true);
            }
        }, (error) => {
            console.log("userLogin -> error: ", error);
            
            dispatch(showError(error));
            if (isFunction(callback)) {
                callback(false);
            }
        })
    }
}