import React from "react";
import {width} from "../publics/Ui";
import {Image, TouchableOpacity} from "react-native";
import propTypes from 'prop-types';
import MyText from "./MyText";
import FastImage from "react-native-fast-image";

const checkboxTick = require('../../assets/images/icons/check-box.png');
const checkboxEmpty = require('../../assets/images/icons/check-box-empty.png');

export default class MyCheckBox extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {

        return (
            <TouchableOpacity
                style={this.props.componentStyles}
                onPress={() => this.ChangeChecking()}>
                <FastImage style={{width: 20, height: 20 }}
                       source={this.props.Checked ? checkboxTick : checkboxEmpty}
                />
            </TouchableOpacity>
        )
    }

    ChangeChecking() {
        this.props.GetCondition(this.props.Checked);
    }

}

MyCheckBox.propTypes = {
    Checked: propTypes.bool,
    GetCondition: propTypes.func,
    componentStyles : propTypes.any
};
MyCheckBox.defaultProps = {
    Checked: false,
    componentStyles : null
};