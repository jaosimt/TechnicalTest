import React from "react";
import {Animated, Keyboard} from "react-native";
import PropTypes from 'prop-types';

export default class DodgeKeyboard extends React.Component {
    constructor(props) {
        super(props);
        
        this.keyboardHeight = new Animated.Value(0);
        this.keyboardDidShow.bind(this);
        this.keyboardDidHide.bind(this);
    }
    
    componentWillMount () {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }
    
    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }
    
    keyboardDidShow = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: this.props.duration,
                toValue: event.endCoordinates.height,
            })
        ]).start();
    };
    
    keyboardDidHide = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: this.props.duration,
                toValue: 0,
            })
        ]).start();
    };
    
    render(){
        const {children, behavior} = this.props;
        let styles = {
            flex: 1
        };
        
        if (behavior === 'padding') {
            styles.paddingBottom = this.keyboardHeight;
        } else {
            // behaviour: position
            styles.bottom = this.keyboardHeight;
        }
        
        return(
            <Animated.View style={styles}>
                {children}
            </Animated.View>
        );
    }
}

DodgeKeyboard.propTypes = {
    behavior: PropTypes.string,
    duration: PropTypes.number
};

DodgeKeyboard.defaultProps = {
    behavior: 'padding',
    duration: 500 // milliseconds
};