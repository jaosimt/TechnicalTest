'use strict';

import React from 'react';

import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView
} from 'react-native';

import PropTypes from 'prop-types';
import Colors from '../constants/Colors';

export default class TextField extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            autoCompleteSearch: []
        };
        
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }
    
    renderUserName = (user) => {
        return (
            <View>
                <Text style={{paddingVertical: 5}} onPress={
                    () => {
                        this.setState({autoCompleteSearch: []});
                        this.props.onChange(user)
                    }
                }>{user.email}</Text>
            </View>
        );
    };
    
    //autoCompleteSearch = (searchedText) => {
    //    const autoCompleteSearch = this.props.autoCompleteData.filter(function(user) {
    //        return user.email.toLowerCase().indexOf(searchedText.toLowerCase()) > -1;
    //    });
    //
    //    this.setState({autoCompleteSearch: autoCompleteSearch});
    //    this.props.onChange(searchedText);
    //};
    
    autoCompleteSearch = (searchedText) => {
        if (this.props.autoCompleteSearch) {
            const autoCompleteSearch = this.props.autoCompleteSearch(searchedText);
            this.setState({autoCompleteSearch: autoCompleteSearch});
        }
        
        this.props.onChange(searchedText);
    };
    
    render() {
        const { secure, error, value, placeHolder, onBlur, autoComplete } = this.props,
            { autoCompleteSearch } = this.state;
        
        return (
            <View style={styles.marginBottom20}>
                <TextInput secureTextEntry={secure}
                           style={styles.inputStyles}
                           placeholder={placeHolder}
                           onChangeText={this.autoCompleteSearch}
                           onBlur={onBlur}
                           value={value}
                />
                {
                    autoComplete && value !== '' && autoCompleteSearch.length ?
                        <ListView
                            style={styles.listViewStyles}
                            dataSource={this.ds.cloneWithRows(autoCompleteSearch)}
                            renderRow={this.renderUserName}
                        /> : null
                }
                {
                    error ? <Text style={styles.errorStyle}>{error}</Text> : null
                }
            </View>
        );
    }
}

TextField.propTypes = {
    value: PropTypes.string,
    placeHolder: PropTypes.string,
    error: PropTypes.string,
    secure: PropTypes.bool,
    autoComplete: PropTypes.bool,
    autoCompleteData: PropTypes.array,
    autoCompleteSearch: PropTypes.func,
    onChange: PropTypes.func,
    onBlur: PropTypes.func
};

TextField.defaultProps = {
    value: '',
    placeHolder: '',
    error: null,
    secure: false,
    autoComplete: false,
    autoCompleteData: [],
    autoCompleteSearch: null,
    onChange: () => {},
    onBlur: () => {}
};

const styles = StyleSheet.create({
    inputStyles: {
        height: 40,
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    marginBottom20: {
        marginBottom: 20
    },
    errorStyle: {
        position: 'absolute',
        marginTop: 40,
        color: Colors.errorColor,
        fontStyle: 'italic'
    },
    listViewStyles: {
        position: 'absolute',
        marginTop: 40,
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: '100%',
        backgroundColor: '#ffffff',
        zIndex: 1
    }
});