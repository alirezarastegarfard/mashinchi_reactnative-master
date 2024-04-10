import React from "react";
import styles from "../publics/homeStyle";
import {
    AccentColor,
    AppFont, backColor, MiniSize,

    OptionPostColor, PrimaryTextColor, SecondaryTextColor, Small, VerySmall
} from "../publics/Ui";
import {FetchDataFromAPI, MediaAddress, MediaURL } from '../publics/DataBase';
import {
    getAppFlavor,
    getMuteState,
    HomeBanner,
    InstagramPostURL,
    saveFile,
    setMuteState
} from '../publics/Function';
import {
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Share,
    Linking,
    Platform
} from "react-native";
import MyText from "./MyText";
import Video from "../../../custom_package/react-native-video"
import PageControl from "react-native-page-control";
import Animation from 'lottie-react-native';
import TouchableScale from "react-native-touchable-scale";
import ProgressiveImage from '../customs/ProgressiveImage'
import DoubleClick from "../customs/DoubleClick";
import {Actions} from "react-native-router-flux";
import SwipeableViews from 'react-swipeable-views-native';
import Swiper from "react-native-swiper";
import ViewMoreText from "./ViewMoreText";
import FastImage from "react-native-fast-image";
import {ProfilePostSync, SyncBookmarkPost, SyncCommentCount, SyncLikePost, UpdateSavedPosts} from "../publics/FuncLibs";

const window = Dimensions.get('window');

const ScreenWidth = window.width;

export default class InstaBanner extends React.PureComponent{

    constructor(props) {
         super(props);

         this.state = {
             indexPage: 0,
             muteVideo: false,
             pauseVideo0: true,
             loading: false,
             showLike: false,
             PostHeight: window.height * (40 / 100),
             showSound: false,
             ShowPage: false,
             isLikePost: this.props.liked,
             LikeLoading: false,
             ShareLoading: false,
             SaveLoading: false,
             downloadLoading : false,
             isSavePost: this.props.saved,
             postLikeCount: this.props.postLikes,
             CommentCount : this.props.CommentCount
         };
     }

    playThisVideo = async (playVideo) => {

        this.setState({
            [`pauseVideo${this.state.indexPage}`]: !playVideo,
            muteVideo: await getMuteState()
        });

    };

    setBookmarkState = (Status) => {

        this.setState({isSavePost : Status});

    };

    setLikeState = (Status,LikeCount) => {

        this.setState({isLikePost : Status , postLikeCount : LikeCount});

    };

    setCommentCount = (CommentCount) => {

        this.setState({ CommentCount });

    };

    pauseAllVideo(){

        const postCount = this.props.posts.length;

        for (let i = 0 ; i < postCount ; i++){
            this.setState({
                [`pauseVideo${i}`] : true
            })
        }

    }

    componentWillMount(){
        this.pauseAllVideo();
    }

    render() {

        const { fullName , postCaption , persianDate , ProfilePhotoName , ShowCommentButtons = true } = this.props;

        return (

            <View style={{
                width : ScreenWidth,
                justifyContent : 'center',
                backgroundColor : backColor,
                marginTop : 15
            }}>

                <TouchableOpacity
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems : 'center',
                        flexDirection: 'row',
                        paddingTop: 5,
                        paddingBottom : 5,
                        paddingRight : 5
                    }}
                    activeOpacity={1}
                 >

                    <TouchableOpacity
                        style={{
                            flex : .2,
                            height : '100%',
                            justifyContent: 'center',
                            paddingLeft : '2%',

                        }}
                        onPress={() => Actions.PostOptionDialog({ Banner : this })}>

                        <FastImage
                            resizeMode={'cover'}
                            style={Styles.ButtonStyle}
                            source={require('../../assets/images/icons/menu.png')}
                        />

                    </TouchableOpacity>

                    <View
                        style={{
                            flex : .8,
                            justifyContent: 'center',
                            marginRight: '2%'
                        }}>

