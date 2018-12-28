'use strict';

import axios from "axios";
import { timeStamp, isFunction } from "../utils/sImoUtils";

export const baseApiURL = 'http://localhost:7777/api';

export function dataHandler(response) {
    if (response && response.status) {
        
        return {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        };
    }
    
    return response
}

function addParamTimeStamp(url) {
    url = url.split('?');
    return url[0] + ('?t=' + timeStamp()) + (url[1] ? ('&' + url[1]) : '');
}

export function axPOST(url, payload, success_callback, fail_callback, headers) {
    let config = {
        method: 'post',
        url: addParamTimeStamp(baseApiURL + url),
        data: payload
    };
    
    if (headers) {
        config.headers = headers
    }
    
    return axios(config).then((xhr_data) => {
        if (!isFunction(success_callback)) {
            return dataHandler(xhr_data);
        }
        
        return success_callback(dataHandler(xhr_data));
    }).catch((err) => {
        if (!isFunction(fail_callback)) {
            return dataHandler(err);
        }
        
        return fail_callback(dataHandler(err));
    })
}

export function axPUT(url, payload, success_callback, fail_callback) {
    let tstamp_url = addParamTimeStamp(baseApiURL + url);
    
    return axios.put(tstamp_url, payload).then((xhr_data) => {
        if (!isFunction(success_callback)) {
            return dataHandler(xhr_data);
        }
        
        return success_callback(dataHandler(xhr_data));
    }).catch((err) => {
        if (!isFunction(fail_callback)) {
            return dataHandler(err);
        }
        
        return fail_callback(dataHandler(err));
    })
}

export function axDELETE(url, payload, success_callback, fail_callback) {
    let tstamp_url = addParamTimeStamp(baseApiURL + url);
    
    return axios.delete(tstamp_url).then((xhr_data) => {
        if (!isFunction(success_callback)) {
            return dataHandler(xhr_data);
        }
        
        return success_callback(xhr_data);
    }).catch((err) => {
        if (!isFunction(fail_callback)) {
            return dataHandler(err);
        }
        
        return fail_callback(dataHandler(err));
    })
}

export function axGET(url, success_callback, fail_callback) {
    let tstamp_url = addParamTimeStamp(baseApiURL + url);
    
    return axios.get(tstamp_url).then((xhr_data) => {
        if (!isFunction(success_callback)) {
            return dataHandler(xhr_data);
        }
        return success_callback(dataHandler(xhr_data));
    }).catch((err) => {
        if (!isFunction(fail_callback)) {
            return dataHandler(err);
        }
        return fail_callback(dataHandler(err));
    })
}