'use strict';

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    AsyncStorage
} from 'react-native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Validation from '../constants/Validation';
import Placeholder from '../constants/Placeholder';
import TextField from "../components/TextField";
import CheckboxFormX from 'react-native-checkbox-form';
import PropTypes from 'prop-types';
import DodgeKeyboard from "../components/DodgeKeyboard";
import { getStoredItem, setStoreItem, isEmpty, isArray, after } from '../utils/sImoUtils';
import { userLogin, userReset } from '../actions/userActions';
import Spinner from 'react-native-loading-spinner-overlay';

import {connect} from "react-redux"
@connect (store => {
    return {
        user: store.user
    }
})
export default class LoginScreen extends React.Component {
    state = {
        email: '',
        password: '',
        emailError: null,
        passwordError: null,
        invalid: true,
        rememberMe: true,
        rememberedUsers: [],
        spinner: false
    };
    
    rememberMeData = [
        {
            label: 'Remember me',
            value: true
        }
    ];
    
    buttonPress = () => {
        const { email, password } = this.state;
        
        this.props.dispatch(userLogin({userName: email, password: password}));
        this.setState({spinner: true})
    };
    
    emailChange = (data) => {
        const dataIsObject = typeof data === 'object';
        const email = dataIsObject ? data.email : data;
        
        let thisStates = {
            email: email
        };
        
        if (dataIsObject) {
            thisStates.password = base64.decode(data.password)
        }
        
        thisStates.emailError = email === '' ? Validation.email.absent : null;
        
        const emailIsValid = Validation.email.isValid(email),
            passwordIsValid = Validation.password.isValid(thisStates.password ? thisStates.password : this.state.password);
        
        thisStates.invalid = !emailIsValid || !passwordIsValid;
        
        if (emailIsValid) { thisStates.emailError = null }
        if (passwordIsValid) { thisStates.passwordError = null }
        
        this.setState(thisStates)
    };
    
    pwdChange = (password) => {
        let thisStates = {
            password: password
        };
        
        thisStates.passwordError = password === '' ? Validation.password.absent : null;
        
        thisStates.invalid = !Validation.email.isValid(this.state.email) || !Validation.password.isValid(password);
        
        this.setState(thisStates)
    };
    
    emailBlur = () => {
        const { password, email } = this.state;
        if (!Validation.email.isValid(email)){
            this.setState({
                emailError: email === '' ? Validation.email.absent : Validation.email.invalid,
                invalid: true
            })
        } else {
            this.setState({
                emailError: null,
                invalid: !Validation.password.isValid(password)
            })
        }
    };
    
    pwdBlur = () => {
        const { password, email } = this.state;
        if (!Validation.password.isValid(password)){
            this.setState({
                passwordError: password === '' ? Validation.password.absent : Validation.password.invalid,
                invalid: true
            })
        } else {
            this.setState({
                passwordError: null,
                invalid: !Validation.email.isValid(email)
            })
        }
    };
    
    onRememberMeClick = (item) => this.setState({rememberMe: item[0].value});
    
    componentDidMount() {
        getStoredItem('ttUList', (err, result) => {
            if (err) {
                console.log('[componentDidMount] get ttUList err: ', err);
            } else {
                console.log('getStoredItem->ttUList: ', result);

                const rU = JSON.parse(result);
                if (rU) {
                    if (!isArray(rU)) {
                        AsyncStorage.clear(()=>{
                            this.setState({rememberedUsers: []})
                        });
                    } else {
                        this.setState({rememberedUsers: rU})
                    }
                }
            }
        })
    }
    
    componentDidUpdate() {
        if (this.props.user && this.props.user.error) {
            Alert.alert('Login', this.props.user.error.message, [{text: 'Close', style: 'close'}]);
            
            this.setState({spinner: false});
            this.props.dispatch(userReset());
        } else if (!isEmpty(this.props.user) && !this.props.isAuthenticated) {
            this.props.callback(true);
            let thisArrayUsers = [];
            
            const thisUser = {
                email: this.state.email,
                password: base64.encode(this.state.password)
            };
            
            getStoredItem('ttUList', (err, result) => {
                if (err) {
                    console.log('[buttonPress] get ttUList err: ', err);
                } else {
                    let rU = JSON.parse(result);
                    
                    if (rU) {
                        rU = rU.filter((user) => {
                            return user.email.toLowerCase().trim() !== thisUser.email.toLowerCase().trim()
                        });
                        
                        thisArrayUsers = rU;
                    }
                }
                
                if (this.state.rememberMe) {
                    thisArrayUsers.push(thisUser);
                    setStoreItem('ttUList', thisArrayUsers, () => {
                        this.props.callback(true);
                    });
                } else if (thisArrayUsers.length > 0) {
                    setStoreItem('ttUList', thisArrayUsers, () => {
                        this.props.callback(true);
                    });
                } else {
                    AsyncStorage.clear(() => {
                        this.props.callback(true);
                    });
                }
            });
        }
    }
    
