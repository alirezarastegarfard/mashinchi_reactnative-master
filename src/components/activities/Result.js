import React, {Component} from 'react';
import BaseUi from "../basepage/BaseUi";
import {Image, View, StyleSheet, BackHandler} from "react-native";
import MyText from "../customs/MyText";
import {Medium, SecondaryTextColor} from "../publics/Ui";
import MyButton from "../customs/MyButton";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";

export default class Result extends Component {

    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () =>{
        Actions.reset('Splash');
        return true;
    };

    render() {
        return (
            <BaseUi>

                <View style={Result_Style.MainView}>
                    <FastImage style={Result_Style.ImageStyle}
                           source={require('../../assets/images/icons/ok.png')}/>
                </View>

                <View style={Result_Style.TextViewStyle}>

                    <MyText text={'با تشکر بابت ثبت اطلاعات شغلی\n' +
                    'درخواست شما ثبت شد.\n' +
                    'پس از بررسی تیم ماشینچی جهت تایید نهایی با\n' +
                    'شما تماس گرفته خواهد شد.'}
                            componentStyles={Result_Style.TextStyle}
                    />
                </View>


                <View style={Result_Style.ButtonView}>
                    <MyButton
                        viewStyle={Result_Style.ButtonStyle}
                        text={"تایید"}
                        activityIndicatorColor={"white"}
                        buttonOnPress={() => Actions.reset('Splash')}
                    />
                </View>


            </BaseUi>


        )
    }

}


const Result_Style = StyleSheet.create({
    MainView: {flex: 0.4, justifyContent: 'center', alignItems: 'center'},
    ImageStyle: {width: 150, height: 150},
    TextViewStyle: {flex: 0.4, justifyContent: 'center', alignItems: 'center'},
    TextStyle: {textAlign: 'center', fontSize: Medium, lineHeight: 30, color: SecondaryTextColor},
    ButtonView: {flex: 0.2, justifyContent: 'center'},
    ButtonStyle: {height: 50, marginRight: 30, marginLeft: 30, marginTop: 20}


});