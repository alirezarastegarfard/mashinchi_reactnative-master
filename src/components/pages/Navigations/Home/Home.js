import React from 'react';
import BaseUi from "../../../basepage/BaseUi";
import {FlatList, View, Linking} from "react-native";
import {getRenderListEmpty, ScreenWidth} from "../../../publics/Function";
import CircleImageFlatList from "../../../customs/List/CircleImageFlatList";
import {backColorLight, height} from "../../../publics/Ui";
import HorizontalVideoFlatList from "../../../customs/List/HorizontalVideoFlatList";
import MyCarousel from "../../../customs/MyCarousel";
import ImageTextFlatList from "../../../customs/List/ImageTextFlatList";
import ShadowImageList from "../../../customs/List/ShadowImageList";
import UsuallImageBanner from "../../../customs/UsuallImageBanner";
import ShadowTwoImageList from "../../../customs/List/ShadowTwoImageList";
import MyHeader from "../../../customs/MyHeader";
import {connect} from 'react-redux'
import {BaseURL, FetchDataFromAPI, ImagesAddress, MediaAddress, MediaURL} from "../../../publics/DataBase";
import {Actions} from "react-native-router-flux";
import {NEWS, NEWSLIST, POST, POSTLIST, PROFILE, PROFILELIST, SITE, VIDEO, VIDEOLIST} from "../../../publics/Constant";

let BrandSelected = null;

class Home extends React.Component {

    constructor(props) {
        super(props);
        const BrandsBanner = {
            HomeTypeName: "BRANDS",
            Items: this.props.Brands
        };
        const HomeItems = this.props.HomeItems;
        this.state = {
            data: [BrandsBanner, ...HomeItems],
            refreshing: false,
            Loading: false
        };
    }


    CallBack() {
        this.setState({update: true});
    }