    autoCompleteSearch = (searchedText) => {
        if (this.state.rememberedUsers.length < 1) {
            return []
        }
        
        return this.state.rememberedUsers.filter(function(user) {
            return user.email.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
        });
    };
    
    render() {
        console.log('LogScreen->render');
        console.log('-----------------');
        
        console.log('LoginScreen props: ', this.props);
        console.log('LoginScreen state: ', this.state);
        
        const { spinner, email, password, emailError, passwordError, invalid, rememberedUsers } = this.state;
        
        return (
            <DodgeKeyboard duration={100} behavior={'position'}>
                <Spinner
                    visible={spinner}
                    textContent={'Logging you in...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={styles.container} disabled={true}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image}
                               source={ require('../assets/images/Logo.png') }
                        />
                    </View>
                    
                    <View style={styles.bottomView}>
                        <Text style={styles.bottomViewLabel}>Email</Text>
                        
                        <TextField
                            placeHolder={Placeholder.email}
                            onChange={this.emailChange}
                            value={email}
                            onBlur={this.emailBlur}
                            error={emailError}
                            autoComplete={true}
                            autoCompleteData={rememberedUsers}
                            autoCompleteSearch={this.autoCompleteSearch}
                        />
                        
                        <Text style={[styles.bottomViewLabel]}>Password</Text>
                        
                        <TextField
                            placeHolder={Placeholder.password}
                            secure={true}
                            onChange={this.pwdChange}
                            onBlur={this.pwdBlur}
                            value={password}
                            error={passwordError}
                        />
                        
                        <TouchableOpacity
                            onPress={this.buttonPress}
                            disabled={invalid}
                            style={[styles.marginTop10, invalid ? styles.disabledButtonStyle : null]} >
                            <View
                                style={styles.buttonStyle}>
                                <Text
                                    style={styles.buttonTextStyle}>
                                    Sign In
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                        <CheckboxFormX
                            style={{ height: 30, marginLeft: -20, marginTop: 10 }}
                            dataSource={this.rememberMeData}
                            itemShowKey="label"
                            itemCheckedKey="value"
                            iconSize={30}
                            labelHorizontal={true}
                            onChecked={(item) => this.onRememberMeClick(item)}
                        />
                    </View>
                </View>
            </DodgeKeyboard>
        );
    }
}

const base64 = require('base-64'),
    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.backgroundColor,
            width: '100%',
            height: '100%',
            padding: 20,
            alignItems: 'center',
            overflow: 'hidden'
        },
        
        imageContainer: {
            alignItems: 'center',
            height: Layout.isSmallDevice ? '45%' : '50%',
        },
        
        image: {
            position: 'absolute',
            bottom: 0,
            resizeMode: 'contain',
        },
        
        bottomView: {
            width: '100%',
            position: 'absolute',
            bottom: 10,
            backgroundColor: '#ffffff'
        },
        
        bottomViewLabel: {
            fontSize: 17,
            color: 'rgba(96,100,109, 1)',
            marginBottom: 5
        },
        
        inputStyles: {
            height: 40,
            borderColor: Colors.themeColor,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10
        },
        
        buttonStyle: {
            borderRadius: 5,
            paddingVertical: 10,
            backgroundColor: Colors.themeColor,
            alignItems: 'center'
        },
        
        buttonTextStyle: {
            alignItems: 'center',
            color: Colors.buttonTextColor,
            fontSize: 20,
            fontWeight: 'bold'
        },
        
        disabledButtonStyle: {
            opacity: 0.2
        },
        
        marginBottom20: {
            marginBottom: 20
        },
        
        marginTop10: {
            marginTop: 10
        },
        spinnerTextStyle: {
            color: '#FFF'
        }
    });

LoginScreen.propTypes = {
    callback: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

LoginScreen.defaultProps = {
    isAuthenticated: false
};