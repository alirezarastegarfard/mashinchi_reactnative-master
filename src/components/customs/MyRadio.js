import React from "react";
import {width} from "../publics/Ui";
import {Image, TouchableOpacity} from "react-native";
import propTypes from 'prop-types';
import MyText from "./MyText";
import FastImage from "react-native-fast-image";
const RadioTick = require('../../assets/images/icons/radio-on-button.png');
const RadioEmpty = require('../../assets/images/icons/radio-off-button.png');



export default class MyRadio extends React.Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <TouchableOpacity
                style={this.props.componentStyles}
                onPress={() => this.ChangeChecking()}>
                <FastImage style={{width: 0.06 * width, height: 0.06 * width}}
                       source={this.props.Checked ? RadioTick : RadioEmpty}
                />
            </TouchableOpacity>
        )
    }

    ChangeChecking() {
        this.props.GetCondition(!this.props.Checked);
    }

}

MyRadio.propTypes = {
    Checked: propTypes.bool.isRequired,
    GetCondition: propTypes.func,
    componentStyles : TouchableOpacity.propTypes.style
};
MyRadio.defaultProps = {
    Checked: false,
    componentStyles : null
};