    render() {
        return (
            <BaseUi
                Loading={this.state.Loading}
                ViewStyle={{backgroundColor: backColorLight}}>
                <MyHeader
                    DisplayBadge={parseInt(this.props.User.CountNewMessage) > 0 ? true : false}
                    BadgeText={this.props.User.CountNewMessage}
                    buttonLeftShowing={false}
                    buttonRightOnPress={() => Actions.ChatHistory({CallBack: () => this.CallBack()})}
                    buttonRightImage={require('../../../../assets/images/icons/chat_black.png')}
                />
                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(!this.state.refreshing)}
                    refreshing={this.state.refreshing}
                />
            </BaseUi>
        );
    }

    renderItem({item}) {
        switch (item.HomeTypeName) {
            case "BRANDS" :
                return <CircleImageFlatList
                    data={item.Items}
                    onPress={(param) => {
                        Actions.BrandHomePage({
                            BrandId: param.BrandId,
                            BrandName: param.BrandName,
                            RenderItem: (itemData) => this.renderItem(itemData)
                        });
                        BrandSelected = param.BrandId;
                    }}
                />;
            case "BigBanner" :
                return <UsuallImageBanner
                    data={item.Items[0]}
                    onPress={(param) => this.getHomeActionData(param)}/>;
            case "HorizontalVideoList" :
                return <HorizontalVideoFlatList
                    data={item.Items}
                    onPress={(params) => Actions.Player({
                        MediaId: params.PostId,
                        VideoName: params.PostName,
                        MediaTitle: params.PostTitle,
                        Duration: params.Duration
                    })}
                    OnAllPress={() => {
                        Actions.ShowListData({
                            Title: item.Title,
                            MasterId: item.HomeItemId,
                            TypeId: VIDEOLIST
                        })
                    }}/>;
            case "SliderBanner" :
                return <MyCarousel
                    data={item.Items}
                    onPress={(param) => this.getHomeActionData(param)}
                />;
            case "HorizontalPostList" :
                return(
                    <ImageTextFlatList
                        heightViewRatio={30}
                        itemWidthViewRatio={15}
                        FromURL={MediaURL + MediaAddress}
                        rightTextHeader={item.Title}
                        data={item.Items}
                        onPress={(param) => Actions.MediaPost({PostId: param.PostId, isGetPost: true})}
                        OnAllPress={() => {
                            Actions.ShowListData({
                                Title: item.Title,
                                MasterId: item.HomeItemId,
                                TypeId: POSTLIST,
                                ALLType: 'PostList'
                            })
                        }}
                    />
                );

            case "SmallDarkTileList" :
                return <View style={{marginTop: 16,marginBottom: 16}}>
                <ShadowImageList
                    itemWidthViewRatio={80}
                    heightViewRatio={20}
                    data={item.Items}
                    onPress={(param) => this.getHomeActionData(param)}/>
                </View>;
            case "NewsList" :
                return(
                    <ImageTextFlatList
                        WithTitle={true}
                        data={item.Items}
                        heightImage={'55%'}
                        heightTextView={'45%'}
                        itemWidthViewRatio={105}
                        heightViewRatio={65}
                        rightTextHeader={"جدیدترین اطلاعیه ها"}
                        FromURL={BaseURL + ImagesAddress}
                        onPress={(param) => Actions.News({NewsData: param})}
                        OnAllPress={() => {
                            Actions.ShowListData({
                                Title: item.Title,
                                MasterId: item.HomeItemId,
                                TypeId: NEWSLIST
                            })
                        }}
                    />
                );

            case "PortraiteDarkTileList" :
                return <View style={{marginTop: 16,marginBottom:12}}>
                <ShadowImageList
                    itemWidthViewRatio={5}
                    heightViewRatio={200}
                    data={item.Items}
                    onPress={(param) => this.getHomeActionData(param)}/>
                </View>;
            case "TileList" :
                return this.renderTileList(item.Items);
            case "DoubleDarkTileList" :
                return<View style={{marginTop: 12}}>
                <ShadowTwoImageList
                    data={item.Items}
                    onPress={(param) => this.getHomeActionData(param)}/>
                </View>;
            case "ForumTile" :
                return <View style={{marginTop: 12}}>
                <UsuallImageBanner
                    data={item.Items[0]}
                    onPress={() => Actions.Forum({BrandSelected: BrandSelected})}/>
                </View>;
        }
    }

    renderTileList(data) {

        let Elements = [];
        const Width = Math.floor(ScreenWidth / data.length);
        data.forEach((items) => {

            Elements.push(
                <UsuallImageBanner
                    key={Math.random().toString()}
                    ImageStyle={{borderRadius: 10}}
                    viewStyle={{
                        height: height * .18,
                        paddingRight: 4, paddingLeft: 4, paddingTop: 4,
                        width: Width
                    }}
                    data={items}
                    onPress={(param) => this.getHomeActionData(param)}
                />
            );


        });

        return (

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: ScreenWidth
            }}>

                {Elements}

            </View>
        );
    }

    getHomeActionData(data) {

        if (data.TypeId === POSTLIST || data.TypeId === PROFILELIST ||
            data.TypeId === NEWSLIST || data.TypeId === VIDEOLIST) {
            Actions.ShowListData({
                Title: data.ItemTitle,
                HomeItemDetailId: data.HomeItemDetailId,
                TypeId: data.TypeId
            });
            return;
        }

        this.setState({Loading: true});

        const Params = JSON.stringify({
            UserId: this.props.User.ID,
            HomeItemDetailId: data.HomeItemDetailId
        });

        FetchDataFromAPI("getHomeAction", Params, (response) => {

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            this.showHomeActionResponse(data.TypeId, response.Response);

        }).done(() => this.setState({Loading: false}));

    }

    showHomeActionResponse(TypeId, ResponseData) {

        switch (TypeId) {

            case POST    :
                Actions.MediaPost({Post: ResponseData});
                break;
            case NEWS    :
                Actions.News({NewsData: ResponseData});
                break;
            case VIDEO   :
                Actions.Player({
                    MediaId: ResponseData.PostId,
                    VideoName: ResponseData.PostName,
                    MediaTitle: ResponseData.PostTitle,
                    Duration: ResponseData.Duration
                });
                break;
            case PROFILE :
                Actions.ShowProfile({UserId: ResponseData.UserId});
                break;
            case SITE    :
                this.openSiteURL(ResponseData.URL).done();
                break;
        }


    }

    async openSiteURL(URL) {
        const Status = await Linking.canOpenURL(URL);
        if (Status)
            Linking.openURL(URL);
    }

}

const mapStateToProps = (states) => {
    return {
        User: states.User,
        Brands: states.Brands,
        HomeItems: states.HomeItems
    };
};

export default connect(mapStateToProps)(Home);