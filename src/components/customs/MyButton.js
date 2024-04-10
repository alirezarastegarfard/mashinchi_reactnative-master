import React from "react";
import {TouchableOpacity, View, StyleSheet, ActivityIndicator, Text} from "react-native";
import MyText from "./MyText";
import {AccentColor, PrimaryTextColor} from "../publics/Ui";
import propTypes from 'prop-types';


export default class MyButton extends React.Component {


    render() {

        const {
            viewStyle,
            buttonOnPress,
            touchableOpacityStyle,
            loading = false,
        } = this.props;

        return (
            <View
                style={[Styles.viewStyleIndoor, viewStyle]}>
                <TouchableOpacity
                    disabled={loading}
                    onPress={buttonOnPress}
                    style={[Styles.touchableOpacityStyleIndoor, touchableOpacityStyle]}>
                    {this.renderLoading()}
                </TouchableOpacity>
            </View>
        )
    }

    renderLoading() {
        const {text = "تست", loading = false, textStyle={  color: 'white'}, activityIndicatorColor = 'white'} = this.props;

        if (loading === false) {
            return (<MyText text={text}
                            componentStyles={[Styles.textStyleIndoor, textStyle]}
            />)
        }
        if (loading === true) {

            return (<ActivityIndicator color={activityIndicatorColor} size={"large"}/>)

        }


    }
}

const Styles = StyleSheet.create({

    viewStyleIndoor: {
        marginRight: '8%',
        marginLeft: '8%',
        marginTop: '8%', height: 60,

    },
    touchableOpacityStyleIndoor: {
        width: '100%', height: '100%',
        backgroundColor: AccentColor,
        borderRadius: 4,
        alignItems: 'center', justifyContent: 'center'
    },

    textStyleIndoor: {color: 'white'}

});

MyButton.propTypes = {
    viewStyle:propTypes.any,
    buttonOnPress:propTypes.func,
    touchableOpacityStyle: propTypes.any,
    loading :propTypes.bool,
    text:propTypes.string,
    textStyle: propTypes.any,
    activityIndicatorColor: propTypes.string,
};
