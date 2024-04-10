import {height} from "../publics/Ui";

import React from "react";
import {Image, View} from "react-native";
import FastImage from "react-native-fast-image";

export default class ProgramImage extends React.Component {


    render() {
        const {componentHeight = (25 / 100)} = this.props;
        return (
            <View
                style={{
                    height: height * componentHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',

                }}>

                <FastImage
                    source={require('../../assets/images/imgs/ic_mashinchi.png')}
                    style={{width: '60%', height: '100%', marginTop: '5%'}}
                    resizeMode={"contain"}
                />

            </View>
        );
    }

}


