import React from 'react';
import {Image , TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

import EStyleSheet from "react-native-extended-stylesheet";
import BaseLightbox from "../basepage/BaseLightbox";
import {AccentColor, PrimaryTextColor, RedCircle} from "../publics/Ui";
import MyText from "../customs/MyText";
import FastImage from "react-native-fast-image";

export default class ExceptionDialog extends React.Component{

    render(){

        const { Message , onConfirm = null } = this.props;

        return(

            <BaseLightbox
                verticalPercent={0.8}
                horizontalPercent={0.23}
                cancelOutTouchSide={false}>
                <FastImage
                    source={require('../../assets/images/icons/exceptionIcon.png')}
                    style={PublicStyle.DialogImageSize}
                />

                <MyText
                    componentStyles={PublicStyle.DialogTextMessage}
                    text={Message}
                />

                <TouchableOpacity
                    style={PublicStyle.ButtonStyle}
                    activeOpacity={.7}
                    onPress={() => {

                        if (onConfirm !== null)
                            onConfirm();

                        Actions.pop();

                    }}>
                    <MyText
                        componentStyles={{color:'white'}}
                        text={"تأیید"}
                    />
                </TouchableOpacity>

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
        fontSize : 13
    },
    ButtonStyle: {
        width: '80%',
        height: 30,
        backgroundColor: RedCircle,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        '@media ios ': {
            paddingTop: 5
        }
    }

});