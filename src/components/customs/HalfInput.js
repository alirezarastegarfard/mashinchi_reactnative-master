import React from "react";
import {AccentColor, AppFont, BorderColor, height, SecondaryTextColor} from "../publics/Ui";
import MyText from "./MyText";
import {Image, TextInput, View} from "react-native";
import propTypes from 'prop-types';
import FastImage from "react-native-fast-image";



export default class HalfInput extends React.Component {

    render() {

        return (

            <View style={[{ width: '50%',padding:3 }, this.props.ViewStyle]}>
                <View style={{height: height * 0.05, justifyContent: 'center'}}>
                    <MyText text={this.props.HeaderText}

                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderColor: BorderColor,

                }}>
                    <View style={{width: '10%', justifyContent: 'center', alignItems: 'flex-start'}}>
                        <FastImage
                            resizeMode={'contain'}
                            style={[{width: '100%', height: 30}, this.props.ImageStyle]}
                            source={
                                this.props.ImageSource
                            }


                        />
                    </View>


                    <View style={{width: '90%',flexWrap: 'wrap',
                        flexDirection: 'row-reverse',
                        alignItems:'center',

                    }}>
                        <TextInput
                            {...this.props}
                            placeholderTextColor={SecondaryTextColor}

                            style={{

                                width: '100%',
                                height: '110%',
                                fontFamily: AppFont,
                                color: AccentColor,
                                backgroundColor: 'transparent',

                                textAlign: 'right',


                            }}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                </View>

            </View>


        )
    }


}

MyText.propTypes = {
    HeaderText: propTypes.string,
    ImageSource: propTypes.object,
    ViewStyle: propTypes.object,
    ImageStyle: propTypes.object,

};