                        <MyText
                            text={fullName}
                            componentStyles={{ fontSize: VerySmall,color : PrimaryTextColor}}
                        />

                        <MyText
                            componentStyles={{
                                fontSize: MiniSize,
                                color : SecondaryTextColor,
                                marginTop:-3
                            }}
                            text={persianDate}
                        />

                    </View>

                    <View
                        style={[styles.ProfileBackCircle,{marginRight : '1.5%'}]}>

                        <Image
                            style={[styles.ProfileCircleStyle,{margin : 0}]}
                            source={{uri: MediaURL + MediaAddress + ProfilePhotoName }}
                        />

                    </View>

                </TouchableOpacity>

                <View style={{width : ScreenWidth , height : .5 , backgroundColor : 'rgba(0,0,0,.2)'}}/>

                <View style={{
                    height: this.state.PostHeight ,
                    width: window.width,
                    justifyContent : 'center' ,
                    alignItems : 'center'
                }}>

                    {this.renderLoading()}
                    {this.renderLike()}
                    {this.renderPageCount()}

                    {Platform.OS === 'android' ?

                        <Swiper
                            style={{height: this.state.PostHeight}}
                            containerStyle={{width: ScreenWidth}}
                            loop={false}
                            showsButtons={false}
                            loadMinimal
                            showsPagination={false}

                            onIndexChanged={(indexPage) => this.setState({indexPage}, () => {
                                this.pauseAllVideo();
                                this.playThisVideo(true);
                                this.ShowAndHidePageCount();
                            })}>
                            {this._renderPage()}
                        </Swiper>
                        :
                        <SwipeableViews
                            style={{width: ScreenWidth, height: this.state.PostHeight}}
                            onChangeIndex={(indexPage) => this.setState({indexPage}, () => {
                                this.pauseAllVideo();
                                this.playThisVideo(true);
                                this.ShowAndHidePageCount();
                            })}>
                            {this._renderPage()}
                        </SwipeableViews>

                    }

                </View>

                <View style={Styles.paginationStyle}>

                    <View style={{flex :1, flexDirection:'row' , backgroundColor : 'transparent'}}>

                        <View style={{
                            flex: .15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft : 10,
                            backgroundColor : 'transparent'
                        }}>

                            <View style={Styles.ButtonStyle}>

                                <TouchableScale
                                    style={Styles.ButtonStyle}
                                    onPress={() => this._savePost()}>

                                    {this.state.SaveLoading ?

                                        <ActivityIndicator
                                            color={AccentColor}/>

                                        :

                                        <FastImage
                                            resizeMode={'contain'}
                                            style={Styles.ButtonStyle}
                                            source={this.state.isSavePost ? require('../../assets/images/icons/Bookmark-Fill.png') : require('../../assets/images/icons/bookmark.png')}/>

                                    }
                                </TouchableScale>

                            </View>

                        </View>

                        <View style={Styles.pageControl}>

                            <PageControl
                                numberOfPages={this.props.posts.length}
                                currentPage={this.state.indexPage}
                                hidesForSinglePage
                                pageIndicatorTintColor={'#E2E2E2'}
                                currentPageIndicatorTintColor={AccentColor}
                                indicatorStyle={{borderRadius: 5}}
                                currentIndicatorStyle={{borderRadius: 5}}
                                indicatorSize={{width:6, height:6}}
                            />

                        </View>

                        <View style={{
                            flex: .3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingRight : 10,
                            backgroundColor : 'transparent'
                        }}>

                            <View style={Styles.ButtonStyle}>

                                <TouchableScale
                                    style={{display : ShowCommentButtons ? 'flex' : 'none'}}
                                    onPress={() => this._sharePost() }>

                                    {this.state.ShareLoading ?

                                        <ActivityIndicator
                                            color={AccentColor}/>

                                        :

                                        <FastImage
                                            resizeMode={'contain'}
                                            style={Styles.ButtonStyle}
                                            source={require('../../assets/images/icons/share.png')}/>

                                    }

