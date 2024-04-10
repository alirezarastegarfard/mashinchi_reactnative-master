import React from "react";
import {
    AccentColor,
    backColor,
    GreyColor,
    Large, Medium,
    PrimaryColor
} from "../publics/Ui";
import {Image, TouchableOpacity, View} from "react-native";
import MyText from "./MyText";
import {Actions} from 'react-native-router-flux';
import propTypes from "prop-types"
import WhiteLogo from '../../assets/images/imgs/ic_mashinchi_white.png';
import BlackLogo from '../../assets/images/imgs/ic_mashinchi.png';
import {HeaderHeight, ScreenWidth} from "../publics/Function";
import FastImage from "react-native-fast-image";

export default class MyHeader extends React.Component {


    render() {

        const {
            buttonRightShowing,
            buttonLeftShowing ,
            buttonRightImage ,
            buttonLeftImage  ,
            buttonRightOnPress,
            buttonLeftOnPress,
            buttonLeftStyle,
            ViewStyle
        } = this.props;

        return (

            <View
                style={[
                    {
                        height:HeaderHeight,
                        width : ScreenWidth,
                        backgroundColor: backColor,
                        flexDirection: 'row',
                        borderBottomWidth:.1,
                        borderColor:GreyColor,
                        elevation: 3
                    }, ViewStyle]}>

                <View
                    style={{
                        flex: 0.15,
                        flexDirection: 'row'
                    }}>

                    <TouchableOpacity
                        onPress={buttonLeftOnPress}
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: buttonLeftShowing === true ? 'flex' : 'none'
                        }}>

                        <FastImage
                            source={buttonLeftImage}
                            style={[{width: 25, height: 25},buttonLeftStyle]}
                            resizeMode={"contain"}
                        />

                    </TouchableOpacity>


                </View>

                <View
                    style={{
                        flex: 0.7,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                    {this.renderMainImage()}

                </View>

                <View style={{
                    flex: 0.15,
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity
                        onPress={buttonRightOnPress}
                        style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display:buttonRightShowing === true ? 'flex' : 'none'
                        }}>

                        <FastImage
                            source={buttonRightImage}
                            style={{width: 25, height: 25}}
                            resizeMode={"contain"}
                        />

                        {this.Badge()}

                    </TouchableOpacity>

                </View>

            </View>

        )
    }

    Badge() {
        let {DisplayBadge , BadgeText } = this.props;
        if (DisplayBadge) {
            return (
                <View style={{
                    width:20,
                    height:20,
                    position: 'absolute',
                    zIndex: 1,
                    left: '6%',
                    top: '25%',
                    borderRadius:(20) / 2,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:AccentColor,
                }}>

                    <MyText
                        componentStyles={{
                            textShadowOffset: {width: 0, height: 0},
                            color: 'white',

                        }}
                        text={parseInt(BadgeText) >= 10 ? "+9" : BadgeText}
                    />

                </View>
            )
        }
        else {
            return null;
        }
    }

    renderMainImage() {
        const {showText , text , textStyle} = this.props;

        if (!showText) {
            return (
                <FastImage
                    source={this.props.whiteLogo ? WhiteLogo : BlackLogo}
                    style={{width: '50%', height: '70%'}}
                    resizeMode={"contain"}
                />

            )
        }
        if (showText) {
            return (
                <MyText
                    text={text}
                    componentStyles={[{
                        fontSize: Medium,
                        color: PrimaryColor
                    }, textStyle
                    ]}
                />);
        }

    }
}

MyHeader.propTypes={
    showText:propTypes.bool,
    buttonRightShowing:propTypes.bool,
    buttonLeftStyle : propTypes.any,
    buttonLeftShowing :propTypes.bool,
    DisplayBadge :propTypes.bool,
    buttonRightImage : propTypes.any,
    buttonLeftImage :propTypes.any,
    textStyle : propTypes.any,
    buttonRightOnPress :propTypes.func,
    buttonLeftOnPress :propTypes.func,
    ViewStyle : propTypes.any,
    BadgeText : propTypes.string,
    text:propTypes.string,
    whiteLogo : propTypes.bool
};


MyHeader.defaultProps={
    showText:false,
    buttonRightShowing:true,
    buttonLeftShowing :false,
    buttonLeftStyle : null,
    DisplayBadge :false,
    buttonRightImage : require('../../assets/images/icons/RightArrow.png'),
    buttonLeftImage :require('../../assets/images/icons/Search.png'),
    textStyle:null,
    buttonRightOnPress :() => Actions.pop(),
    buttonLeftOnPress :null,
    ViewStyle :null,
    BadgeText:'',
    text:'Header',
    whiteLogo : false
};