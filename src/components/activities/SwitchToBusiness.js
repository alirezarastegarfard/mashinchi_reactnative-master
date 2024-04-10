import React, {Component} from 'react';
import BaseUi from "../basepage/BaseUi";
import {FlatList, Image, TouchableOpacity, View, StyleSheet} from "react-native";
import MyHeader from "../customs/MyHeader";
import {BorderColor, Medium, Small, width} from "../publics/Ui";
import MyText from "../customs/MyText";
import {BaseURL, FetchDataFromAPI, ImagesAddress} from "../publics/DataBase";
import {getRenderListEmpty} from "../publics/Function";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";

export default class SwitchToBusiness extends Component {

    constructor(props){
        super(props);

        this.state = {
            data : [],
        }

    }

    componentDidMount(): void {

        FetchDataFromAPI('getBusinessTypes',null,(response) =>{

            this.setState({data : response.Response});

        }).done();

    }

    render() {
        return (
            <BaseUi>
                <MyHeader
                    showText={true}
                    text={'تبدیل پروفایل عادی به مشاغل'}
                />

                <FlatList
                    style={{margin: MarginPage}}
                    data={this.state.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item) => item.BussinessTypeId.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(true)}
                    showsVerticalScrollIndicator={false}
                />

            </BaseUi>
        )
    }

    renderItem = (item) => {

        return(

            <TouchableOpacity
                style={SwitchToBusiness_Style.TouchableStyle}
                activeOpacity={.8}
                onPress={() => Actions.jump(item.ActionName,{ ImageFileName : item.ImageFileName , TypeId : item.BussinessTypeId })}>

                {/*right image */}
                <FastImage
                    style={SwitchToBusiness_Style.ImageStyle}
                    source={{uri: BaseURL + ImagesAddress + item.ImageFileName }}/>


                {/*left Items*/}
                <View style={SwitchToBusiness_Style.MainTextViewStyle}>

                    {/*Header text */}
                    <View style={SwitchToBusiness_Style.HeaderTextViewStyle}>
                        <MyText text={item.Title} componentStyles={{fontSize: Medium}}/>
                    </View>


                    {/*Detail text*/}
                    <View style={SwitchToBusiness_Style.DetailTextViewStyle}>
                        <MyText
                            numberOfLines={5}
                            text={item.Description}
                            componentStyles={SwitchToBusiness_Style.TextStyle}/>
                    </View>


                </View>


            </TouchableOpacity>
        );

    }

}
const ItemsHeight = 200;
const MarginPage = 8;
const ImageWidth = 120;

const SwitchToBusiness_Style = StyleSheet.create({
    TouchableStyle: {
        height: ItemsHeight,
        borderBottomWidth: 1,
        borderColor: BorderColor,
        flexDirection: 'row-reverse',
        alignItems: 'center',

    },
    ImageStyle: {width: ImageWidth, height: 140},
    MainTextViewStyle: {
        height: '100%',
        width: width - (MarginPage * 2) - ImageWidth,
        paddingRight: 8
    },
    HeaderTextViewStyle: {flex: .3, justifyContent: 'flex-end'},
    DetailTextViewStyle: {flex: .67, marginTop: 5},
    TextStyle: {fontSize: Small, lineHeight: 25}

});