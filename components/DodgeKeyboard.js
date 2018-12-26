import React from "react";
import {Animated, Keyboard} from "react-native";

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
                duration: 50,
                toValue: event.endCoordinates.height,
            })
        ]).start();
    };
    
    keyboardDidHide = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: 50,
                toValue: 0,
            })
        ]).start();
    };
    
    render(){
        const {children, style, ...props} = this.props;
        return(
            <Animated.View style={[{flex:1,alignItems:'center', bottom: this.keyboardHeight},style]} {...props}>
                {children}
            </Animated.View>
        );
    }
    
}