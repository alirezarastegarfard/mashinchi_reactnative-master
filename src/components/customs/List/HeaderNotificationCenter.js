import React from 'react';
import {View} from 'react-native';

import MyText from "../MyText";
import propTypes from 'prop-types';
import { Medium, PrimaryTextColor, } from "../../publics/Ui";

export default class HeaderNotificationCenter extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(

            <View
                style={{
                    height : 60,
                    justifyContent : 'center',
                    alignItems : 'flex-end'
                }}>

                <MyText
                    componentStyles={{
                        fontSize : Medium,
                        color : PrimaryTextColor,
                        marginRight : 10
                    }}
                    text={this.props.Title}
                />


            </View>

        );
    }
}

HeaderNotificationCenter.propTypes = {
    Title : propTypes.string.isRequired
};