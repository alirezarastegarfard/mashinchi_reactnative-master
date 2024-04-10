import React from 'react';
import {SafeAreaView,View,StyleSheet,TouchableOpacity,StatusBar} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from "../../../custom_package/react-native-video"
import propTypes from 'prop-types';
import {HeaderHeight, ScreenHeight, ScreenWidth, SecondToMin} from "../publics/Function";
import {Actions} from "react-native-router-flux";
import MyText from "../customs/MyText";
import {disableSliderColor, SliderColor} from "../publics/Ui";
import PlayIcon from '../../assets/images/icons/play.png';
import PauseIcon from '../../assets/images/icons/pause.png';
import FullScreen from '../../assets/images/icons/full-screen.png';
import RestoreScreen from '../../assets/images/icons/restore.png';
import Slider from "react-native-slider";
import Animation from 'lottie-react-native';
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import FastImage from "react-native-fast-image";

const portraitPercent  = '15%';
const landScapePercent = '10%';

class Player extends React.PureComponent{

    constructor(props){
        super(props);

        this.state = {
            videoPause : false,
            loading : false,
            showTitle : false,
            orientation : 'portrait',
            CurrentTime : 0,
            VideoTime   : '00:00',
            showPlayPauseAnimation : false
        }

    }

    showHeaderFooter(hideTime = 5000){

        if (this.state.showTitle)
            this.setState({ showTitle : false });
        else {

            this.setState({showTitle: true}, () => {

                setTimeout(() => this.setState({showTitle: false}), hideTime)

            });
        }

    }

    componentDidMount(): void {
        this.showHeaderFooter(10000);

        const Parameter = JSON.stringify({

            UserId  : this.props.User.ID,
            MediaId : this.props.MediaId

        });

        FetchDataFromAPI("setMediaViewCount" , Parameter , (response) => {

            console.log(response.Response.ViewCount);

        }).done();

    }

    componentWillUnmount(): void {
        Orientation.lockToPortrait();
    }

