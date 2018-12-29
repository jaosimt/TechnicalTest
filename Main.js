'use strict';

import React from 'react';
import { AppLoading, Asset } from 'expo';
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { userReset } from "./actions/userActions";
import { Alert } from 'react-native';

class Main extends React.Component {
    state = {
        isLoadingComplete: false,
        isAuthenticated: false
    };
    logInAlert = false;
    
    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this.loadResourcesAsync}
                    onError={this.handleLoadingError}
                    onFinish={this.handleFinishLoading}
                />
            );
        } else {
            return (
                this.state.isAuthenticated ? <HomeScreen logOut={this.logOut}/> :
                    <LoginScreen
                        isAuthenticated={this.state.isAuthenticated}
                        dispatch={this.props.dispatch}
                        callback={this.loginCallback}
                    />
            )
        }
    }
    
    loginCallback = (authenticated) => {
        this.setState({isAuthenticated: authenticated});
        if (authenticated && !this.logInAlert) {
            this.logInAlert = true;
            Alert.alert('Login', 'Successfully Logged In',
                [{ text: 'Close', onPress: () => this.logInAlert = false }],
                { cancelable: false })
        }
    };
    
    logOut = () => {
        this.setState({isAuthenticated: false});
        this.props.dispatch(userReset());
    };
    
    loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/Logo.png'),
            ])
        ]);
    };
    
    handleLoadingError = error => {
        console.warn(error);
    };
    
    handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };
}

const userSelector = createSelector(
    state => state.user,
    user => user
);

const mapStateToProps = createSelector(
    userSelector,
    (user) => ({
        user
    })
);

const actionsToProps = {
    userReset: userReset,
    dispatch: (dispatch) => {
        return dispatch
    }
};

export default connect(mapStateToProps, actionsToProps)(Main);