                                </TouchableScale>

                            </View>

                            <View style={Styles.ButtonStyle}>

                                <TouchableScale
                                    onPress={() => ShowCommentButtons ? this.showCommentPage() : this._sharePost() }>

                                    {this.state.ShareLoading && !ShowCommentButtons ?

                                        <ActivityIndicator
                                            color={AccentColor}/>

                                        :

                                        <FastImage
                                            resizeMode={'contain'}
                                            style={Styles.ButtonStyle}
                                            source={ShowCommentButtons ? require('../../assets/images/icons/post_comment.png') : require('../../assets/images/icons/share.png')}/>
                                    }

                                </TouchableScale>

                            </View>

                            <View style={Styles.ButtonStyle}>

                                <TouchableScale
                                    onPress={ () => this._likePost(this.state.isLikePost ? "UNLIKE" : "LIKE") }>

                                    {this.state.LikeLoading ?

                                        <ActivityIndicator
                                            color={AccentColor}/>

                                        :

                                        <FastImage
                                            resizeMode={'contain'}
                                            style={Styles.ButtonStyle}
                                            source={this.state.isLikePost ? require('../../assets/images/icons/RedLike.png') : require('../../assets/images/icons/Like.png')}/>

                                    }
                                </TouchableScale>

                            </View>

                        </View>

                    </View>

                </View>

                <View style={{
                    backgroundColor : 'transparent',
                    flex: 0.4,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingRight: '3%',
                    paddingLeft : '3%',
                    marginBottom:10,
                    display : this.state.postLikeCount > 0 ? 'flex' : 'none'
                }}>

                    <MyText
                        componentStyles={{fontSize: Small}}
                        text={`${this.state.postLikeCount} نفر پسندیده اند`}
                    />

                </View>

                <View style={{
                    backgroundColor : 'transparent',
                    paddingRight: '3%',
                    paddingLeft : '3%',
                }}>

                    <ViewMoreText
                        numberOfLines={this.props.showPostComplete ? 0 : 2}
                        textStyle={{textAlign : 'right'}}
                        renderViewLess={() => null}
                        renderViewMore={(onPress) => {
                            return (
                                <MyText
                                    componentStyles={{fontSize: VerySmall}}
                                    text={"بیشتر..."}
                                    onPress={onPress}
                                />
                            );
                        }}>

                        <MyText
                            componentStyles={{fontSize: VerySmall}}
                            text={postCaption}
                        />

                    </ViewMoreText>

                    <TouchableOpacity
                        style={{
                            marginTop : '2%',
                            marginBottom: '3%',
                            display : ShowCommentButtons ? 'flex' : 'none'
                        }}
                        activeOpacity={.6}
                        onPress={() => this.showCommentPage()}>

                        <MyText
                            componentStyles={{
                                fontSize:Small,
                                color: SecondaryTextColor
                            }}
                            text={`مشاهده نظرات (${ this.state.CommentCount })`}
                        />

                    </TouchableOpacity>

                </View>


