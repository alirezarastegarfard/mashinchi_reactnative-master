import React from "react";
import {BaseURL, ImagesAddress} from "../publics/DataBase";
import {height, width} from "../publics/Ui";
import TouchableScale from "react-native-touchable-scale";
import {Image, StyleSheet, View} from "react-native";
import FastImage from "react-native-fast-image";

export default class UsuallImageBanner extends React.Component {

    render() {
        const {viewStyle} = this.props;
        return (
            <View
                style={[Styles.InnerViewStyle, viewStyle]}>
                {this.renderImages()}
            </View>
        )
    }

    renderImages() {
        const {data, ImageStyle , onPress = null} = this.props;

        return (
            <TouchableScale
                style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}
                activeScale={0.98}
                onPress={ () => {

                    if (onPress !== null)
                        onPress(data);

                }}>
                <FastImage
                    style={[Styles.InnerImageStyle, ImageStyle]}
                    source={{uri: BaseURL + ImagesAddress + data.Image}}
                />
            </TouchableScale>

        );

    }
}


const Styles = StyleSheet.create({

    InnerViewStyle:
        {
            height: height * .36, width: width * 1,backgroundColor:'transparent',
            justifyContent: 'center',
            alignItems: 'center',

        },

    InnerImageStyle:
        {
            width: '98%', height: '100%'
        },

    InnerInsideImageStyle:
        {
            width: '100%', height: '100%'
        },



});
