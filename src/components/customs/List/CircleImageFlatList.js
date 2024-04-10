import React from "react";
import {height} from "../../publics/Ui";
import {FlatList, Image, StyleSheet, View} from "react-native";
import {BaseURL, ImagesAddress} from "../../publics/DataBase";
import TouchableScale from "react-native-touchable-scale";
import MyText from "../MyText";
import FastImage from "react-native-fast-image";


export default class CircleImageFlatList extends React.PureComponent {

    render() {
        return (
            <View
                style={{backgroundColor:'transparent', marginTop: 5, marginBottom:5,marginRight: 4}}>
                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item) => item.BrandId.toString()}
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
                style={Styles.touchableStyle}
                onPress={ () => this.props.onPress(item) }>
                <FastImage
                    resizeMode={'contain'}
                    style={Styles.CircleImage}
                    source={{uri: BaseURL + ImagesAddress + item.BrandImage } }
                />

                <MyText
                    text={item.BrandName}
                />

            </TouchableScale>
        )

    }
}


const Styles = StyleSheet.create({

    touchableStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom : 8,
        height: 80,
        width: 80,

    },

    CircleImage:{
        width:'80%',
        height: '80%',

    }

});
