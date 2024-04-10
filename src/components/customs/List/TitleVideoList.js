import * as React from "react";
import {backColor, height} from "../../publics/Ui";
import {TouchableOpacity, Image, View} from "react-native";
import MyText from "../MyText";
import propTypes from 'prop-types';
import {MediaAddress, MediaURL} from "../../publics/DataBase";
import {Actions} from 'react-native-router-flux';
import FastImage from "react-native-fast-image";

const ItemHeight = height * 0.32;

export default class TitleVideoList extends React.PureComponent {

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{height: ItemHeight, width: '50%', padding: 5}}
                onPress={ () => Actions.MediaPost({ Post : this.props.data })}>
                <View style={{height: '100%', width: '100%'}}>
                    <FastImage
                        style={{
                            height: '100%',
                            width: '100%', backgroundColor: backColor,
                            borderRadius: 15,
                            justifyContent: 'flex-end'
                        }}
                        source={{uri: MediaURL + MediaAddress + this.props.data.ThumbnailName}}
                    />

                    <View
                        style={{
                            backgroundColor: 'rgba(0,0,0,.5)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '20%',
                            width: '100%',
                            position: 'absolute',
                            bottom: 0,
                            borderBottomRightRadius: 15,
                            borderBottomLeftRadius: 15,
                        }}>

                        <MyText
                            text={this.props.data.PostCaption}
                            componentStyles={{color: 'white'}}
                            numberOfLines={1}
                        />

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

}

TitleVideoList.propTypes = {
    data : propTypes.object
};
