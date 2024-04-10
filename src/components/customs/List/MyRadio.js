import React from "react";
import {width} from "../publics/Ui";
import {Image, TouchableOpacity} from "react-native";
import propTypes from 'prop-types';
import MyText from "./MyText";
import FastImage from "react-native-fast-image";

const RadioTick = require('../../assets/images/icons/');
const RadioEmpty = require('../../assets/images/icons/check-box-empty.png');

export default class MyCheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Checked: this.props.Checked
        };
        this.props.GetCondition(this.props.Checked);
    }


    render() {
        return (
            <TouchableOpacity
                style={this.props.componentStyles}
                onPress={() => this.ChangeChecking()}>
                <FastImage style={{width: 0.05 * width, height: 0.05 * width}}
                       source={this.state.Checked ? RadioTick : RadioEmpty}
                />
            </TouchableOpacity>
        )
    }

    ChangeChecking() {
        this.setState({Checked: !this.state.Checked}, () => this.props.GetCondition(this.state.Checked));
    }

}

MyText.propTypes = {
    Checked: propTypes.bool,
    GetCondition: propTypes.func,
    componentStyles : propTypes.any
};
MyText.defaultProps = {
    Checked: false,
};