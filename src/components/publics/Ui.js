import React from "react";
import {Dimensions, Platform, StatusBar, Text, TouchableOpacity} from "react-native";

export const {height, width} = Dimensions.get("window");
export const {screenHeight, screenWidth} = Dimensions.get("screen");
export const AppFont = 'IRANSansMobile(FaNum)';
export const PrimaryColor = '#2C3E50';
export const SecondaryTextColor = '#959595';
export const GreyColor = '#a0a0a0';
export const DarkPrimaryColor = '#ebebeb';
export const BackColorDark = '#EAEAEA';
export const BorderColor = '#DCDCDC';
export const backColorLight = '#F5F5F5';
export const AccentColor = '#3897F1';
export const backColor = '#FAFAFA';
export const ButtonColor = '#FAFAFA';
export const OptionPostColor = 'rgba(76,76,76,.9)';
export const PrimaryTextColor = '#282828';
export const RedCircle = '#ea315c';
export const colorGreenDarkBtn = '#388E3C';
export const badgeColor='#35c266';
export const SkyBlue = '#ddecfa';
export const PlaceHolderColor = '#efefef';
export const CancelColor = '#707070';
export const LightBlue = '#67B5FF';
export const NavyBlue = '#023565';
export const ChatBackGround = '#ebf7ff';
export const ChatColor= '#d5ffc5';
export const SliderColor = '#f58a1f';
export const disableSliderColor = '#563b1e';
export const LocationBlue = '#1e3f77';


export const MiniSize=11;
export const VerySmall=13;
export const Small=14;
export const Medium=16;
export const Large=20;



export function MyResponsiveFont(percent, MaxFont = 35) {

    const deviceHeight = Platform.OS === "ios"
        ? height * 0.9
        : Platform.OS === "android" ? height - StatusBar.currentHeight : height;

    const heightPercent = percent * deviceHeight / 100;

    if (MaxFont < heightPercent)
        return MaxFont;

    return Math.round(heightPercent);
}


export function getTagRender(ItemName  , selected = false , onPress = null) {

    return(
        <TouchableOpacity
            style={{
                borderRadius: 5,
                height: 38,
                marginLeft: 5,
                marginBottom: 3.5,
                padding: 7,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selected ? AccentColor : BorderColor
            }}
            key={Math.random().toString()}
            onPress={ () => {

                if (onPress !== null)
                    onPress(!selected);

            }}>
            <Text style={{
                color: selected?'white': PrimaryTextColor,
                fontFamily: AppFont,
                textAlign : 'right'}}>
                {ItemName}

            </Text>

        </TouchableOpacity>
    );

}

