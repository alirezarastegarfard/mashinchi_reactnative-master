import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import BaseLightbox from '../basepage/BaseLightbox';
import {Actions} from 'react-native-router-flux';
import MyText from "../customs/MyText";
import EStyleSheet from "react-native-extended-stylesheet";
import {AccentColor, PrimaryTextColor} from "../publics/Ui";
import styles from '../publics/homeStyle';
import QuestionIcon from '../../assets/images/icons/questionIcon.png';
import InformationIcon from '../../assets/images/icons/information.png';
import FastImage from "react-native-fast-image";

export default class QuestionDialog extends BaseLightbox{

    render(){

        const { Message , onConfirm = null , onCancel = null , ConfirmText = "بله" , CancelText = "خیر" , Type = "Question" } = this.props;

        return(

            <BaseLightbox
                verticalPercent={0.8}
                horizontalPercent={0.23}
                cancelOutTouchSide={false}>
                <View
                    style={{justifyContent : 'center' , alignItems: 'center'}}>

                    <FastImage
                        source={Type === "Question" ? QuestionIcon : InformationIcon}
                        style={PublicStyle.DialogImageSize}
                    />

                    <MyText
                        componentStyles={PublicStyle.DialogTextMessage}
                        text={Message}
                    />

                    <View
                        style={{
                            width : '50%',
                            flexDirection : 'row' ,
                            justifyContent:'space-between',
                            alignItems : 'center'}}>

                        <TouchableOpacity
                            style={[styles.ButtonStyle,{
                                backgroundColor:'transparent',
                                borderWidth : 1,
                                borderColor : AccentColor,
                                width : '80%',
                                marginRight : '2%'
                            }]}
                            activeOpacity={.7}
                            onPress={() => {
                                if (onCancel !== null)
                                    onCancel();
                                Actions.pop();
                            }}>
                            <MyText
                                componentStyles={{
                                    color:PrimaryTextColor
                                }}
                                text={CancelText}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.ButtonStyle,{
                                backgroundColor:AccentColor,
                                width : '80%',
                                marginLeft : '2%'
                            }]}
                            activeOpacity={.7}
                            onPress={() => {
                                if (onConfirm !== null)
                                    onConfirm();

                                Actions.pop();

                            }}>
                            <MyText
                                componentStyles={{color:'white'}}
                                text={ConfirmText}
                            />
                        </TouchableOpacity>

                    </View>

                </View>

            </BaseLightbox>

        );

    }

}

const PublicStyle = EStyleSheet.create({
    DialogImageSize : {
        width:45,
        height:45
    },
    DialogTextMessage : {
        marginTop:10,
        marginBottom:10,
        color:PrimaryTextColor,
        fontSize : 13,
        textAlign : 'center'
    }

});