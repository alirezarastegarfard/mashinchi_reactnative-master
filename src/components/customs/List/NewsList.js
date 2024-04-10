import React from "react";
import {

    PrimaryTextColor,
    SecondaryTextColor,
    Small,
    VerySmall, width
} from "../../publics/Ui";
import {Image, View , TouchableOpacity} from "react-native";
import MyText from "../MyText";
import propTypes from 'prop-types';
import MyCard from "../MyCard";
import {BaseURL, ImagesAddress} from "../../publics/DataBase";
import {Actions} from 'react-native-router-flux';
import FastImage from "react-native-fast-image";
const ItemHeight = 210;

export default class NewsList extends React.PureComponent{

    constructor(props){
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={{height: ItemHeight,marginBottom:1}}
                activeOpacity={1}
                onPress={ () => Actions.News({ NewsData : this.props.NewsData }) }>
                <MyCard
                    MyCardStyle={{
                    padding: 1,
                    paddingRight:5,
                }}>
                    <View style={{ height: '15%'}}>
                        <MyText
                            numberOfLines={1}
                            text={this.props.NewsData.NewsTitle}
                                componentStyles={{
                                    color: PrimaryTextColor,
                                    fontSize: Small
                                }}/>

                    </View>


                    <View style={{flexDirection: 'row', height: '70%',justifyContent:'flex-end'}}>
                        <View style={{height: '100%',maxWidth:width-190, padding: 5}}>
                            <MyText
                                text={this.props.NewsData.NewsDescription}
                                numberOfLines={5}
                                componentStyles={{
                                    color: SecondaryTextColor,
                                    fontSize: VerySmall
                                }}/>
                        </View>

                        <View style={{
                            height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width:160
                        }}>
                            <FastImage
                                style={{ height: '90%', width: '90%'}}
                                source={{uri: BaseURL + ImagesAddress + this.props.NewsData.ThumbnailName}}
                            />
                        </View>

                    </View>

                    <View style={{

                        height: '15%',
                        borderTopWidth: 0.5,
                        borderColor: PrimaryTextColor,
                        flexDirection: 'row',
                        justifyContent:'center',alignItems:'center',
                       padding:5
                    }}>
                        <View style={{width: '50%' ,flexDirection:'row'}}>
                            <MyText text={this.props.NewsData.NewsDateTime}
                                    componentStyles={{color: 'black', fontSize:VerySmall}}/>
                        </View>

                        <View style={{width: '50%', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <MyText text={' نفر'}
                                    componentStyles={{color: 'black', fontSize: VerySmall}}/>
                            <MyText text={this.props.NewsData.ViewCount}
                                    componentStyles={{color: 'black', fontSize: VerySmall}}/>
                            <MyText text={'تعداد بازدید '}
                                    componentStyles={{color: 'black', fontSize: VerySmall}}/>
                        </View>

                    </View>
                </MyCard>
            </TouchableOpacity>
        )
    }

}

NewsList.propTypes = {
    NewsData  : propTypes.object
};
