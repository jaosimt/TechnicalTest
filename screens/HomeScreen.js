'use strict';

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import PropTypes from 'prop-types';

export default class HomeScreen extends React.Component {
    buttonPress = () => {
        if (this.props.logOut) { this.props.logOut() }
    };
    
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcomeText}>This is Home!</Text>
                <View style={styles.imageContainer}>
                    <Image style={styles.image}
                           source={ require('../assets/images/Logo.png') }
                    />
                </View>
    
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        onPress={this.buttonPress}
                        style={styles.logOut} >
                            <Text style={styles.logoutText}>LOGOUT</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
        width: '100%',
        height: '100%',
        paddingHorizontal: 10,
        paddingVertical: 30,
        alignItems: 'center',
        overflow: 'hidden'
    },
    
    welcomeText: {
        color: Colors.themeColor,
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 50
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
        bottom: 0,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#ffffff',
        alignItems: 'flex-end'
    },
    
    logOut: {
        backgroundColor: Colors.themeColor,
        paddingVertical: 10,
        alignItems: 'center',
        width: 100
    },
    
    logoutText: {
        color: '#ffffff',
    }
});

HomeScreen.propTypes = {
    logOut: PropTypes.func
};

HomeScreen.defaultProps = {
    logOut: null
};