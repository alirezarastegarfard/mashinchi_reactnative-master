import * as React from "react";
import { SecondaryTextColor, Small, VerySmall, width} from "../../publics/Ui";
import {Image, ImageBackground, View, TouchableOpacity} from "react-native";
import MyText from "../../customs/MyText";
import MyCard from "../../customs/MyCard";
import propTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import FastImage from "react-native-fast-image";

const ItemHeight = 150;

export default class DescVideoList extends React.PureComponent {

    render() {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{height: ItemHeight}}
                onPress={() => Actions.MediaPost({ PostId: this.props.MediaId , isGetPost : true})}>
                <MyCard MyCardStyle={{padding: 7, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <View style={{width: width - 180}}>
                        <View style={{width: '100%', height: '75%', padding: 5}}>
                            <MyText text={this.props.MediaTitle}
                                    numberOfLines={3}
                                    componentStyles={{fontSize: Small}}/>

                        </View>

                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            height: '25%',
                            padding: 5
                        }}>

                            <View style={{width:'50%',alignItems:'flex-start'}}>
                                <MyText text={this.props.MediaDateTime}
                                        componentStyles={{
                                            fontSize: VerySmall,
                                            color: SecondaryTextColor
                                        }}/>

                            </View>
                            <View style={{width:'50%',  flexDirection: 'row',justifyContent:'flex-end'}}>
                                <MyText text={' نفر '}
                                        componentStyles={{fontSize: VerySmall, color: SecondaryTextColor}}/>
                                <MyText text={this.props.ViewCount}
                                        componentStyles={{fontSize: VerySmall, color: SecondaryTextColor}}/>
                                <MyText text={'تعداد بازدید: '}
                                        componentStyles={{fontSize: VerySmall, color: SecondaryTextColor}}/>
                            </View>
                        </View>


                    </View>

                    <View
                        style={{
                            height: '100%', width: 150, justifyContent: 'center', alignItems: 'center'
                            , padding: 2
                        }}>

                        <TouchableOpacity
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            activeOpacity={1}
                            onPress={() => Actions.Player({
                                MediaId: this.props.MediaId,
                                VideoName: this.props.VideoName,
                                MediaTitle: this.props.MediaTitle,
                                Duration: this.props.Duration
                            })}>

                            <ImageBackground
                                resizeMode={'cover'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                source={{uri: this.props.ThumbnailName}}>

                                <FastImage
                                    resizeMode={'cover'}
                                    style={{
                                        width: 40,
                                        height: 40,
                                    }}
                                    source={require("../../../assets/images/icons/video.png")}
                                />

                            </ImageBackground>

                        </TouchableOpacity>

                    </View>

                </MyCard>

            </TouchableOpacity>

        );
    }
}

DescVideoList.propTypes = {
    MediaId: propTypes.string,
    MediaTitle: propTypes.string,
    ViewCount: propTypes.string,
    MediaDateTime: propTypes.string,
    ThumbnailName: propTypes.string,
    VideoName: propTypes.string,
    UserName: propTypes.string,
    Duration: propTypes.string
};
