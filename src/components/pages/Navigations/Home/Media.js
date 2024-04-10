import React from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
} from 'react-native';

import styles from '../../../publics/homeStyle';
import {AccentColor, backColor} from "../../../publics/Ui";
import {getRenderListEmpty, PageCount,
    setHomeBannerComponent, ShowProfileName } from '../../../publics/Function';
import {FetchDataFromAPI } from '../../../publics/DataBase';
import {connect} from 'react-redux';
import PostSquare from "../../../customs/PostSquare";
import InstaBanner from "../../../customs/InstaBanner";
import MyHeader from "../../../customs/MyHeader";
import ListViewImage from '../../../../assets/images/icons/RedListView.png';
import TileViewImage from '../../../../assets/images/icons/TileView.png';
import {setHomeUpdater, setSyncBookmarkPost, setSyncCommentCount, setSyncLikePost} from "../../../publics/FuncLibs";
import LongVideoBanner from "../../../customs/LongVideoBanner";

const SLIDER_1_FIRST_ITEM = 1;

class Home extends React.PureComponent{

    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            dataHome :[],
            page     : 1,
            refreshing : false,
            ListLoading : false,
            profileTypeId : 0,
            showTypeList  : 'LIST'
        };

        this.viewabilityConfig = {
            minimumViewTime : 500,
            viewAreaCoveragePercentThreshold: 70
        };

        this.MainList = null;

        setHomeUpdater( () => this.scrollToTopList() );
        setSyncBookmarkPost((PostId , Status) => this.SyncBookmark(PostId , Status));
        setSyncLikePost( (PostId , Status , LikeCount) => this.SyncLikePost(PostId , Status , LikeCount) );
        setSyncCommentCount( (PostId , CommentCount) => this.SyncCommentCount(PostId , CommentCount) );
    }

    componentWillMount(){
        this.fetchDataFromAPI();
    }

    changeViewStyle(){

        this.setState( (preState) => {

            if (preState.showTypeList === 'LIST')
                return {showTypeList: 'TILE'};
            else
                return {showTypeList: 'LIST'};
        });

    }

    scrollToTopList(){

        if (this.MainList === null)
            return;

        this.MainList.scrollToOffset({x: 0, y: 0, animated: true});
    }

    fetchDataFromAPI(){

        let Parameter = JSON.stringify({
            UserId      : this.props.User.ID,
            page : this.state.page
        });

        FetchDataFromAPI("getPosts",Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing : false,ListLoading : false});
                return;
            }

            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        dataHome: this.state.page === 1 ? response.Response : [...preState.dataHome, ...response.Response],
                        refreshing: false
                    }
                });
            }else
                this.setState({refreshing : false,ListLoading : false});

        }).done( () => this.setState({refreshing : false,ListLoading : false}) )

    }

    render() {

        return (

            <View style={styles.container}>

                <MyHeader
                    buttonRightShowing={false}
                    buttonLeftShowing={true}
                    buttonLeftStyle={{
                        width : 20,
                        height : 20
                    }}
                    buttonLeftImage={this.state.showTypeList === "LIST" ? TileViewImage : ListViewImage}
                    buttonLeftOnPress={this.changeViewStyle.bind(this)}
                />

                <View
                    style={styles.scrollview}>
                    <View style={{backgroundColor: backColor}}>

                        {this.renderListViewType()}

                    </View>
                </View>
            </View>

        );
    }

    renderListViewType(){

        if (this.state.showTypeList === 'LIST') {

            return (
                <FlatList
                    key={1}
                    ref={(ref) => {
                        this.MainList = ref;
                    }}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.dataHome}
                    initialNumToRender={7}
                    renderItem={(item) => this.renderItemHome(item, item.index)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(!this.state.refreshing)}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    onEndReachedThreshold={.5}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    viewabilityConfig={this.viewabilityConfig}
                    onViewableItemsChanged={this._onViewableItemsChanged}
                    removeClippedSubviews
                />
            );
        }else {

            return (

                <FlatList
                    key={2}
                    ref={(ref) => {
                        this.MainList = ref;
                    }}
                    style={{backgroundColor: 'transparent' , marginLeft : '1.2%'}}
                    data={this.state.dataHome}
                    renderItem={(item) => this.renderItemTileView(item)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    refreshing={this.state.refreshing}
                    keyExtractor={(item,index) => index.toString()}
                    ListEmptyComponent={() => this.renderEmptyList() }
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={1}
                    removeClippedSubviews
                />

            );


        }
    }

    _onViewableItemsChanged = (props) => {
        const changed = props.changed;
        const viewableItems = props.viewableItems;

        changed.forEach(item => {
            if (item.item.PostId > 0 && !item.isViewable) {

                let Banner = this.ListItemRef[`REF-LIST${item.item.PostId}`];

                if (Banner && Banner.playThisVideo !== null)
                    Banner.playThisVideo(item.isViewable);

            }
        });

        viewableItems.forEach(item => {

            if (item.item.PostId > 0 && item.isViewable) {
                let Banner = this.ListItemRef[`REF-LIST${item.item.PostId}`];

                if (Banner !== undefined)
                    setHomeBannerComponent(Banner);
                else
                    setHomeBannerComponent(null);

                if (Banner && Banner.playThisVideo !== null)
                    Banner.playThisVideo(item.isViewable);

            }
        });
    };

    handleRefresh(){
        this.setState({page : 1 , refreshing : true , dataHome : []}, () =>
            this.fetchDataFromAPI());
    };

    onEndPage(){

        if (this.state.dataHome.length >= PageCount){
            this.setState({page : this.state.page + 1 , ListLoading:true},() =>
                this.fetchDataFromAPI());
        }

    }

    getRenderFooter(){

        if (this.state.dataHome.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    renderItemHome({item}, index) {

        if (item.GetPostTypeId === "1") {
            return (
                <InstaBanner
                    ref={(ref) => this.ListItemRef = {...this.ListItemRef, [`REF-LIST${item.PostId}`]: ref}}
                    profileId={item.ProfileId}
                    postId={item.PostId}
                    UserName={item.UserName}
                    fullName={item.FullName}
                    persianDate={item.PersianDate}
                    postCaption={item.PostCaption}
                    posts={item.Posts}
                    ProfilePhotoName={item.ProfilePhotoName}
                    keyIndex={index}
                    liked={item.Liked === "1"}
                    saved={item.Saved === "1"}
                    UserId={this.props.User.ID}
                    shortCode={item.ShortCode}
                    postLikes={item.PostLikes}
                    isFollow={item.IsFollow}
                    CommentCount={item.CommentCount}
                />
            );
        }else
            return(
                <LongVideoBanner
                    ref={(ref) => this.ListItemRef = {...this.ListItemRef, [`REF-LIST${item.PostId}`]: ref}}
                    profileId={item.ProfileId}
                    postId={item.PostId}
                    UserName={item.UserName}
                    fullName={item.FullName}
                    persianDate={item.PersianDate}
                    postCaption={item.PostCaption}
                    posts={item.Posts}
                    ProfilePhotoName={item.ProfilePhotoName}
                    keyIndex={index}
                    liked={item.Liked === "1"}
                    saved={item.Saved === "1"}
                    UserId={this.props.User.ID}
                    shortCode={item.ShortCode}
                    postLikes={item.PostLikes}
                    isFollow={item.IsFollow}
                    CommentCount={item.CommentCount}
                    ThumbnailName={item.ThumbnailName}
                    PostTitle={item.PostTitle}
                    Duration={item.Duration}
                />
            );

    }

    changeProfileTypesPost(TypeId){

        if (TypeId === this.state.profileTypeId)
            return;

        if (this.state.ListLoading)
            return;

        this.ListItemRef = [];

        this.setState({ dataHome : [] , profileTypeId : TypeId , page : 1 , ListLoading : true } , () =>  this.fetchDataFromAPI());
    }

    renderItemTileView = ({item}) => {

        return <PostSquare Post={item} ShowName={ShowProfileName}/>;

    };

    SyncBookmark(PostId,Status){

        const Banner = this.ListItemRef[`REF-LIST${PostId}`];

        if (Banner !== undefined && Banner !== null)
            Banner.setBookmarkState(Status);

    }

    SyncLikePost(PostId,Status,LikeCount){

        const Banner = this.ListItemRef[`REF-LIST${PostId}`];

        if (Banner !== undefined && Banner !== null)
            Banner.setLikeState(Status,LikeCount);

    }

    SyncCommentCount(PostId,CommentCount){

        const Banner = this.ListItemRef[`REF-LIST${PostId}`];

        if (Banner !== undefined && Banner !== null)
            Banner.setCommentCount(CommentCount);

    }

}

const mapStateToProps = (states) => {

    return {
        User : states.User,
    }

};

export default connect(mapStateToProps)(Home);