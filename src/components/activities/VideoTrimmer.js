/*
import React, {Component} from 'react';
import {Image, ScrollView, TextInput, View , Keyboard} from 'react-native';
import {ConvertFileToBase64, ScreenHeight, ScreenWidth, SecondToMin} from "../publics/Function";
import Video from "../../../custom_package/react-native-video"
import propTypes from 'prop-types';
import BaseUi from "../basepage/BaseUi";
import {
    backColor,
    CancelColor,
    disableSliderColor,
    SliderColor
} from "../publics/Ui";
import {Actions} from "react-native-router-flux";
import MyHeader from "../customs/MyHeader";
import TouchableScale from "react-native-touchable-scale";
import {VIDEO_EDITOR_PAGE, VIDEO_THUMBNAIL_PAGE} from "../publics/Constant";
import Slider from "react-native-slider";
import MyButton from "../customs/MyButton";
import {PageStyle} from '../activities/SendPost';
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import { Trimmer  , VideoPlayer } from 'react-native-video-processing';

class VideoTrimmer extends Component {

    constructor(props){
        super(props);

        this.state = {
            startTime    : 0,
            endTime      : 60,
            VideoTime    : '00:00',
            CurrentTime  : 0,
            currTime     : 0,
            SourceVideo  : this.props.Source,
            VideoPath    : '',
            pause        : true,
            ViewPage     : VIDEO_EDITOR_PAGE,
            Thumbnail    : null,
            ThumbnailBase : '',
            value        : 0,
            Caption      : '',
            Loading      : false,
            LoadingFile  : true,
            Title        : 'ویرایش ویدیو',
            showKeyboard : false
        };

        this.videoPlayerRef = null;

    }

    componentDidMount() {

        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow.bind(this),
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide.bind(this),
        );


        setTimeout( () => {

            this.setState({ VideoPath    : this.props.Source.path, LoadingFile : false });

        },1000);

    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow() {
        this.setState({ showKeyboard : true });
    }

    _keyboardDidHide() {
        this.setState({ showKeyboard : false });
    }

    getPreviewImageForSecond(second) {

        this.setState({Loading: true});

        const maximumSize = {width: 640, height: 640}; // default is { width: 1080, height: 1080 } iOS only
        this.Player.getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
            .then((base64String) => {

                this.setState({
                    Thumbnail: {
                        uri: `data:image/jpg;base64,${base64String.image}`,
                        width: 640,
                        height: 640
                    },
                    ThumbnailBase : base64String.image,
                    Loading: false
                })
            }).catch(console.warn);
    }

    finishEditor(){

        this.setState( { Loading : true });

        const options = {
            startTime  : this.state.startTime,
            endTime    : this.state.endTime,
        };

        this.Player.trim(options)
            .then((newSource) => {

                this.setState({ VideoPath : newSource } , () => {


                    this.Player.getVideoInfo()
                        .then((info) => {

                            this.setState({
                                startTime : 0,
                                endTime : info.duration ,
                                ViewPage : VIDEO_THUMBNAIL_PAGE ,
                                Title : 'ارسال ویدیو' ,
                                Loading : false
                            } , () => {
                                this.getPreviewImageForSecond(5);
                            });
                        })
                        .catch(console.warn);


                });

            })
            .catch(console.warn);


    }

    render() {

        if (this.state.LoadingFile) {

            return (

                <BaseUi
                    Loading={true}
                    ViewStyle={{
                        flex: 1,
                        backgroundColor: backColor
                    }}/>

            );


        } else {
            return (
                <BaseUi
                    Loading={this.state.Loading}
                    ViewStyle={{
                        flex: 1,
                        backgroundColor: backColor
                    }}>

                    <MyHeader
                        showText={true}
                        text={this.state.Title}
                    />

                    {this.renderChooseComponent()}


                </BaseUi>
            );
        }
    }

    renderPlayButton() {

        if (!this.state.pause || this.state.Loading)
            return null;

        return(

            <TouchableScale
                style={{
                    position : 'absolute',
                    alignSelf : 'center',
                    display : this.state.pause ? 'flex' : 'none',
                    zIndex  : 1
                }}
                onPress={ () => this.setState({ pause : false }) }>

                <Image
                    style={{ width : 50 , height : 50 }}
                    source={require('../../assets/images/icons/play.png')}
                    resizeMode={'contain'}
                />

            </TouchableScale>

        );


    }

    renderChooseComponent(){

        if (this.state.ViewPage === VIDEO_EDITOR_PAGE)
            return this.renderVideoEditor();
        else if (this.state.ViewPage === VIDEO_THUMBNAIL_PAGE)
            return this.renderThumbnailSelect();

    }

    renderThumbnailSelect(){

        return(

            <View
                style={{ flex : 1 }}>

                <ScrollView>

                    <View
                        style={{
                            alignItems      : 'center',
                            justifyContent  : 'center',
                        }}>

                        <VideoPlayer
                            ref={ref => this.Player = ref}
                            startTime={this.state.startTime}  // seconds
                            endTime={this.state.endTime}   // seconds
                            play={false}     // default false
                            replay={false}   // should player play video again if it's ended
                            rotate={false}   // use this prop to rotate video if it captured in landscape mode iOS only
                            source={this.state.VideoPath}
                            style={{ display : 'none' }}
                        />

                        <View style={{
                            width : ScreenWidth,
                            height: ScreenHeight * .42
                        }}>

                            <Image
                                source={this.state.Thumbnail}
                                style={{ width : '100%' , height : '100%' }}
                                resizeMode={'contain'}
                            />

                        </View>


                        <View
                            style={{
                                width  : ScreenWidth,
                                height : ScreenHeight * .05,
                                justifyContent : 'center',
                                alignItems : 'center'
                            }}>

                            <Slider
                                style={{ width : '90%' }}
                                thumbTintColor={SliderColor}
                                minimumTrackTintColor={SliderColor}
                                maximumTrackTintColor={disableSliderColor}
                                value={this.state.value}
                                maximumValue={Number.parseInt(this.state.endTime - 5)}
                                onValueChange={ (time) => {

                                    clearTimeout(this.changeImage);

                                    this.setState({
                                        value : Math.round(time)
                                    }, () => {

                                        this.changeImage = setTimeout( () => {
                                            this.getPreviewImageForSecond(time);
                                        },800)

                                    });



                                }}
                                animateTransitions
                            />

                        </View>

                        <View style={PageStyle.inputStyleView}>

                            <TextInput
                                underlineColorAndroid='transparent'
                                multiline={true}
                                style={PageStyle.inputStyle}
                                value={this.state.Caption}
                                onChangeText={(text) => this.setState({Caption: text})}
                            />

                        </View>

                    </View>

                </ScrollView>

                {this.renderFooterButton()}

            </View>

        );


    }

    renderVideoEditor() {

        return(

            <View style={{ flex :1}}>

                <VideoPlayer
                    ref={ref => this.Player = ref}
                    startTime={this.state.startTime}  // seconds
                    endTime={this.state.endTime}   // seconds
                    play={false}     // default false
                    replay={false}   // should player play video again if it's ended
                    rotate={false}   // use this prop to rotate video if it captured in landscape mode iOS only
                    source={this.state.VideoPath}
                    playerWidth={300} // iOS only
                    playerHeight={500} // iOS only
                    style={{ display : 'none' }}
                />

                <View
                    style={{
                        alignItems      : 'center',
                        justifyContent  : 'center',
                    }}>

                        {this.renderPlayButton()}

                        <Video
                        style={{
                            width: ScreenWidth,
                            height: ScreenHeight * .6}}
                        source={{ uri : this.state.VideoPath , cache: true }}
                        ref={ref => this.videoPlayerRef = ref}
                        rate={1.0}
                        volume={1}
                        paused={this.state.pause}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch={"ignore"}
                        resizeMode={'contain'}
                        onProgress={ (e) => {

                            if (e.currentTime >= this.state.endTime)
                                this.videoPlayerRef.seek(this.state.startTime);

                            this.setState({
                                VideoTime : SecondToMin(e.currentTime) ,
                                CurrentTime : e.currentTime
                            });

                        } }
                        />

                </View>

                <Trimmer
                    source={this.state.VideoPath}
                    minLength={10}
                    maxLength={60}
                    onTrackerMove={(e) => console.log(e.currentTime)} // iOS only
                    currentTime={this.state.currTime} // use this prop to set tracker position iOS only
                    themeColor={'white'} // iOS only
                    thumbWidth={30} // iOS only
                    trackerColor={'green'} // iOS only
                    onChange={(e) => {

                        let Start = 0;
                        let End   = 60;

                        if (!Number.isNaN(e.startTime))
                            Start = e.startTime * 1000;

                        if (!Number.isNaN(e.endTime))
                            End = e.endTime * 1000;

                        this.setState({ startTime : Start ,  endTime : End});

                        this.videoPlayerRef.seek(Start);
                    }}
                />

                <View
                    style={{
                        width : ScreenWidth,
                        height : ScreenHeight * .1,
                        bottom : 0,
                        position : 'absolute',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>

                    <MyButton
                        viewStyle={PageStyle.buttomStyleLeft}
                        text={'انصراف'}
                        touchableOpacityStyle={{backgroundColor: CancelColor}}
                        buttonOnPress={ () => Actions.pop() }
                    />

                    <MyButton
                        viewStyle={PageStyle.buttomStyleRight}
                        text={'بعدی'}
                        buttonOnPress={ () => this.finishEditor() }
                    />

                </View>

            </View>

        )


    }

    renderFooterButton() {

        if (this.state.showKeyboard)
            return null;

        return(

            <View
                style={{
                    width : ScreenWidth,
                    height : ScreenHeight * .1,
                    bottom : 0,
                    position : 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}>

                <View style={PageStyle.buttomStyleView}>

                    <MyButton
                        viewStyle={PageStyle.buttomStyleLeft}
                        text={'انصراف'}
                        touchableOpacityStyle={{backgroundColor: CancelColor}}
                        buttonOnPress={ () => Actions.pop() }
                    />

                    <MyButton
                        viewStyle={PageStyle.buttomStyleRight}
                        text={'ارسال'}
                        buttonOnPress={ () => this.sendPostAPI() }
                    />

                </View>

            </View>

        );

    }

    sendPostAPI(){

        this.setState({ Loading : true });

        ConvertFileToBase64(this.state.VideoPath , (videoBase) => {

            const Params = JSON.stringify({

                SenderId  : this.props.User.ID,
                UserId    : this.props.User.ID,
                ImageBase : this.state.ThumbnailBase,
                File      : videoBase,
                Caption   : this.state.Caption,
                Type      : 'mp4',
                Width     : this.state.SourceVideo.width,
                Height    : this.state.SourceVideo.height
            });

            FetchDataFromAPI("sendUserPost",Params, (response) => {

                if (!response.Success) {
                    Actions.ExceptionDialog({Message: response.Message});
                    return;
                }

                if (this.props.onSendPost !== null)
                    this.props.onSendPost(response.Response[0]);

                Actions.pop();

            }).done( () => this.setState({ Loading : false }) );


        }).done();


    }

}

VideoTrimmer.propTypes = {

    Source     : propTypes.object,
    onSendPost : propTypes.func

};

VideoTrimmer.defaultProps = {
    Source     : null,
    onSendPost : null
};

const mapStateToProps = (states) =>{
    return { User : states.User }
};

export default connect(mapStateToProps)(VideoTrimmer);*/
