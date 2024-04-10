import * as React from "react";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {View, ImageBackground, TextInput, TouchableOpacity, Image, StyleSheet} from "react-native";
import propTypes from "prop-types";
import {
    AppFont,
    BorderColor,
    Medium,

    PrimaryTextColor,
    SecondaryTextColor
} from "../publics/Ui";
import MyText from "../customs/MyText";
import CircleList from "../customs/List/CircleList";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";
import {BaseURL, ForumHeaderImage} from "../publics/DataBase";


const SearchHeight = 55;


export default class Forum extends React.Component {


    render() {
        return (
            <BaseUi>
                <MyHeader
                    text={'انجمن'}
                    showText={true}
                />
                <ImageBackground style={FormStyle.ImageBackStyle}
                                 source={{uri: BaseURL + ForumHeaderImage + 'Header.png'}}>
                    <View style={{marginBottom: 5}}>
                        <MyText
                            componentStyles={{
                                color: 'white',
                                fontSize: Medium,
                            }}
                            text={'دسته بندی ها '}/>
                    </View>
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => Actions.ForumSearch()}
                        style={FormStyle.SearchViewStyle}>
                        <View style={FormStyle.InputViewStyle}>
                            <TextInput
                                editable={false}
                                autoFocus={false}
                                placeholder={'جستجو در بین تمامی دسته ها'}
                                placeholderTextColor={SecondaryTextColor}
                                style={FormStyle.InputStyle}
                                underlineColorAndroid="transparent"
                                onFocus={() => Actions.ForumSearch()}
                            />

                        </View>

                        <View
                            style={{
                                height: SearchHeight,
                                width: '10%',
                                justifyContent: 'center',

                            }}>

                            <TouchableOpacity
                                onPress={() => Actions.ForumSearch()}
                                style={FormStyle.SearchButtonStyle}>
                                <FastImage
                                    style={{
                                        width: '60%',
                                        height: '60%',
                                    }}
                                    resizeMode={'contain'}
                                    source={require('../../assets/images/icons/Search.png')}
                                />

                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>


                </ImageBackground>

                <View style={FormStyle.Categories}>
                    <MyText
                        componentStyles={{
                            fontSize: Medium,
                            color: SecondaryTextColor
                        }}
                        text={'دسته بندی ها '}/>
                </View>

                <CircleList BrandSelected={this.props.BrandSelected}/>
            </BaseUi>
        )
    }


}

const FormStyle = StyleSheet.create({
    ImageBackStyle: {height: 250, width: '100%', justifyContent: 'center', alignItems: 'center'},
    SearchViewStyle: {
        height: SearchHeight,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: '6%',
        paddingLeft: '6%',
    },
    InputViewStyle: {
        height: '80%',
        width: '90%',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderColor: BorderColor,
        borderWidth: 1,
        borderRightWidth: 0
    },
    InputStyle: {
        width: '100%',
        height: '100%',
        color: PrimaryTextColor,
        fontFamily: AppFont,
        textAlign: 'right',
        paddingRight: 8,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    SearchButtonStyle: {
        width: '100%',
        height: '80%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: BorderColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Categories: {
        justifyContent: 'center', alignItems: 'center',
        marginTop: 5,
        marginBottom: 8,
    }

});

Forum.propTypes = {
    BrandSelected: propTypes.string

};