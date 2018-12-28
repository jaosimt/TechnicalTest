'use strict';

import React from 'react';
import { AppLoading, Asset } from 'expo';
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { userReset } from "./actions/userActions";


class Main extends React.Component {
    state = {
        isLoadingComplete: false,
        isAuthenticated: false
    };
    
    render() {
        console.log('App props: ', this.props);
        console.log('App isAuthenticated: ', this.state.isAuthenticated);
        
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
                    <LoginScreen callback={this.loginCallback}/>
            )
        }
    }
    
    loginCallback = (authenticated) => {
        this.setState({isAuthenticated: authenticated});
        if (authenticated) {
            Alert.alert('Login', 'Successfully Logged In', [{text: 'Close', style: 'close'}])
        }
    };
    
    logOut = () => this.setState({isAuthenticated: false});
    
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
