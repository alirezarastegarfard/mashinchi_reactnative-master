import React from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import propType from 'prop-types';
import {connect} from "react-redux";
import {FetchDataFromAPI} from "../publics/DataBase";
import {getCurrentLocation, getRenderListEmpty, PageCount} from "../publics/Function";
import {AccentColor, backColor} from "../publics/Ui";
import InstaBanner from "../customs/InstaBanner";
import {NEWSLIST, POSTLIST, PROFILELIST, VIDEOLIST} from "../publics/Constant";
import NewsList from "../customs/List/NewsList";
import DescVideoList from "../customs/List/DescVideoList";
import DescBadgeImageList from "../customs/List/DescBadgeImageList";
import LongVideoBanner from "../customs/LongVideoBanner";

class ShowListData extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data : [],
            page : 1,
            loading : false,
            refreshing : false,
            ListLoading : false,
            noData : false,
            EndList : false
        };

        this.viewabilityConfig = {
            minimumViewTime : 500,
            viewAreaCoveragePercentThreshold: 70
        };
        this.MainList = null;
    }

    async getDataFromAPI(){

        const CurrLocation = await getCurrentLocation();

        const Parameter = JSON.stringify({
            UserId           : this.props.User.ID,
            HomeItemDetailId : this.props.HomeItemDetailId,
            MasterId         : this.props.MasterId,
            page             : this.state.page,
            AllType          : this.props.ALLType,
            Latitude         : CurrLocation.latitude,
            Longitude        : CurrLocation.longitude
        });



        FetchDataFromAPI("getListDataWithParams",Parameter,(response) => {

            if (response.Response === null) {
                this.setState({refreshing : false,ListLoading : false});
                return;
            }

            if (this.state.page > 1 && response.Response.length <= 0){
                this.setState({EndList : true});
                return;
            }

            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false
                    }
                });
            }else
                this.setState({refreshing : false,ListLoading : false});


        }).done(() => this.setState({refreshing : false,ListLoading : false}));

    }

    componentWillMount(): void {
        this.getDataFromAPI();
    }

    render(){

        return(

            <BaseUi
                ViewStyle={{ backgroundColor : backColor }}
                Loading={this.state.loading}>

                <MyHeader
                      text={this.props.Title}
                      showText={true}
                />

                {this.chooseFlatList(this.props.TypeId)}

            </BaseUi>

        );
    }

    chooseFlatList(TypeId){

        if (TypeId === POSTLIST ){
            return(
                <FlatList
                    key={1}
                    ref={(ref) => {
                        this.MainList = ref;
                    }}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    initialNumToRender={7}
                    renderItem={(item) => this.renderItems(item, item.index)}
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
        }else if (TypeId === NEWSLIST){
            return(
                <FlatList
                    key={2}
                    ref={(ref) => {
                        this.MainList = ref;
                    }}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderNewsItems(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(!this.state.refreshing)}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    onEndReachedThreshold={.5}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                />
            );
        }else if (TypeId === VIDEOLIST){
            return(
                <FlatList
                    key={3}
                    ref={(ref) => {
                        this.MainList = ref;
                    }}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderMediaItems(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(!this.state.refreshing)}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    onEndReachedThreshold={.5}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                />
            );
        }else if (TypeId === PROFILELIST){
            return(
                <FlatList
                    key={3}
                    ref={(ref) => {
                        this.MainList = ref;
                    }}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderProfileItems(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(!this.state.refreshing)}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    onEndReachedThreshold={.5}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
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

                if (Banner && Banner.playThisVideo)
                    Banner.playThisVideo(item.isViewable);

            }
        });

        viewableItems.forEach(item => {

            if (item.item.PostId > 0 && item.isViewable) {
                let Banner = this.ListItemRef[`REF-LIST${item.item.PostId}`];
                if (Banner && Banner.playThisVideo !== null)
                    Banner.playThisVideo(item.isViewable);

            }
        });
    };

    handleRefresh(){
        this.setState({page : 1 , refreshing : true , data : []}, () =>
            this.getDataFromAPI());
    };

    onEndPage(){

        if (this.state.data.length >= PageCount){
            this.setState({page : this.state.page + 1 , ListLoading:true},() =>
                this.getDataFromAPI());
        }

    }

    getRenderFooter(){

        if (this.state.data.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    renderItems({item}, index) {

        console.log(item)

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
        }else {
            return(
                <LongVideoBanner
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

    }

    renderNewsItems({item}) {

        return(
            <NewsList
                NewsData={item}
            />
        );
    }

    renderMediaItems({item}) {
        return (

            <DescVideoList
                MediaId={item.PostId}
                MediaTitle={item.PostTitle}
                MediaDateTime={item.PersianDate}
                ViewCount={item.ViewCount}
                ThumbnailName={item.ThumbnailName}
                VideoName={item.PostName}
                UserName={item.UserName}
                Duration={item.Duration}
            />

        );
    }

    renderProfileItems({item}) {

        return(
            <DescBadgeImageList
                UserId={item.ID}
                ProfileName={item.FullName}
                CityName={item.CityName}
                AreaName={item.AreaName}
                Distance={item.Distance}
                PhotoFileName={item.PhotoFileName}
                Rate={item.Rate}
                showDesc={false}
                showText={false}
            />
        );

    }
}

ShowListData.propTypes = {
    Title            : propType.string,
    HomeItemDetailId : propType.string,
    TypeId           : propType.string,
    MasterId         : propType.string,
    ALLType          : propType.string
};

ShowListData.defaultProps = {
    HomeItemDetailId : null,
    MasterId : null,
    ALLType : null
};

const mapStateToProps = (states) => {

    return { User : states.User }

};

export default connect(mapStateToProps)(ShowListData);

