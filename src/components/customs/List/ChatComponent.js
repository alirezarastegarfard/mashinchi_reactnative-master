import React from "react";
import {Image, ImageBackground, StyleSheet, View, TouchableOpacity} from "react-native";
import {
    ChatBackGround,
    ChatColor,
    height,
    SecondaryTextColor, VerySmall,
    width
} from "../../publics/Ui";
import MyText from "../../customs/MyText";
import propTypes from 'prop-types';
import BaseUi from "../../basepage/BaseUi";
import {BaseURL, ChatFileAddress, ProfileAddress} from "../../publics/DataBase";
import ZoomImage from "react-native-zoom-image";
import Sound from 'react-native-sound';
import {Actions} from "react-native-router-flux";
import {SecondToMin} from "../../publics/Function";
import FastImage from "react-native-fast-image";

const tick = require('../../../assets/images/icons/tick.png');
const doubletick = require('../../../assets/images/icons/doubletick.png');
const video_colored = require("../../../assets/images/icons/video_colored.png");
const BluePause = require("../../../assets/images/icons/BluePause.png");


let sound = null;

class ChatComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Playing: false,
            Pausing: false,
            TimeFile: SecondToMin(this.props.data.FileTime),
        }
    }

    setTimeFile = () => {
        this.setState({TimeFile: SecondToMin(this.props.data.FileTime)});
    };

    render() {


        return (
            <View style={{backgroundColor: ChatBackGround}}>
                <View style={[ClassStyle.Container, {justifyContent: this.props.IsLeft ? 'flex-start' : 'flex-end'}]}>
                    <Image
                        resizeMode={'cover'}
                        style={[ClassStyle.RightProfile, {display: this.props.IsLeft ? 'flex' : 'none'}]}
                        source={{uri: BaseURL + ProfileAddress + this.props.data.PhotoFileName}}
                    />

                    <View style={[ClassStyle.ChatView, {
                        backgroundColor: this.props.IsLeft ? 'white' : ChatColor,
                        marginLeft: this.props.IsLeft ? width * 0.02 : 0,
                        marginRight: this.props.IsRight ? width * 0.02 : 0
                    }]}>
                        <View style={{display: this.props.IsAudio ? 'none' : 'flex', padding: 5, paddingBottom: 0}}>
                            <TouchableOpacity>

                                <ZoomImage
                                    source={{uri: this.props.IsImage ? BaseURL + ChatFileAddress + 'UserFile_' + this.props.data.FromUserID + '/Image/' + this.props.data.FileName : null}}
                                    imgStyle={{width: width * 0.55, height: width * 0.3}}
                                    style={{marginBottom: height * 0.01, display: this.props.IsImage ? 'flex' : 'none'}}
                                    duration={200}
                                    enableScaling={true}
                                />

                                <ImageBackground
                                    resizeMode={'cover'}
                                    style={[ClassStyle.ImageSupport, {display: this.props.IsVideo ? 'flex' : 'none'}]}
                                    source={{uri: this.props.IsVideo ? BaseURL + ChatFileAddress + 'UserFile_' + this.props.data.FromUserID + '/Image/' + this.props.data.FileName : null}}>

                                    <FastImage
                                        resizeMode={'cover'}
                                        style={[ClassStyle.VideoIcons, {display: this.props.IsVideo ? 'flex' : 'none'}]}
                                        source={require("../../../assets/images/icons/video.png")}
                                    />
                                </ImageBackground>
                            </TouchableOpacity>

                            <MyText text={this.props.data.Description}

                            />

                            <View
                                style={[ClassStyle.TimeView, {justifyContent: this.props.IsLeft ? 'flex-end' : 'flex-start',}]}>
                                <View>
                                    <MyText text={this.props.data.PersianTime}
                                            componentStyles={{
                                                color: SecondaryTextColor,

                                            }}
                                    />
                                </View>
                                <View style={ClassStyle.TickView}>
                                    <FastImage
                                        resizeMode={'contain'}
                                        style={   {width:this.props.data.IsRead != 0? 15: 12, height:this.props.data.IsRead != 0? 15:12} }
                                        source={this.props.data.IsRead == 0 ? tick : doubletick}
                                    />
                                </View>

                            </View>
                        </View>

                        <View style={{
                            display: this.props.IsAudio ? 'flex' : 'none'
                        }}>
                            <View style={{
                                flexDirection: 'row',

                                alignItems: 'center'
                            }}>
                                <TouchableOpacity
                                    onPress={() => {

                                        this.props.StopOtherRunningAudio(this.props.data.ID, this.state.Playing, this.state.Pausing);
                                    }}
                                >
                                    <FastImage
                                        resizeMode={'contain'}
                                        style={{width: 40, height: 40, marginRight: 10}}
                                        source={

                                            this.state.Playing === false ? video_colored : BluePause

                                        }
                                    />
                                </TouchableOpacity>

                                <View>
                                    <MyText text={this.props.data.FileName}

                                    />
                                </View>

                            </View>

                            <View
                                style={[ClassStyle.TimeView, {
                                    justifyContent: this.props.IsLeft ? 'flex-end' : 'flex-start'
                                }]}>

                                <View
                                    style={{width: '80%', flexDirection: 'row'}}>

                                    <View>
                                        <MyText text={this.props.data.PersianTime}
                                                componentStyles={{
                                                    color: SecondaryTextColor,

                                                }}
                                        />
                                    </View>
                                    <View style={ClassStyle.TickView}>
                                        <FastImage
                                            resizeMode={'contain'}
                                            style={   {width:this.props.data.IsRead != 0? 15: 12, height:this.props.data.IsRead != 0? 15:12} }
                                            source={this.props.data.IsRead == 0 ? tick : doubletick}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{width: '20%'}}>
                                    <MyText text={this.state.TimeFile}
                                            componentStyles={{
                                                color: SecondaryTextColor,
                                                fontSize: VerySmall
                                            }}
                                    />
                                </View>


                            </View>


                        </View>

                    </View>

                    <Image
                        resizeMode={'cover'}
                        style={[ClassStyle.LeftProfile, {display: this.props.IsRight ? 'flex' : 'none'}]}
                        source={{uri: BaseURL + ProfileAddress + this.props.data.PhotoFileName}}
                    />
                </View>


            </View>
        )
    }


    _pause = () => {
        this.setState({Playing: false, Pausing: true});
        sound.pause();
    };

    _stop = () => {
        this.setState({Playing: false, Pausing: false});
        if (sound != null) {
            sound.stop();
            sound.release();
        }

    };

    _playAgain() {
        this.setState({Playing: true, Pausing: false});

        this.Interval = setInterval(() => {

            if (sound !== undefined) {
                sound.getCurrentTime((seconds) =>
                    this.setState({TimeFile: SecondToMin(seconds + 1)}));
            }
        }, 1000);

        sound.play((success) => {
            if (success) {
                this.setState({Playing: false});
                clearInterval(this.Interval);
            }
        });

    }

    async _play() {


        this.setState({Playing: true});
        //  These timeouts are a hacky workaround for some issues with react-native-sound.
        //  See https://github.com/zmxv/react-native-sound/issues/89.


        setTimeout(() => {
            sound = new Sound(BaseURL + ChatFileAddress + 'UserFile_' + this.props.data.FromUserID + '/Audio/' + this.props.data.FileName, Sound.MAIN_BUNDLE, (error) => {
                if (error) {

                    console.log('failed to load the sound', error);
                }
            });


            setTimeout(() => {
                this.setState({playing: true});

                this.Interval = setInterval(() => {

                    if (sound !== undefined) {
                        sound.getCurrentTime((seconds) =>
                            this.setState({TimeFile: SecondToMin(seconds + 1)}));
                    }
                }, 1000);

                sound.play((success) => {
                    if (success) {
                        this.setState({Playing: false});
                        clearInterval(this.Interval);

                    } else {
                        this.setState({Playing: false});
                        Actions.ExceptionDialog({Message: " خطا در پخش صدا "});
                    }
                });
            }, 500);
        }, 100);


    }


}

