import React from 'react';
import { AppLoading, Asset } from 'expo';
import LoginScreen from "./screens/LoginScreen";

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
    };
    
    render() {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            return (
                <LoginScreen/>
            );
        }
    }
    
    _loadResourcesAsync = async () => {
        return Promise.all([
            Asset.loadAsync([
                require('./assets/images/Logo.png'),
            ])
        ]);
    };
    
    _handleLoadingError = error => {
        console.warn(error);
    };
    
    _handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };
}