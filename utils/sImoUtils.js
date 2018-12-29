'use strict';

import {
    AsyncStorage
} from 'react-native';


const timeStamp = () => {
    return new Date().getTime();
};

const toCamelCase = (string) => {
    if (!string) { return '' }
    
    return string.toLowerCase().replace(/ (.)/g, (m, p) => {
        return p.toUpperCase()
    })
};

const capitalized = (string) => {
    return string.replace(/^\w| \w/igm, (a) => {
        return a.toUpperCase()
    })
};

const isEmpty = (obj, evalRule) => {
    //----------------------------------------------------------------------------------------------------------------
    //  Argument evalRule       [Optional]
    //
    //      validValues         true | strict       >>  Strict mode or Boolean Only mode > ignores non Boolean objects
    //                          loose               >>  Loose mode > evaluates false on undefined objets only
    //                                                  e.g. will only check if object or node exists
    //                          false               >>  Default mode > evaluates true on non-empty objects
    //----------------------------------------------------------------------------------------------------------------
    
    evalRule = (evalRule === true) || (evalRule === "strict") ? "strict" : (evalRule !== false) && (evalRule !== "loose" ) ? false : evalRule;
    let obj_type = typeof(obj), is_empty = true;
    
    if (evalRule === "strict") {
        is_empty = !((obj_type === "boolean") && (obj === true));
    } else if (evalRule === "loose") {
        is_empty = obj_type === "undefined";
    } else {
        switch (obj_type) {
            case "boolean":
                is_empty = !obj;
                break;
            case "nodelist":
            case "array":
            case "object":
                is_empty = obj === null || false || Object.keys(obj).length < 1;
                break;
            case "number":
                is_empty = isNaN(obj);
                break;
            case "string":
                is_empty = obj.trim() === "";
                break;
            case "error":
            case "date":
            case "regexp":
            case "function":
                is_empty = false;
                break;
            default:
            // default _empty eq true as declared above when type is non of the above
        }
    }
    return is_empty;
};

const isDefined = (obj) => {
    return (typeof obj).toLowerCase() !== "undefined"
};

const isString = (obj) => {
    return (typeof obj).toLowerCase() === "string"
};

const isNumber = (obj) => {
    return (typeof obj).toLowerCase() === "number"
};

const isBoolean = (obj) => {
    return (typeof obj).toLowerCase() === "boolean"
};

const isFunction = (obj) => {
    return (typeof obj).toLowerCase() === "function"
};

const isObject = (obj) => {
    return (typeof obj).toLowerCase() === "object" && (obj.constructor.name).toLowerCase() === "object"
};

const isArray = (obj) => {
    return (typeof obj).toLowerCase() === "object" && (obj.constructor.name).toLowerCase() === "array"
};

const isNumeric = (obj, strict)  => {
    if (isBoolean(strict) ? strict : true) {
        return isNumber(obj)
    } else {
        return isNumber(obj) || (isString(obj) && obj.match(/^[-+]*\d+(,\d\d\d)*(\.\d+)*$/));
    }
};

const isDecimal = (n) => {
    n = parseFloat(n);
    return isNumber(n) && n % 1 !== 0;
};

const cloneArray = (array) => {
    if (!isArray(array)) {
        return [];
    }
    
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i]);
    }
    
    return newArray
};

const after = (millisecondsTimeout, callback) => {
    if (isNumber(millisecondsTimeout) && isFunction(callback)) {
        setTimeout(callback, millisecondsTimeout);
    }
};

const getSessionUser = (callback) => {
    const base64 = require('base-64');
    const userKey = base64.encode('user');
    
    let sessionUser = null;
    
    getStoredItem(userKey, (err, result) => {
        if (!isEmpty(result)) {
            //sessionUser = JSON.parse(base64.decode(result));
        }

        //  ToDo: Session Expire should be handled in the backend
        if (sessionUser && sessionUser.logged_at) {
            const diff = (timeStamp() - sessionUser.logged_at) / 1000 / 60 / 60;

            if (diff > 1) {
                console.log("getSessionUser ->  expired session (1hr)");
                removeStoredItem(userKey);
                if (isFunction(callback)) { callback(null) } else { return null }
            }

            if (isFunction(callback)) { callback(sessionUser) } else { return sessionUser }
        } else {
            console.log("getSessionUser -> no user session");
            if (isFunction(callback)) { callback(null) } else { return null }
        }
    });
};

const getStoredItem = (key, callback) => {
    AsyncStorage.getItem(key, (err, result) => {
        if (isFunction(callback)) {
            callback(err, result)
        }
    });
};

const removeStoredItem = (key, callback) => {
    AsyncStorage.removeItem(key, (err) => {
        if (isFunction(callback)) {
            callback(err)
        }
    });
};

const setStoreItem = (key, value, callback) => {
    const storeValue = JSON.stringify(value);
    AsyncStorage.setItem(key, storeValue, (error) => {
        console.log('AsyncStorage.setItem: ', error || key);
        if (isFunction(callback)) { callback(error) }
    });
};

const isReachable = (url, timeOut, callback) => {
    const timeout = new Promise((resolve, reject) => {
        setTimeout(reject, timeOut, 'request timed out');
    });
    
    const request = fetch(url);
    
    return Promise
        .race([timeout, request])
        .then(json => {
            if (isFunction(callback)) { callback(true) } else { return true }
        })
        .catch(err => {
            if (isFunction(callback)) {callback(false)}  else { return false }
        })
};

module.exports = {
    isReachable: isReachable,
    getStoredItem: getStoredItem,
    setStoreItem: setStoreItem,
    removeStoredItem: removeStoredItem,
    toCamelCase: toCamelCase,
    getSessionUser: getSessionUser,
    capitalized: capitalized,
    isDefined: isDefined,
    isEmpty: isEmpty,
    isString: isString,
    isNumber: isNumber,
    isBoolean: isBoolean,
    isFunction: isFunction,
    isObject: isObject,
    isArray: isArray,
    isNumeric: isNumeric,
    isDecimal: isDecimal,
    cloneArray: cloneArray,
    after: after,
    timeStamp: timeStamp
};