ChatComponent.propTypes = {
    IsVideo: propTypes.bool,
    IsImage: propTypes.bool,
    IsLeft: propTypes.bool,
    IsRight: propTypes.bool,
    IsAudio: propTypes.bool,
    data: propTypes.object,
    StopOtherRunningAudio: propTypes.func,
    Playing: propTypes.bool,
    Pausing: propTypes.bool,

};

BaseUi.defaultProps = {
    IsVideo: false,
    IsImage: false,
    IsLeft: false,
    IsRight: false,
    IsAudio: false,
    data: null,
    StopOtherRunningAudio: null,
    Playing: false,
    Pausing: false


};

const ClassStyle = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        padding: 5,
    }, RightProfile: {

        borderRadius:25, width: 50, height: 50
    },
    LeftProfile: {

        borderRadius:25, width: 50, height: 50
    },
    ChatView: {
        borderRadius: 10,
        maxWidth: width / 1.5,
        minWidth: width / 1.8
        , padding: 5
    },
    ImageSupport: {
        justifyContent: 'center',
        alignItems: 'center', width: '100%', height: width * 0.3, marginBottom: height * 0.01
    }
    ,
    VideoIcons: {
        width: 40,
        height: 40,
    }
    , TimeView: {
        flexDirection: 'row',
    },
    TickView: {
        justifyContent: 'center', alignItems: 'center', marginLeft: 4
    },
    tickStyle: {
        width: 14, height: 14
    }


});

export default ChatComponent;

