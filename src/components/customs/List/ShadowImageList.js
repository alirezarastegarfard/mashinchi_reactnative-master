import React from "react";
import {height, width} from "../../publics/Ui";
import {FlatList, Image, View} from "react-native";
import { BaseURL, ImagesAddress} from "../../publics/DataBase";
import TouchableScale from "react-native-touchable-scale";
import propTypes from 'prop-types';
import FastImage from "react-native-fast-image";

export default class ShadowImageList extends React.PureComponent {


    render() {

        return (
            <View
                style={{
                    backgroundColor: 'transparent',
                    height: 100+this.props.heightViewRatio,
                    width: width,paddingRight:7
                }}>
                <FlatList
                    {...this.props}
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.data}
                    renderItem={({item}) => this.renderItem(item,this.props.itemWidthViewRatio)}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderItem(item,itemWidthViewRatio) {
        return (
            <TouchableScale
                activeScale={0.98}
                style={{height: '100%', width: 150+this.props.itemWidthViewRatio, padding:4}}
                onPress={ () => {
                    if (this.props.onPress !== null)
                        this.props.onPress(item);
                }}>

                <FastImage
                    resizeMode={'cover'}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    source={{uri: BaseURL + ImagesAddress + item.Image}}
                />


            </TouchableScale>
        )

    }

}

ShadowImageList.propTypes = {
    data               :  propTypes.array,
    heightViewRatio    :  propTypes.number,
    itemWidthViewRatio :  propTypes.number,
    onPress            :  propTypes.func
};

ShadowImageList.defaultProps = {
    onPress            : null,
    heightViewRatio    : 0,
    itemWidthViewRatio : 0

};
