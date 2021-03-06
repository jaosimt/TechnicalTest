'use strict';

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
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

export default class LoginScreen extends React.Component {
    state = {
        email: '',
        password: '',
        emailError: null,
        passwordError: null,
        invalid: true,
        rememberMe: true,
        rememberedUsers: []
    };
    
    rememberMeData = [
        {
            label: 'Remember me',
            value: true
        }
    ];
    
    buttonPress = () => {
        const { email, password, rememberMe } = this.state;
        const thisUser = {
            email: email,
            password: base64.encode(password)
        };
        let thisArrayUsers = [];
        
        this.getStoredItem('ttUList', (err, result) => {
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
            
            if (rememberMe) {
                thisArrayUsers.push(thisUser);
                this.setStoreItem(thisArrayUsers, () => {
                    this.props.callback(true);
                });
            } else if (thisArrayUsers.length) {
                this.setStoreItem(thisArrayUsers, () => {
                    this.props.callback(true);
                });
            } else {
                AsyncStorage.clear(() => {
                    this.props.callback(true);
                });
            }
        });
        
    };
    
    getStoredItem = (key, callback) => {
        AsyncStorage.getItem(key, (err, result) => {
            callback(err, result)
        });
    };
    
    setStoreItem = (users, callback) => {
        AsyncStorage.setItem('ttUList', JSON.stringify(users), (error) => {
            console.log('AsyncStorage.setItem: ', error || JSON.stringify(users));
            
            if (callback) { callback() }
        });
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
        this.getStoredItem('ttUList', (err, result) => {
            if (err) {
                console.log('[componentDidMount] get ttUList err: ', err);
            } else {
                const rU = JSON.parse(result);
                if (rU) {
                    this.setState({rememberedUsers: rU})
                }
            }
        })
    }
    
    autoCompleteSearch = (searchedText) => {
        return this.state.rememberedUsers.filter(function(user) {
            return user.email.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
        });
    };
    
    render() {
        const { email, password, emailError, passwordError, invalid, rememberedUsers } = this.state;
        
        return (
            <DodgeKeyboard duration={100} behavior={'position'}>
                <View style={styles.container}>
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
        }
    });

LoginScreen.propTypes = {
    callback: PropTypes.func.isRequired
};