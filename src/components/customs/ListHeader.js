import React from "react";
import {Image, TouchableOpacity, View} from "react-native";
import MyText from "./MyText";
import {Medium} from "../publics/Ui";
import FastImage from "react-native-fast-image";


export default class ListHeader extends React.Component {


    render() {
        const {height = '25%',leftText="همه" ,rightText=" رسانه " , onPress = null} = this.props;
        return (
            <View style={{height: height, flexDirection: 'row'}}>
                <TouchableOpacity
                    style={{flex: 0.2, flexDirection: 'row', alignItems: 'center'}}
                    onPress={onPress}>
                    <FastImage
                        style={{width: 17, height: 13}}
                        source={require("../../assets/images/icons/left-arrow.png")}
                    />
                    <MyText
                        text={leftText}
                    />
                </TouchableOpacity>

                <View style={{flex: 0.2}}>

                </View>

                <View style={{flex: 0.6, justifyContent: 'center', paddingRight: 5}}>
                    <MyText
                        componentStyles={{fontSize: Medium}}
                        text={rightText}
                    />
                </View>
            </View>
        )
    }
}