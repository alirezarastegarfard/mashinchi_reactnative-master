import React from 'react';
import { Image } from 'react-native';
import { BaseURL, ImagesAddress} from "../publics/DataBase";
import {height, width} from "../publics/Ui";
import TouchableScale from "react-native-touchable-scale";
import propTypes from 'prop-types';
import FastImage from "react-native-fast-image";

export default class SliderEntry extends React.PureComponent {

    render () {

        return (
            <TouchableScale
                activeScale={0.98}
                activeOpacity={1}
                style={{
                    width: width*0.8,
                    height: height*0.3,
                    paddingHorizontal: 5,
                    paddingBottom: 18 }}
                onPress={ () => {

                    if (this.props.onPress !== null)
                        this.props.onPress(this.props.data)
                }}>

                <FastImage
                    source={{ uri: BaseURL + ImagesAddress + this.props.data.Image }}
                    style={ {
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}
                />

            </TouchableScale>
        );
    }

}

SliderEntry.propTypes = {

    data : propTypes.object,
    onPress : propTypes.func

};

SliderEntry.defaultProps = {
    onPress : null
};
