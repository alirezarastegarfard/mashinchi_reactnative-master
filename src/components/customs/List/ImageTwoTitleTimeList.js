import React from "react";
import {FlatList, Image, TouchableOpacity, View, StyleSheet, ActivityIndicator} from "react-native";
import {AccentColor, MiniSize, SecondaryTextColor, width} from "../../publics/Ui";
import MyCard from "../MyCard";
import MyText from "../MyText";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {BaseURL, ProfileAddress} from "../../publics/DataBase";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";

class ImageTwoTitleTimeList extends React.PureComponent {


    render() {
        return (
            <View
                style={{backgroundColor: 'transparent'}}>
                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.Data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item) => item.ID.toString()}
                    ListEmptyComponent={() => this.renderEmptyList()}
                />
            </View>
        )
    }

    renderItem(item) {
        const img = item.UserID_Fk_1 == this.props.User.ID ? item.PhotoFileNameas2 : item.PhotoFileNameas1;

        return (
            <TouchableOpacity onPress={() => {
                Actions.Chat({
                    ToUserID: item.UserID_Fk_1 == this.props.User.ID ? item.UserID_Fk_2 : item.UserID_Fk_1,
                    Name: item.UserID_Fk_1 == this.props.User.ID ? item.FullName2 : item.FullName1
                });
                this.props.UpdateBadge(item.ID);
            }}>
                <MyCard MyCardStyle={PageStyle.MainView}>

                    <View style={PageStyle.TimeView}>
                        <View style={{height:'50%', width:'100%',justifyContent:'flex-start',alignItems:'flex-start'}}>

                            <MyText text={item.LastTime}
                                    componentStyles={{color: SecondaryTextColor, fontSize: MiniSize
                                    }}
                            />
                        </View>

                        <View style={{
                            width: 20,
                            height: 20,
                            borderRadius: (20) / 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display:item.CountNewChatMessage>0?'flex':'none',
                            backgroundColor: AccentColor,
                            marginLeft:3
                        }}>

                            <MyText
                                componentStyles={{
                                    textShadowOffset: {width: 0, height: 0},
                                    color: 'white',


                                }}
                                text={parseInt(item.CountNewChatMessage) >= 10 ? "+9" : item.CountNewChatMessage}
                            />
                        </View>

                    </View>

                    <View style={PageStyle.TitleView}>
                        <View style={{height: '50%'}}>
                            <MyText

                                text={item.UserID_Fk_1 == this.props.User.ID ? item.FullName2 : item.FullName1}/>
                        </View>

                        <View style={{height: '50%'}}>
                            <MyText text={item.Description}
                                    numberOfLines={1}
                                    componentStyles={{color: SecondaryTextColor}}
                            />
                        </View>

                    </View>

                    <View style={PageStyle.ImageView}>
                        <FastImage
                            source={{uri: BaseURL + ProfileAddress + img}}
                            style={PageStyle.Image}/>

                    </View>


                </MyCard>
            </TouchableOpacity>
        )

    }
    renderEmptyList() {
        if (this.props.EmptyList)
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>

                    <MyText
                        componentStyles={{color: AccentColor, fontSize: 16}}
                        text={"گفت و گویی برای شما وجود ندارد "}/>

                </View>
            );

        if (this.props.Loading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        return null;
    }

}

ImageTwoTitleTimeList.propTypes = {
    Data: PropTypes.array,
};

const mapStateToProps = (states) => {
    return {User: states.User}
};

export default connect(mapStateToProps)(ImageTwoTitleTimeList);


const PageStyle = StyleSheet.create({
    MainView: {
        height: 65, flexDirection: 'row', justifyContent: 'flex-end',paddingLeft:2
    },
    ImageView: {
        width: 65,
        justifyContent: 'center', alignItems: 'flex-end',

    },
    Image: {width: 50, height:50, borderRadius: 50 / 2},
    TitleView: {width:width-160},
    TimeView: {marginLeft:4,width: 70, alignItems: 'flex-start'},
});