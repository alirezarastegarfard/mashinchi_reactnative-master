import React, {Component} from 'react';
import {Text} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {  PrimaryTextColor, VerySmall} from "../publics/Ui";
import propTypes from 'prop-types';

export default class MyText extends Component {
    render() {

        return (
            <Text
                style={[Styles.TextStyle, this.props.componentStyles]}
                {...this.props}>
                {this.props.text}
            </Text>
        )
    }
}

MyText.propTypes = {
    text : propTypes.string.isRequired,
    componentStyles : propTypes.any
};

MyText.defaultProps = {
    componentStyles : null
};

const Styles = EStyleSheet.create({

    TextStyle : {
        fontSize: VerySmall,
        color: PrimaryTextColor,
        fontFamily: '$Appfont',
        textAlign : 'right'
    }

});

