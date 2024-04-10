import React from "react";
import {height, width} from "../../publics/Ui";
import {FlatList, Image, StyleSheet, View, ImageBackground} from "react-native";
import TouchableScale from "react-native-touchable-scale";
import ListHeader from "../ListHeader";
import propTypes from 'prop-types';
import MyText from "../MyText";
import FastImage from "react-native-fast-image";

export default class HorizontalVideoFlatList extends React.PureComponent {

    render() {
        return (
            <View
                style={{
                    height:255,
                    paddingRight:7,
                    marginTop: 25,
                }}>

                <ListHeader
                    height={'17%'}
                    onPress={ () => this.props.OnAllPress()}/>

                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item,index) => index.toString()}
                    inverted={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }


    renderItem(item) {

        return (
            <TouchableScale
                activeScale={0.98}
                style={Styles.touchableStyle}
                onPress={ () => {

                    if (this.props.onPress !== null)
                        this.props.onPress(item)
                }}>
                <View style={{width: '100%',
                    height: '70%'}}>
                <ImageBackground
                    resizeMode={'cover'}
                    style={Styles.imageStyle}
                    source={{uri: item.ThumbnailName}}>
                    <FastImage
                        resizeMode={'cover'}
                        style={{
                            width: 40,
                            height: 40,
                        }}
                        source={require("../../../assets/images/icons/video.png")}
                    />

                </ImageBackground>
                </View>


                <View style={{
                    width: '100%',
                    height: '30%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight:5

                }}>

                    <MyText
                        text={item.PostTitle}
                        numberOfLines={2}
                    />

                </View>

            </TouchableScale>
        )

    }


}

const Styles = StyleSheet.create({
    touchableStyle: {

        margin: 6,
        height: '90%',
        width: 250,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2
        , backgroundColor: 'white'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    }

});

HorizontalVideoFlatList.propTypes = {
    data : propTypes.array,
    onPress : propTypes.func
};

HorizontalVideoFlatList.defaultProps = {
    onPress : null
};