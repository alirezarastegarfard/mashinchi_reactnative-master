import React from "react";
import {AppFont, BorderColor, height, SecondaryTextColor, Small, VerySmall} from "../publics/Ui";
import MyText from "./MyText";
import {TextInput, View} from "react-native";
import propTypes from 'prop-types';


export default class Input extends React.Component {

    render() {

        return (
            <View style={{marginTop: height * 0.03, marginRight: 15, marginLeft: 15}}>
                <View style={{height: 29, paddingRight: 5}}>
                    <MyText text={this.props.HeaderText}
                            componentStyles={{fontSize: Small}}
                    />
                </View>
                <View style={{
                    height: 52,
                    borderWidth: 1,
                    borderColor: BorderColor,
                    backgroundColor: 'white',
                    borderRadius: 10.
                }}>
                    <TextInput
                        {...this.props}
                        placeholderTextColor={SecondaryTextColor}
                        underlineColorAndroid="transparent"
                        style={{
                            fontSize: VerySmall,
                            width: '100%',
                            height: '100%', textAlign: 'right', fontFamily: AppFont
                        }}
                    />
                </View>
            </View>
        )
    }


}

MyText.propTypes = {
    HeaderText: propTypes.string,
};
