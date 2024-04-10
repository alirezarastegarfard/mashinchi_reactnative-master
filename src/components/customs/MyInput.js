import React from "react";
import {AccentColor, AppFont, backColor, BorderColor, Small} from "../publics/Ui";
import { StyleSheet, TextInput, View,ViewPropTypes} from "react-native";
import propTypes from "prop-types"


export default class MyInput extends React.Component {
    render() {
        const {viewStyle,inputStyle} = this.props;
        return (
            <View
                style={[Styles.InnerViewStyle, viewStyle]}>
                <TextInput
                    {...this.props}
                    style={[Styles.InnerInputStyle, inputStyle]}
                    underlineColorAndroid="transparent"
                />
            </View>
        )
    }
}

MyInput.propTypes={
    viewStyle:ViewPropTypes.style,
    inputStyle:TextInput.propTypes.style
};

const Styles = StyleSheet.create({

    InnerViewStyle:
        {
            height: 40,
            backgroundColor: backColor,
            marginRight: '10%',
            marginLeft: '10%',
            borderRadius: 5,
            borderColor: BorderColor,
            borderWidth: 1,
            justifyContent: 'center',
            paddingRight: 5
        },

    InnerInputStyle: {
        width: '100%',
        height: '100%',
        fontFamily: AppFont,
        color:AccentColor,
        backgroundColor: 'transparent',
        fontSize: Small,
        textAlign: 'right',
    }


});
