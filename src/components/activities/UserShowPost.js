import React from 'react';
import {
    AppFont, VerySmall
} from "../publics/Ui";
import {Image, StatusBar, StyleSheet, TouchableOpacity, View,Animated} from "react-native";
import BaseUi from "../basepage/BaseUi";
import {connect} from "react-redux";
import propTypes from 'prop-types';
import {Actions} from "react-native-router-flux";
import MyText from "../customs/MyText";
import {FetchDataFromAPI, MediaURL, UsersPostAddress} from "../publics/DataBase";
import {HeaderHeight, ScreenHeight, ScreenWidth} from "../publics/Function";
import Video from "../../../custom_package/react-native-video";
import ProgressiveImage from "../customs/ProgressiveImage";
import Animation from 'lottie-react-native';
import {HIDDEN, USER_POST_TYPE_IMAGE, VISIBLE} from "../publics/Constant";
import ViewMoreText from "../customs/ViewMoreText";
import FastImage from "react-native-fast-image";

class UserShowPost extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            muteVideo  : false,
            pauseVideo : true,
            loading    : false,
            PostHeight : ScreenHeight * (40 / 100),
            showSound  : false,
            Loading    : false,
            PostData   : this.props.PostData,
            isRemove   : false,
            Opacity    : new Animated.Value(1),
            HideStatus : false
        };

    }

    playThisVideo = async (playVideo) => {

        this.setState({
            pauseVideo : !playVideo
        });

    };

    showHideHeaderFooter(){

        let Option = {};

        if (this.state.HideStatus) {
            Option = {
                toValue: 1,
                duration: 200
            };
        }else{
            Option = {
                toValue: 0,
                duration: 200
            };
        }

        Animated.timing(this.state.Opacity,Option).start( () => {
            this.setState({ HideStatus : !this.state.HideStatus });
        });

    }

    componentWillMount(){

        if (this.props.UserPostId === null) {

            const Width = this.props.PostData.Width;
            const Height = this.props.PostData.Height;

            const PostHeight = ((Height * ScreenWidth) / Width);
            this.setState({PostHeight});
        }

    }

    componentDidMount(){

        if (this.props.UserPostId !== null){

            this.setState({ Loading : true });

            let Parameter = JSON.stringify({
                UserId     : this.props.User.ID,
                Page       : 1,
                ShowUserId : this.props.User.ID,
                UserPostId : this.props.UserPostId
            });

            FetchDataFromAPI("getUsersPosts", Parameter, (response)=>{

                const PostData = response.Response[0];

                const Width = PostData.Width;
                const Height = PostData.Height;

                const PostHeight = ((Height * ScreenWidth) / Width);

                this.setState({ PostData : PostData ,  PostHeight});

            }).done(() => this.setState({ Loading : false }));


        }else {

            if (this.props.PostData.PostFileTypeId === USER_POST_TYPE_IMAGE)
                return;

            setTimeout(() => {

                this.playThisVideo(true);


            }, 1200);

        }
    }

    componentWillUnmount(): void {
        if (this.props.callback !== null && !this.state.isRemove)
            this.props.callback(this.state.PostData);
    }

    render(){

        if (this.state.PostData === null){

            return(

                <BaseUi
                    Loading={this.state.Loading}
                    ViewStyle={{flex: 1, backgroundColor: 'black'}}>

                    <StatusBar
                        backgroundColor={'black'}
                        barStyle={'light-content'}
                    />

                </BaseUi>

            );

        }else {

            return (

                <BaseUi
                    Loading={this.state.Loading}
                    ViewStyle={{flex: 1, backgroundColor: 'black'}}>

                    <StatusBar
                        animated={true}
                        backgroundColor={'black'}
                        barStyle={'light-content'}
                    />

                    <Animated.View
                        style={{
                            opacity : this.state.Opacity,
                            backgroundColor: 'rgba(0,0,0,.6)',
                            position : 'absolute',
                            top : 0,
                            height : HeaderHeight,
                            width : ScreenWidth,
                            zIndex : 100,
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}>


                        <FastImage
                            source={require('../../assets/images/imgs/ic_mashinchi_white.png')}
                            style={{
                                width: '50%',
                                height: '70%'
                            }}
                            resizeMode={"contain"}
                        />

                        <TouchableOpacity
                            style={{
                                height: HeaderHeight,
                                justifyContent: 'center',
                                alignItems : 'center',
                                position : 'absolute',
                                right : 5,
                                paddingLeft: '2%',
                            }}
                            onPress={() => Actions.pop()}>

                            <FastImage
                                resizeMode={'contain'}
                                style={Styles.ButtonStyle}
                                source={require('../../assets/images/icons/RightArrow_white.png')}
                            />

                        </TouchableOpacity>

                        {this.renderOptionPost()}

                    </Animated.View>

                    <TouchableOpacity
                        style={{
                            width : ScreenWidth,
                            backgroundColor: 'black',
                            height : ScreenHeight ,
                            justifyContent : 'center',
                            alignItems : 'center',
                            position : 'absolute',
                            zIndex : 0
                        }}
                        activeOpacity={1}
                        onPress={() => this.showHideHeaderFooter()}>

                            <View style={{
                                height: this.state.PostHeight,
                                width: window.width,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

                                {this.renderLoading()}

                                <View
                                    style={{height: this.state.PostHeight, width: ScreenWidth}}>
                                    {this._renderPage()}
                                </View>


                            </View>

                    </TouchableOpacity>

                    <Animated.View style={{
                        opacity : this.state.Opacity,
                        backgroundColor: 'rgba(0,0,0,.6)',
                        position : 'absolute',
                        bottom : 0,
                        paddingRight: '5%',
                        paddingLeft: '5%',
                        minHeight : 70,
                        width : ScreenWidth,
                        zIndex : 100,
                        paddingTop : 10,
                        paddingBottom : 30
                    }}>

                        <View
                            style={{
                                width : '100%',
                                flexDirection : 'row',
                                justifyContent : 'space-between'
                            }}>

                            <MyText
                                text={this.state.PostData.PersianDate}
                                componentStyles={{
                                    fontSize:  VerySmall,
                                    color : 'rgba(255,255,255,.6)'
                                }}
                            />

                            <MyText
                                text={this.state.PostData.SenderUserName}
                                componentStyles={{
                                    color : 'white',
                                    fontSize :VerySmall,
                                    marginBottom : 3
                                }}
                            />

                        </View>

                        <ViewMoreText
                            numberOfLines={4}
                            textStyle={{textAlign : 'right'}}
                            renderViewLess={() => null}
                            renderViewMore={(onPress) => {
                                return (
                                    <MyText
                                        componentStyles={{

                                            color: 'rgba(255,255,255,.5  )',
                                            marginTop : 5
                                        }}
                                        text={"بیشتر..."}
                                        onPress={onPress}
                                    />
                                );
                            }}>

                            <MyText
                                componentStyles={{

                                    color : 'rgba(255,255,255,.8)'
                                }}
                                text={this.state.PostData.PostCaption}
                            />

                        </ViewMoreText>

                    </Animated.View>

                </BaseUi>

            );

        }
    }

    renderVideoComponent(){

        return(

            <TouchableOpacity
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent : 'center',
                    alignItems : 'stretch'
                }}
                onPress={ () => this.showHideHeaderFooter()}
                activeOpacity={1}>

                <Video
                    style={{width: '100%', height: '100%'}}
                    source={{ uri : MediaURL + UsersPostAddress + this.state.PostData.PostFileName , cache: true }}
                    ref={(ref) => this.playerRef = ref }
                    rate={1.0}
                    paused={this.state.pauseVideo}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch={"ignore"}
                    onLoadStart={() => this.setState({loading : true })}
                    onLoad={ () => this.setState({ loading : false })}
                    onBuffer={ (e) => this.setState({loading : e.isBuffering }) }
                    onEnd={() => this.playerRef.seek(0) }
                />

            </TouchableOpacity>

        );

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
        }else
            return null;

    }

    _renderPage(){

        if (this.state.PostData.PostFileTypeId === USER_POST_TYPE_IMAGE){

            return(

                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent : 'center',
                        alignItems : 'stretch'
                    }}>

                    <ProgressiveImage
                        thumbnailSource={{ uri: MediaURL + UsersPostAddress + this.state.PostData.ThumbnailName  }}
                        imageSource={{ uri: MediaURL + UsersPostAddress + this.state.PostData.PostFileName  }}
                        style={{width: '100%', height: '100%'}}
                        thumbnailBlurRadius={10}
                    />

                </View>

            );

        }else
            return this.renderVideoComponent()

    }

    setVisiblePost(){

        this.setState({ Loading : true });

        const Parameter = JSON.stringify({

            UserPostId : this.state.PostData.UserPostId,
            Visible    : this.state.PostData.Visible === VISIBLE ? HIDDEN : VISIBLE

        });

        FetchDataFromAPI("setPostVisible",Parameter, (response) =>{

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            let PostData = this.state.PostData;

            PostData.Visible = PostData.Visible === VISIBLE ? HIDDEN : VISIBLE;

            this.setState({ PostData });

        }).done( () => this.setState({ Loading : false }) );

    }

    editPostText(PostText,onFinish){

        const Parameter = JSON.stringify({
            PostId : this.state.PostData.UserPostId,
            Caption : PostText
        });

        FetchDataFromAPI("EditPostCaption",Parameter,(response) => {

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            let PostData = this.state.PostData;

            PostData.PostCaption = PostText;

            this.setState({ PostData });

            onFinish();

        }).done();

    }

    deletePost(){

        Actions.QuestionDialog({
            Message   : "آیا برای حذف پست اطمینان دارید؟",
            onConfirm : () => this.ExecRemovePost()
        });

    }

    ExecRemovePost() {

        this.setState({ Loading : true , isRemove : true });

        const Parameter = JSON.stringify({
            PostId : this.state.PostData.UserPostId,
            UserId : this.props.User.ID
        });

        FetchDataFromAPI("RemoveUserPost",Parameter,(response) =>{

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            this.props.onRemove();
            Actions.pop();

        }).done( () => this.setState({ Loading : false }) );

    }

    renderOptionPost() {

        if (this.state.PostData.UserId === this.props.User.ID)
            return(

                <TouchableOpacity
                    style={{
                        height: HeaderHeight,
                        justifyContent: 'center',
                        alignItems : 'center',
                        position : 'absolute',
                        left : 2,
                        paddingLeft: '2%'
                    }}
                    onPress={() => Actions.OwnerPostDialog({
                        Parent: this,
                        Visible: this.state.PostData.Visible
                    })}>

                    <Image
                        resizeMode={'contain'}
                        style={[Styles.ButtonStyle,{tintColor : 'white'}]}
                        source={require('../../assets/images/icons/menu.png')}
                    />

                </TouchableOpacity>

            );
        else
            return null;

    }
}

const FooterHeight = 50;

const Styles = StyleSheet.create({

    paginationStyle: {
        backgroundColor : 'transparent',
        alignItems : 'center',
        width : ScreenWidth,
        height:FooterHeight
    },
    pageControl : {
        flex : .6,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 10
    },
    ButtonStyle : {
        width: FooterHeight * .5,
        height: FooterHeight * .5,
        justifyContent : 'center',
        alignItems : 'center'
    },
    paginationText: {
        fontFamily : AppFont,
        color: 'white'
    }

});

UserShowPost.propTypes = {
    PostData : propTypes.object,
    UserPostId : propTypes.string,
    callback : propTypes.func
};

UserShowPost.defaultProps = {
    PostData   : null,
    callback   : null,
    UserPostId : null
};

const mapStateToProps = (states) => {

    return {

        User : states.User

    };

};

export default connect(mapStateToProps)(UserShowPost)