            </View>
        );
    }

    _renderPage(){

        const { posts } = this.props;

        let Elements = [];

        const Width  = posts[0].Width;
        const Height = posts[0].Height;

        const PostHeight = ((Height * ScreenWidth) / Width);
        this.setState({ PostHeight });

        posts.map( (post , index) => {

            Elements.push(

                <View key={post.SlideId} style={{flex :1,height : this.state.PostHeight}}>

                    { post.IsVideo === "0" ?

                        <DoubleClick
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent : 'center',
                                alignItems : 'stretch'
                            }}
                            doubleTap={ () => this._likePost("DBLTAP") }
                            activeOpacity={1}
                            delay={300}>

                            <ProgressiveImage
                                thumbnailSource={{ uri: MediaURL + MediaAddress + post.PostName  }}
                                imageSource={{ uri: MediaURL + MediaAddress + post.PostName  }}
                                style={{width: '100%', height: '100%'}}
                                thumbnailBlurRadius={10}
                            />

                        </DoubleClick>

                        :

                        this.renderVideoComponent(post , index)

                    }

                </View>
            );
        });

        return Elements;

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

    renderLike(){

        if (this.state.showLike) {

            return (
                <Animation
                    source={require('../../assets/lottie/like')}
                    autoPlay
                    loop={false}
                    style={{
                        width: 200,
                        height: 200,
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf:'center'
                    }}/>
            );
        }else
            return null;

    }

    renderVideoComponent(post , index){

        return(

            <DoubleClick
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent : 'center',
                    alignItems : 'stretch'
                }}
                singleTap={ () => this.MuteAndUnMutePost()}
                doubleTap={ () => this._likePost("DBLTAP") }
                activeOpacity={1}
                delay={300}>

                {this.renderSoundIcon()}

                <Video
                    style={{width: '100%', height: '100%'}}
                    source={{ uri : MediaURL + MediaAddress + post.PostName }}
                    ref={(ref) => this.playerRef = {...this.playerRef, [`REF-PLAY${post.SlideId}`] : ref }}
                    rate={1.0}
                    volume={this.state.muteVideo ? 0 : 1}
                    paused={this.state[`pauseVideo${index}`]}
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch={"ignore"}
                    onLoadStart={() => this.setState({loading : true })}
                    onLoad={ () => this.setState({ loading : false })}
                    onBuffer={ (e) => this.setState({loading : e.isBuffering }) }
                    onEnd={() => this.playerRef[`REF-PLAY${post.SlideId}`].seek(0) }
                />

            </DoubleClick>

        );

    }

    _likePost(Like){

        if (this.state.LikeLoading)
            return;

        const { UserId = null , postId } = this.props;

        if (Like !== "UNLIKE")
            this.setState({ showLike : true  },
                () => setTimeout( () => this.setState({showLike : false}) , 800) );

        if (Like === "DBLTAP" && this.state.isLikePost)
            return;

        const Params = JSON.stringify({

            UserId,
            PostId : postId,
            Like : Like

        });

        this.setState({ LikeLoading : true });

        FetchDataFromAPI("LikePost",Params,(response) => {

            this.setState({
                postLikeCount : response.Response.LikeCount,
                isLikePost : response.Response.LIKE ,
                LikeLoading : false
            }, () => {

                if (Actions.currentScene !== 'Main'){
                    SyncLikePost(postId,this.state.isLikePost,this.state.postLikeCount);
                }

            });

        }).done( () => this.setState({LikeLoading : false}) );


    }

    _savePost(){

        if (this.state.SaveLoading)
            return;

        const { UserId = null , postId } = this.props;

        if (UserId === null){
            Actions.QuestionDialog({
                Message : "ابتدا باید وارد حساب کاربری خود شوید" ,
                onConfirm : () => goProfilePage(),
                CancelText : 'انصراف',
                ConfirmText : 'ورود',
                Type : 'INFO'
            });
            return;
        }

        const Params = JSON.stringify({

            UserId,
            PostId : postId,
            Save : this.state.isSavePost ? "UNSAVE" : "SAVE"

        });

        this.setState({ SaveLoading : true });

        FetchDataFromAPI("SavePost",Params,(response) => {

            this.setState({ isSavePost : response.Response.SAVE } , () => {

                if (!this.state.isSavePost)
                    ProfilePostSync(postId);
                else
                    UpdateSavedPosts();

                if (Actions.currentScene !== 'Main'){
                    SyncBookmarkPost(postId,this.state.isSavePost);
                }

            });

        }).done( () => this.setState({SaveLoading : false}) );

    }

    MuteAndUnMutePost(){

        if (this.HideSound !== null)
            clearTimeout(this.HideSound);

        this.setState({ muteVideo : !this.state.muteVideo , showSound : true } , () => {

            setMuteState(this.state.muteVideo);

            this.HideSound = setTimeout(() => {

                this.setState({showSound: false});

            }, 3000);

        });

    }

    ShowAndHidePageCount(){

        if (this.HidePage !== null)
            clearTimeout(this.HidePage);

        this.setState({ ShowPage : true} , () => this.HidePage = setTimeout( () => {

            this.setState({ShowPage : false});

        },3000));

    }

    renderSoundIcon(){

        if (this.state.showSound) {

            return (

                <View
                    style={{
                        backgroundColor: OptionPostColor,
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        zIndex: 1
                    }}>

                    <FastImage
                        source={this.state.muteVideo ? require('../../assets/images/icons/mute.png') : require('../../assets/images/icons/soundOn.png')}
                        style={{width: 17, height: 17}}
                        resizeMode={'stretch'}
                    />

                </View>


            );

        }else
            return null;

    }

    renderPageCount(){

        if (this.props.posts.length > 1 && this.state.ShowPage) {

            return (

                <View style={{
                    backgroundColor: OptionPostColor,
                    borderRadius: 80,
                    width: 45,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: 5,
                    position: 'absolute',
                    zIndex: 1,
                    top: 15,
                    left: 10,
                }}>
                    <MyText
                        componentStyles={{
                            color: 'white',
                            fontSize: 14
                        }}
                        text={(this.state.indexPage + 1) + '/' + this.props.posts.length}
                    />
                </View>

            );
        }else
            return null;

    }

    openPostonInstagram(){

        const { shortCode } = this.props;

        const url = InstagramPostURL + shortCode;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));

    }

    _sharePost() {

        if (this.state.ShareLoading)
            return;

        const {fullName, postCaption , posts} = this.props;

        const PostLink = MediaURL + MediaAddress + posts[this.state.indexPage].PostName;

        const Parameter = JSON.stringify({

            Post    : PostLink,
            Profile : fullName,
            Caption : postCaption,
            Flavor  : getAppFlavor()


        });

        this.setState({ShareLoading : true});

        FetchDataFromAPI("GetSharePost", Parameter, (response) => {

            let Message = response.Response.ShareText;

            Share.share({

                message: Message,
                title: "ماشینچی"

            });

        }).done( () => this.setState({ShareLoading : false}) );

    }

    savePostOnDevice(){

        const {posts} = this.props;

        const PostSlide = posts[this.state.indexPage];

        this.setState({ downloadLoading : true });

        const PostLink = MediaURL + MediaAddress + PostSlide.PostName;

        let FileName = "Mashinchi_" + PostSlide.SlideId.toString();

        if (PostSlide.IsVideo === "0")
            FileName += ".jpg";
        else
            FileName += ".mp4";


        saveFile(PostLink,FileName, (res) => {

            this.setState({ downloadLoading : false });

            if (res !== null) {
                Actions.ConfirmDialog({Message: "فایل با موفقیت ذخیره شد"});
            }else
                Actions.ExceptionDialog({ Message : "خطا در ذخیره فایل" });

        });

    }

    showCommentPage(){

        const { postId } = this.props;

        this.pauseAllVideo();
        Actions.Comment({
            PostId : postId,
            CommentCount : this.state.CommentCount,
            onClose : (CommentCount) => {

                if (HomeBanner !== null)
                    HomeBanner.playThisVideo(true);

                this.setState({ CommentCount });

                if (Actions.currentScene !== 'Main'){
                    SyncCommentCount(postId,CommentCount);
                }

            }
        });

    }

}

const FooterHeight = 50;

const Styles = StyleSheet.create({

    paginationStyle: {
        backgroundColor : 'transparent',
        alignItems : 'center',
        width : window.width,
        height:FooterHeight
    },
    pageControl : {
        flex : .55,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 5
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
