import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import EStyleSheet from "react-native-extended-stylesheet";
import BaseLightbox from "../basepage/BaseLightbox";
import {AccentColor, LocationBlue, PrimaryTextColor} from "../publics/Ui";
import MyText from "../customs/MyText";
import FastImage from "react-native-fast-image";

export default class LocationAccessDialog extends React.Component {

    render() {

        const {Message, onConfirm = null} = this.props;

        return (

            <BaseLightbox
                verticalPercent={0.8}
                horizontalPercent={0.26}
                cancelOutTouchSide={false}>
                <FastImage
                    source={require('../../assets/images/icons/locationDialog.png')}
                    style={PublicStyle.DialogImageSize}
                />

                <MyText
                    componentStyles={[PublicStyle.DialogTextMessage,{textAlign : 'center'}]}
                    text={Message}
                />

                <TouchableOpacity
                    style={[PublicStyle.ButtonStyle
                        , {backgroundColor: LocationBlue}]}

                    activeOpacity={.7}
                    onPress={() => {
                        Actions.pop();

                        if (onConfirm !== null)
                            onConfirm();
                    }}>
                    <MyText
                        componentStyles={{color: 'white'}}
                        text={"باشه"}
                    />
                </TouchableOpacity>

            </BaseLightbox>

        );

    }

}

const PublicStyle = EStyleSheet.create({
    DialogImageSize: {
        width: 45,
        height: 45
    },
    DialogTextMessage: {
        marginTop: 10,
        marginBottom: 10,
        color: PrimaryTextColor,
        fontSize: 13
    }
    , ButtonStyle: {
        width: '80%',
        height: 30,
        backgroundColor: AccentColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        '@media ios ': {
            paddingTop: 5
        }
    }

});