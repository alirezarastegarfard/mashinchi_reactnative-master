import React from "react";
import {height, width} from "../../publics/Ui";
import {FlatList, Image, StyleSheet, View} from "react-native";
import {BaseURL, ImagesAddress} from "../../publics/DataBase";
import TouchableScale from "react-native-touchable-scale";
import propTypes from 'prop-types';
import FastImage from "react-native-fast-image";

export default class ShadowTwoImageList extends React.PureComponent {


    render() {

        return (
            <View
                style={{
                    height: height * this.props.heightViewRatio,
                    width: width,
                    padding: 2,
                    paddingRight:4
                }}>
                <FlatList
                    {...this.props}
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.data}
                    renderItem={({item}) => this.renderItem(item, this.props.itemWidthViewRatio)}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderItem(item, itemWidthViewRatio) {

        return (
            <View
                style={{
                    height: '100%',
                    width: 165,
                    padding: 2
                }}>
                <TouchableScale
                    style={Styles.touchableStyle}
                    activeScale={0.98}
                    onPress={ () => {

                        if (this.props.onPress !== null)
                            this.props.onPress(item[0]);

                    }}>
                    <FastImage
                        resizeMode={'cover'}
                        style={Styles.imageStyle}
                        source={{uri: BaseURL + ImagesAddress + item[0].Image}}
                    />
                </TouchableScale>

                {this.renderSecondTouchable(item)}

            </View>
        )

    }

    renderSecondTouchable(item){

        if (item.length <= 1)
            return null;

        return(

            <TouchableScale
                style={Styles.touchableStyle}
                activeScale={0.98}
                onPress={ () => {

                    if (this.props.onPress !== null)
                        this.props.onPress(item[1]);

                }}>
                <FastImage
                    resizeMode={'cover'}
                    style={Styles.imageStyle}
                    source={{uri: BaseURL + ImagesAddress + item[1].Image}}
                />
            </TouchableScale>

        );

    }

}

const Styles = StyleSheet.create({
    touchableStyle: {
        width: '100%',
        height: '50%',
        padding: 3
    },
    imageStyle: {
        width: '100%',
        borderRadius: 10,
        height: '100%',
    }

});

ShadowTwoImageList.propTypes = {
    data               : propTypes.array,
    onPress            : propTypes.func,
    heightViewRatio    : propTypes.number,
    itemWidthViewRatio : propTypes.number
};

ShadowTwoImageList.defaultProps = {
    onPress            : null,
    heightViewRatio    : .32,
    itemWidthViewRatio : 0.45
};