    render(){

        return(

            <SafeAreaView
                style={{
                    flex:1,
                    backgroundColor:'black',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>

                <StatusBar hidden/>

                {this.renderTitle()}
                {this.renderLoading()}
                {this.renderPausePlayAnimation()}

                <TouchableOpacity
                    style={{
                        width  : '100%',
                        height : '100%',
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}
                    activeOpacity={1}
                    onPress={ () => this.showHeaderFooter() }>

                    <Video
                        style={{
                            width: '100%',
                            height: this.state.orientation === 'portrait' ? ScreenHeight * .35 : '100%'}}
                        source={{ uri : this.props.VideoName , cache: true }}
                        ref={(ref) => this.playerRef = ref }
                        rate={1.0}
                        volume={1}
                        paused={this.state.videoPause}
                        playInBackground={false}
                        playWhenInactive={false}
                        ignoreSilentSwitch={"ignore"}
                        onLoadStart={() => this.setState({loading : true })}
                        onLoad={ () => this.setState({ loading : false })}
                        onBuffer={ (e) => this.setState({loading : e.isBuffering }) }
                        onProgress={ (e) => {

                            this.setState({
                                VideoTime : SecondToMin(e.currentTime) ,
                                CurrentTime : e.currentTime
                            });

                        } }
                    />

                </TouchableOpacity>

                {this.renderFooter()}

            </SafeAreaView>

        );
    }

    renderTitle(){

        if (!this.state.showTitle && !this.state.videoPause)
            return null;

        return(

            <View
                style={[Styles.HeaderFooterStyle,{
                    width: this.state.orientation === 'portrait' ? ScreenWidth : ScreenHeight,
                    top : 0,
                    paddingLeft : 10
                }]}>



                <View
                    style={{
                        justifyContent : 'center',
                        width : '90%',
                        height : '100%',
                        paddingRight:10,
                        paddingLeft : 5
                    }}>

                    <MyText
                        componentStyles={{
                            color:'white'
                            ,marginTop:4.5
                        }}
                        numberOfLines={1}
                        text={this.props.MediaTitle}
                    />

                </View>
                <TouchableOpacity
                    style={{
                        width : '10%' ,
                        height : '100%' ,
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}
                    onPress={ () => Actions.pop() }>
                    <FastImage
                        style={{ width : '40%' , height : '40%'}}
                        source={require('../../assets/images/icons/RightArrow_white.png')}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>

            </View>

        );

    }

    renderFooter(){

        if (!this.state.showTitle && !this.state.videoPause)
            return null;

        const ViewWidth = this.state.orientation === 'portrait' ? portraitPercent : landScapePercent;

        return(

            <View
                style={[Styles.HeaderFooterStyle,{
                    width: this.state.orientation === 'portrait' ? ScreenWidth : ScreenHeight,
                    bottom : 0
                }]}>

                <TouchableOpacity
                    style={{
                        width : ViewWidth ,
                        height : '100%' ,
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}
                    onPress={ () => this.playAndPause() }>
                    <FastImage
                        style={{ width : '40%' , height : '40%'}}
                        source={this.state.videoPause ? PlayIcon : PauseIcon}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>

                <View
                    style={{
                        justifyContent : 'center',
                        alignItems : 'center',
                        width : ViewWidth,
                        height : '100%'
                    }}>

                    <MyText
                        componentStyles={{
                            color:'white',
                            textAlign : 'center',

                        }}
                        text={this.state.VideoTime}
                    />

                </View>

                <View
                    style={{
                        justifyContent : 'center',
                        alignItems : 'center',
                        width : this.state.orientation === 'portrait' ? '40%' : '60%',
                        height : '100%'
                    }}>

                    <Slider
                        style={{ width : '100%' }}
                        thumbTintColor={SliderColor}
                        minimumTrackTintColor={SliderColor}
                        maximumTrackTintColor={disableSliderColor}
                        value={this.state.CurrentTime}
                        maximumValue={Number.parseInt(this.props.Duration)}
                        onValueChange={ (time) => {
                            this.playerRef.seek(time);
                            this.setState({
                                VideoTime : SecondToMin(time),
                                CurrentTime : time
                            });
                        }}
                        animateTransitions
                    />

                </View>

                <View
                    style={{
                        justifyContent : 'center',
                        width : ViewWidth,
                        height : '100%'
                    }}>

                    <MyText
                        componentStyles={{
                            textAlign : 'center',
                            color:'white',

                        }}
                        text={SecondToMin(this.props.Duration)}
                    />

                </View>

                <TouchableOpacity
                    style={{
                        width : ViewWidth ,
                        height : '100%' ,
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}
                    onPress={ () => this.switchOrientation() }>
                    <FastImage
                        style={{ width : '40%' , height : '40%'}}
                        source={this.state.orientation === 'portrait' ? FullScreen : RestoreScreen}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>

            </View>

        );

    }

    playAndPause() {

        this.setState({ videoPause : !this.state.videoPause , showPlayPauseAnimation : true } , () => {

            setTimeout( () => this.setState({ showPlayPauseAnimation : false }) ,1800 );

        });

    }

    switchOrientation() {

        if (this.state.orientation === 'portrait') {
            this.setState({ orientation : 'landscape' });
            Orientation.lockToLandscape();
        }else if (this.state.orientation === 'landscape') {
            this.setState({ orientation : 'portrait' });
            Orientation.lockToPortrait();
        }

    }

    renderLoading(){

        if (this.state.loading) {

            return (
                <Animation
                    source={require('../../assets/lottie/loading')}
                    autoPlay
                    loop
                    style={{
                        width: 75,
                        height: 75,
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf:'center'
                    }}/>
            );
        }else if (this.state.downloadLoading){

            return (
                <Animation
                    source={require('../../assets/lottie/downloading')}
                    autoPlay
                    loop
                    style={{
                        width: 75,
                        height: 75,
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf:'center'
                    }}/>
            );

        }else
            return null;

    }

    renderPausePlayAnimation(){

        if (!this.state.showPlayPauseAnimation)
            return null;

        if (this.state.videoPause){
            return (

                <Animation
                    source={require('../../assets/lottie/play_pause')}
                    autoPlay
                    style={{
                        width: 75,
                        height: 75,
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf:'center'
                    }}/>

            );
        }else{

            return(

                <Animation
                    source={require('../../assets/lottie/pause_play')}
                    autoPlay
                    style={{
                        width: 75,
                        height: 75,
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf:'center'
                    }}/>

            );

        }


    }
}

const Styles = StyleSheet.create({

   HeaderFooterStyle : {
       backgroundColor: 'rgba(0,0,0,.4)',
       position : 'absolute',
       height: HeaderHeight,
       zIndex : 1,
       flexDirection : 'row',
       justifyContent:'center',alignItems:'center'
   }

});

Player.propTypes = {
    VideoName : propTypes.string,
    MediaTitle : propTypes.string,
    Duration : propTypes.string,
    MediaId  : propTypes.string
};

const mapStateToProps = (states) => {

    return { User : states.User };

};

export default connect(mapStateToProps)(Player);