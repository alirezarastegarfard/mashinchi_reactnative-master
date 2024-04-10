import React from "react";
import styles from "../publics/homeStyle";
import {
    AccentColor,
    AppFont, backColor, MiniSize,
    PrimaryTextColor, SecondaryTextColor, Small, VerySmall
} from "../publics/Ui";
import {BaseURL, FetchDataFromAPI, ImagesAddress} from '../publics/DataBase';
import {
    getAppFlavor, HomeBanner,
    saveFile,
} from '../publics/Function';
import {
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Share
} from "react-native";
import MyText from "../customs/MyText";
import Animation from 'lottie-react-native';
import TouchableScale from "react-native-touchable-scale";
import ProgressiveImage from '../customs/ProgressiveImage';
import DoubleClick from "../customs/DoubleClick";
import {Actions} from "react-native-router-flux";
import ViewMoreText from "../customs/ViewMoreText";
import FastImage from "react-native-fast-image";
import {ProfilePostSync, SyncBookmarkPost, SyncCommentCount, SyncLikePost, UpdateSavedPosts} from "../publics/FuncLibs";

const window = Dimensions.get('window');

const ScreenWidth = window.width;

export default class LongVideoBanner extends React.PureComponent{

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showLike: false,
            PostHeight: window.height * (35 / 100),
            isLikePost: this.props.liked,
            LikeLoading: false,
            ShareLoading: false,
            SaveLoading: false,
            downloadLoading : false,
            isSavePost: this.props.saved,
            postLikeCount: this.props.postLikes,
            CommentCount : this.props.CommentCount
        };
    };

    playThisVideo = (playVideo) => {
        //In Function Is Required Lotfan Pak Nashavad Merc Aaaaaaah ;-)
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

    render() {

        const { fullName , postCaption , persianDate , ProfilePhotoName , CommentCount = 0 , ThumbnailName , posts , PostTitle , Duration , ShowCommentButtons = true} = this.props;

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
                    activeOpacity={1}>

                    <TouchableOpacity
                        style={{
                            flex : .2,
                            height : '100%',
                            justifyContent: 'center',
                            paddingLeft : '2%',

                        }}
                        onPress={() => Actions.PostOptionDialog({ Banner : this , ShowInstagram : false })}>

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
                            marginRight: '2%',

                        }}>
                        <MyText
                            text={fullName}
                            componentStyles={{fontSize: VerySmall,color : PrimaryTextColor}}
                        />

                        <MyText
                            componentStyles={{
                                color : SecondaryTextColor,
                                fontSize: MiniSize,
                                marginTop:-3
                            }}
                            text={persianDate}
                        />

                    </View>

                    <View
                        style={[styles.ProfileBackCircle,{marginRight : '1.5%'}]}>

                        <Image
                            style={[styles.ProfileCircleStyle,{margin : 0}]}
                            source={{uri: BaseURL + ImagesAddress + ProfilePhotoName }}
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

                    <View
                        style={{
                            width: window.width,
                            height: this.state.PostHeight}}>

                        <DoubleClick
                            style={{
                                width: window.width,
                                height: this.state.PostHeight,
                                justifyContent : 'center',
                                alignItems : 'center'
                            }}
                            singleTap={ () => Actions.Player({
                                MediaId    : posts[0].PostId,
                                VideoName  : posts[0].PostName,
                                MediaTitle : PostTitle,
                                Duration   : Duration })}
                            doubleTap={ () => this._likePost("DBLTAP") }
                            activeOpacity={1}
                            delay={300}>

                            <FastImage
                                resizeMode={'cover'}
                                style={{
                                    width: 60,
                                    height: 60,
                                    position :'absolute',
                                    zIndex : 1
                                }}
                                source={require("../../assets/images/icons/video.png")}
                            />

                            <ProgressiveImage
                                thumbnailSource={{ uri: ThumbnailName  }}
                                imageSource={{ uri: ThumbnailName }}
                                style={{width: '100%', height: '100%'}}
                                thumbnailBlurRadius={10}
                                resizeMode={'contain'}
                            />

                        </DoubleClick>

                    </View>

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

                        <View style={Styles.pageControl}/>

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
                        componentStyles={{fontSize:Small}}
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
                                    componentStyles={{ color: SecondaryTextColor}}
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
            },() => {

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

            this.setState({ isSavePost : response.Response.SAVE },() => {

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

    _sharePost() {

        if (this.state.ShareLoading)
            return;

        const {fullName, postCaption , posts} = this.props;

        const PostLink = posts[0].PostName;

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

        const {posts , postId} = this.props;

        this.setState({ downloadLoading : true });

        const PostLink = posts[0].PostName;

        let FileName = "Mashinchi_" + postId.toString() + ".mp4";

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

        Actions.Comment({
            PostId : postId,
            CommentCount : this.state.CommentCount,
            onClose : (CommentCount) => {

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
