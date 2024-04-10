import React, {Component} from 'react';
import {
    View, FlatList, TouchableOpacity, StyleSheet,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
    AccentColor, AppFont,
    backColor,
    SkyBlue,
    GreyColor, PrimaryTextColor,
    SecondaryTextColor,
    width, Small, VerySmall, Medium, Large, BackColorDark, MiniSize
} from "../../../publics/Ui";
import MyText from "../../../customs/MyText";
import TouchableScale from "react-native-touchable-scale";
import BaseUi from "../../../basepage/BaseUi";
import {connect} from 'react-redux';
import {setUser} from "../../../../redux/actions";
import {Actions} from 'react-native-router-flux';
import {BaseURL, FetchDataFromAPI, ImagesAddress} from "../../../publics/DataBase";
import {
    getCurrentLocation,
    getProfilePhoto,
    HeaderHeight,
    PageCount,
    pickSingle,
    pickSingleWithCamera,
    ScreenWidth, SendUserPost
} from "../../../publics/Function";
import MyTabBar from "../../../customs/MyTabBar";
import PostSquare from "../../../customs/PostSquare";
import {
    CAMERA,
    CONVERT_BUSINESS, GALLERY, POSTS_PAGE_NAME,
    REMOVE, REVIEW_PAGE_NAME, SAVED_POSTS_PAGE_NAME, SEND_POST
} from "../../../publics/Constant";
import DescBadgeImageList from "../../../customs/List/DescBadgeImageList";
import {FloatingAction} from "../../../../../custom_package/react-native-floating-action";
import propTypes from "prop-types";
import UserPostSquare from "../../../customs/UserPostSquare";
import FastImage from "react-native-fast-image";
import {setProfilePostSync, setProfileUpdater} from "../../../publics/FuncLibs";


const actions = [


    {
        text: 'ارسال پست',
        icon: require('./../../../../assets/images/icons/add_photo.png'),
        name: SEND_POST,
        position: 3,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    },
    {
        text: 'تبدیل به کسب کار',
        icon: require('./../../../../assets/images/icons/go_to_business.png'),
        name: CONVERT_BUSINESS,
        position: 4,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    }
];

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            enableScrollViewScroll: true,
            selectedPage: POSTS_PAGE_NAME,
            data: [],
            profileData: this.props.profileData === null ? this.props.User : this.props.profileData,
            refreshing: false,
            ListLoading: false,
            EndList: false,
            page: 1,
            noData: false,
            opacity: 0,
            scrollEnabled: false,
            titleOpacity: 0,
            image: null,
            Loading: false,
            Visible: true
        };

        setProfileUpdater( () => this.updateData() );
        setProfilePostSync( (postId) => this.removeSavedPost(postId) );

    }

    componentWillMount(): void {
        this.fetchDataAPI();
    }

    fetchDataAPI() {

        switch (this.state.selectedPage) {
            case SAVED_POSTS_PAGE_NAME :
                this.fetchSavedPostData();
                break;
            case REVIEW_PAGE_NAME      :
                this.fetchReviewData().done();
                break;
            case POSTS_PAGE_NAME       :
                this.fetchUserPostData();
                break;
        }

    }

    fetchSavedPostData() {

        let Parameter = JSON.stringify({
            UserId: this.state.profileData.ID,
            page: this.state.page,
            SavePosts: true
        });

        FetchDataFromAPI("getPosts", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }

            if (this.state.page > 1 && response.Response.length <= 0) {
                this.setState({EndList: true});
                return;
            }else if (this.state.page === 1 && response.Response.length <= 0){
                this.setState({EndList: true ,data : [] , noData : true });
                return;
            }

            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false,
                        EndList: false
                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});

        }).done(() => this.setState({refreshing: false, ListLoading: false, noData: this.state.data.length <= 0}))

    }

    async fetchReviewData() {

        const CurrLocation = await getCurrentLocation();

        let Parameter = JSON.stringify({
            UserId: this.state.profileData.ID,
            Page: this.state.page,
            IsBusiness: false,
            Latitude: CurrLocation.latitude,
            Longitude: CurrLocation.longitude
        });

        FetchDataFromAPI("getUserReviews", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }

            if (this.state.page > 1 && response.Response.length <= 0) {
                this.setState({EndList: true});
                return;
            }else if (this.state.page === 1 && response.Response.length <= 0){
                this.setState({EndList: true , noData : true , data : []});
                return;
            }

            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false,
                        EndList: false
                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});

        }).done(() => this.setState({refreshing: false, ListLoading: false, noData: this.state.data.length <= 0}));

    }

    fetchUserPostData() {

        let Parameter = JSON.stringify({
            UserId: this.state.profileData.ID,
            Page: this.state.page,
            ShowUserId: this.props.User.ID
        });

        FetchDataFromAPI("getUsersPosts", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }

            if (this.state.page > 1 && response.Response.length <= 0) {
                this.setState({EndList: true});
                return;
            }

            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false,
                        EndList: false
                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});

        }).done(() => this.setState({refreshing: false, ListLoading: false, noData: this.state.data.length <= 0}));
    }

    HideFabButton() {

        if (this.state.Visible)
            this.setState({Visible: false});

    }

    ShowFabButton() {

        clearTimeout(this.showTimeOut);

        this.showTimeOut = setTimeout(() => {

            if (!this.state.Visible)
                this.setState({Visible: true});

            clearTimeout(this.showTimeOut);

        }, 800);

    }

    updateData(){

        switch (this.state.selectedPage) {
            case SAVED_POSTS_PAGE_NAME : this.setState({ ListLoading : true , page : 1 } , () => this.fetchSavedPostData());break;
            case REVIEW_PAGE_NAME : this.setState({ ListLoading : true , page : 1 } , () => this.fetchReviewData());break;
        }
    }

    render() {

        return (
            <BaseUi
                Loading={this.state.Loading}
                style={{flex: 1}}>

                <View style={{
                    width: ScreenWidth,
                    height: HeaderHeight,
                    alignItems: 'center',
                    flexDirection: 'row',
                    backgroundColor: backColor,
                    borderBottomWidth: .6,
                    borderColor: BackColorDark,
                }}>
                    <View style={{width: 50}}>

                    </View>
                    <View style={{
                        width: width - 100,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <MyText
                            componentStyles={{
                                color: PrimaryTextColor,
                                fontSize: Medium
                            }}
                            text={this.state.profileData.UserName}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => Actions.EditProfile({
                            callBack: (UserData) => {

                                let ProfileData = this.state.profileData;

                                ProfileData.FullName = UserData.FullName;
                                ProfileData.UserName = UserData.UserName;
                                ProfileData.Status = UserData.Status;
                                ProfileData.CityName = UserData.CityName;
                                ProfileData.CityId = UserData.CityId;
                                ProfileData.Email = UserData.Email;

                                this.setState({profileData: ProfileData});

                            }
                        })}

                        style={{
                            display: this.props.profileData === null ? 'flex' : 'none',
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                        <FastImage
                            source={require('../../../../assets/images/icons/EditProfile.png')}
                            style={[{width: 25, height: 25}]}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>
                </View>

                {this.renderHeaderButton()}

                {this.renderChooseFlatList()}

                {this.renderFloatingButton()}

            </BaseUi>
        );
    }

    renderChooseFlatList() {

        if (this.state.selectedPage === SAVED_POSTS_PAGE_NAME || this.state.selectedPage === POSTS_PAGE_NAME) {
            return (

                <FlatList
                    ref={(list) => this.flatList = list}
                    key={1}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderFlatListItems(item)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    refreshing={this.state.refreshing}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={1}
                    ListHeaderComponent={() => this.renderForeground()}
                    /*                    onScrollEndDrag={() => this.ShowFabButton()}
                                        onScrollBeginDrag={() => this.HideFabButton()}*/
                />

            );
        } else if (this.state.selectedPage === REVIEW_PAGE_NAME) {
            return (

                <FlatList
                    ref={(list) => this.flatList = list}
                    key={2}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderFlatListItems(item)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    refreshing={this.state.refreshing}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={1}
                    removeClippedSubviews
                    ListHeaderComponent={() => this.renderForeground()}
                    /*                    onScrollEndDrag={() => this.ShowFabButton()}
                                        onScrollBeginDrag={() => this.HideFabButton()}*/
                />

            );
        }


    }

    renderFlatListItems(item) {

        if (this.state.selectedPage === SAVED_POSTS_PAGE_NAME)
            return this.renderSavePostItem(item);
        else if (this.state.selectedPage === REVIEW_PAGE_NAME)
            return this.renderReviewItem(item);
        else if (this.state.selectedPage === POSTS_PAGE_NAME)
            return this.renderUserPostItem(item);

    }

    renderForeground() {

        let ProfileTabs = [

            {
                tabName: SAVED_POSTS_PAGE_NAME,
                onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                text: "نشان شده ها"
            },
            {
                tabName: REVIEW_PAGE_NAME,
                onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                text: "نقد و بررسی ها",
                badge: this.state.profileData.ReviewCount
            },
            {
                tabName: POSTS_PAGE_NAME,
                onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                text: "پست ها",
                badge: this.state.profileData.PostCount
            }
        ];

        if (this.props.isReadOnly) {

            ProfileTabs = [

                {
                    tabName: REVIEW_PAGE_NAME,
                    onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                    text: "نقد و بررسی ها",
                    badge: this.state.profileData.ReviewCount
                },
                {
                    tabName: POSTS_PAGE_NAME,
                    onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                    text: "پست ها",
                    badge: this.state.profileData.PostCount
                }

            ];

        }

        return (
            <View style={{
                width: ScreenWidth,
            }}>

                <View style={{
                    height: 140,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            if (this.state.profileData.ID === this.props.User.ID)
                                Actions.ChangePictureDialog({callback: (clicked) => this.ChangeProfileImage(clicked)});

                        }}
                        style={{
                            width: 130,
                            height: 130,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 120, width: 120, borderWidth: 3,
                            borderColor: GreyColor,
                            borderRadius: 60
                        }}>
                            <FastImage
                                style={{height: 110, width: 110, borderRadius: 55}}
                                source={this.renderImageProfile()}/>

                        </View>

                        {this.renderEditImageButton()}
                    </TouchableOpacity>

                </View>

                <View style={{
                    alignItems: 'center',
                }}>
                    <View>
                        <View
                            style={[styles.textStyles]}>
                            <MyText
                                ref={(text) => this.Mytext = text}
                                text={this.state.profileData.FullName}
                                componentStyles={{
                                    fontSize: Small
                                }}/>
                        </View>

                        <View style={[styles.textStyles, {flexDirection: 'row'}]}>
                            <MyText
                                componentStyles={{
                                    fontSize: VerySmall,
                                    color: GreyColor
                                }}
                                text={this.state.profileData.CityName}/>
                            <FastImage
                                style={{height: 25, width: 25}}
                                source={require('../../../../assets/images/icons/placeholder.png')}
                            />

                        </View>
                        {this.renderStatus()}

                    </View>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={styles.tagViewLeft}>
                        <TouchableScale
                            activeScale={0.95}
                            style={styles.bagView}
                            onPress={() => Actions.AwardView({User: this.state.profileData})}>
                            <FastImage
                                resizeMode='contain'
                                style={{height: '80%', width: '35%'}}
                                source={{uri: BaseURL + ImagesAddress + this.state.profileData.LevelImage}}
                            />
                            <MyText
                                text={this.state.profileData.Level}
                                componentStyles={{fontSize: VerySmall, color: AccentColor}}/>
                        </TouchableScale>
                    </View>

                    <View style={[styles.tagViewRight]}>
                        <TouchableScale
                            activeScale={0.95}
                            style={[styles.bagView, {width: 120, marginRight: 10, justifyContent: 'center'}]}
                            onPress={() => Actions.UserWasThere({UserId: this.state.profileData.ID})}>
                            <MyText
                                text={`آنجا بوده (${this.state.profileData.PlacesCount})`}
                                componentStyles={{fontSize: VerySmall, color: AccentColor}}/>
                            <FastImage
                                resizeMode='contain'
                                style={{height: '80%', width: '33%', marginLeft: '2%'}}
                                source={require('../../../../assets/images/icons/tag.png')}
                            />
                        </TouchableScale>
                    </View>

                </View>

                <MyTabBar
                    defaultTab={POSTS_PAGE_NAME}
                    selectedTab={this.state.selectedPage}
                    tabs={ProfileTabs}
                />

            </View>
        );
    }

    onChangeTabBar(selectedPage) {

        this.setState({
            selectedPage,
            page: 1,
            noData: false,
            refreshing: false,
            ListLoading: false,
            data: []
        }, () => this.fetchDataAPI());
    }

    renderEmptyList() {

        if (!this.state.noData && !this.state.refreshing) {
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        } else
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>

                    <MyText
                        componentStyles={{color: SecondaryTextColor, fontSize: Small}}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>

                </View>
            );

    }

    handleRefresh() {
        this.setState({page: 1, refreshing: true, data: []}, () =>
            this.fetchDataAPI());
    };

    onEndPage() {
        if (this.state.EndList)
            return;

        if (this.state.data.length >= PageCount) {
            this.setState({page: this.state.page + 1, ListLoading: true}, () =>
                this.fetchDataAPI());
        }

    }

    getRenderFooter() {

        if (this.state.data.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    renderSavePostItem({item}) {

        return (
            <PostSquare
                Post={item}
            />
        );

    }

    removeSavedPost(PostId){

        let data = this.state.data;
        const BreakException = {};
        try {

            data.forEach((item, Index) => {

                if (item.PostId === PostId) {
                    data.splice(Index, 1);
                    this.setState({data , noData : data.length <= 0});
                    throw BreakException;
                }

            });

        }catch (e) {
        }
    }

    renderReviewItem(dataItem) {

        const {item} = dataItem;

        return (
            <DescBadgeImageList
                Id={item.ReviewId}
                Index={dataItem.index}
                UserId={item.ID}
                ProfileName={item.FullName}
                CityName={item.CityName}
                AreaName={item.AreaName}
                Distance={item.Distance}
                DescDateTime={item.ReviewDateTime}
                Description={item.ReviewDescription}
                PhotoFileName={item.PhotoFileName}
                showDesc
                showText
                ShowOption={!this.props.isReadOnly}
                onReviewSave={(newData, index) => this.EditReviewData(newData, index)}
                onRemoveClick={(index) => this.RemoveReviewData(index)}
            />
        );
    }

    signOutUser() {

        Actions.QuestionDialog({
            Message: "آیا برای خروج از حساب کاربری اطمینان دارید؟",
            onConfirm: () => {

                AsyncStorage.removeItem("Token");
                this.props.setUser(null);
                Actions.reset("auth");

            }

        });
    }

    renderHeaderButton() {

        if (this.props.showOnNavigation) {

            return (

                <TouchableOpacity
                    style={{
                        width: 70,
                        height: HeaderHeight,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        position: 'absolute',
                        zIndex: 1,
                        left: 0,
                        top: 0,
                    }}
                    onPress={() => this.signOutUser()}>

                    <FastImage
                        source={require('../../../../assets/images/icons/sign_out.png')}
                        style={{width: '60%', height: '50%'}}
                        resizeMode={"contain"}
                    />

                </TouchableOpacity>

            );

        } else {

            return (

                <TouchableOpacity
                    style={{
                        width: 70,
                        height: HeaderHeight,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        position: 'absolute',
                        zIndex: 1,
                        right: 0,
                        top: 0
                    }}
                    onPress={() => Actions.pop()}>

                    <FastImage
                        source={require('../../../../assets/images/icons/RightArrow.png')}
                        style={{width: '50%', height: '50%'}}
                        resizeMode={"contain"}
                    />

                </TouchableOpacity>

            );

        }

    }

    selectedItem(itemName) {

        switch (itemName) {


            case SEND_POST : {
                Actions.CameraDialog({callback: (clicked) => SendUserPost(clicked, (postData) => this.setUserPostData(postData))});
                break;
            }
            case CONVERT_BUSINESS : {
                Actions.SwitchToBusiness();
                break;
            }

        }

    }

    ChangeProfileImage(clicked) {

        switch (clicked) {

            case CAMERA : {
                pickSingleWithCamera(true, (image) => {
                    this.setState({
                        image: {
                            uri: `data:${image.mime};base64,` + image.data,
                            width: image.width,
                            height: image.height
                        }
                    });

                    this.changeProfilePicture(image.data);

                });
                break;
            }
            case GALLERY : {
                pickSingle(true, (image) => {
                    this.setState({
                        image: {
                            uri: `data:${image.mime};base64,` + image.data,
                            width: image.width,
                            height: image.height
                        },
                    });

                    this.changeProfilePicture(image.data);

                },false,'photo');
                break;
            }
            case REMOVE : {
                this.changeProfilePicture(null);
                break;
            }
        }

    }

    renderImageProfile() {

        if (this.state.image !== null)
            return this.state.image;
        else
            return {uri: getProfilePhoto(this.state.profileData.PhotoFileName)}

    }

    changeProfilePicture(imageData) {

        this.setState({Loading: true});

        const Parameter = JSON.stringify({
            UserId: this.props.User.ID,
            ImageBase: imageData
        });


        FetchDataFromAPI("setProfileImage", Parameter, (response) => {

            if (response.Success) {

                const FileName = response.Response.FileName;

                const UserData = this.state.profileData;
                UserData.PhotoFileName = FileName;
                this.props.setUser(UserData);

                this.setState({ profileData : UserData });

                if (imageData === null)
                    this.setState({image: null});

            } else
                Actions.ExceptionDialog({Message: response.Message});

        }).done(() => this.setState({Loading: false}));

    }

    setUserPostData(postData) {

        if (this.state.selectedPage !== POSTS_PAGE_NAME)
            this.onChangeTabBar(POSTS_PAGE_NAME);
        else {

            this.setState((preState) => {

                let profileData = preState.profileData;

                profileData.PostCount = Number.parseInt(profileData.PostCount) + 1;

                return {
                    data: [postData, ...preState.data],
                    profileData: profileData
                }

            });
        }

    }

    renderUserPostItem(itemData) {

        const {item} = itemData;

        return (
            <UserPostSquare
                PostIndex={itemData.index}
                Post={item}
                onChangeData={(data) => {

                    let PostData = this.state.data;

                    PostData[itemData.index] = data;

                    this.setState({data: PostData});

                }}
                onRemovePost={(Index) => this.removePostFromList(Index)}
            />);
    }

    removePostFromList(Index) {

        let PostData = this.state.data;
        let profileData = this.state.profileData;

        PostData.splice(Index, 1);
        profileData.PostCount = Number.parseInt(profileData.PostCount) - 1;

        this.setState({data: PostData, profileData: profileData, noData: PostData.length <= 0});

    }

    renderFloatingButton() {

        if (this.props.isReadOnly)
            return null;

        return (

            <FloatingAction
                visible={this.state.Visible}
                showBackground={true}
                position='left'
                actions={actions}
                onPressItem={(itemName) => this.selectedItem(itemName)}
                textStyle={{fontSize: MiniSize}}
            />

        );

    }

    RemoveReviewData(index) {

        let ReviewData = this.state.data;

        ReviewData.splice(index, 1);

        this.setState({data: ReviewData , noData : ReviewData.length <= 0});
    }

    EditReviewData(newData, index) {

        let ReviewData = this.state.data;

        ReviewData[index].ReviewDescription = newData.ReviewData;

        this.setState({data: ReviewData});

    }

    renderStatus() {
        if (this.state.profileData.Status == '')
            return null;
        else
            return <View
                style={styles.textStyles}>
                <MyText text={this.state.profileData.Status} componentStyles={{fontSize: Small}}/>
            </View>
    }

    renderEditImageButton() {

        if (this.state.profileData.ID !== this.props.User.ID)
            return null;

        return(

            <View style={{
                borderWidth: 2,
                borderColor: GreyColor,
                marginLeft: -60,
                marginTop: -28,
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: 'white',
                alignItems:'center',
                justifyContent:'center',
                zIndex: 1}}>
                <FastImage
                    style={{
                        height: 18,
                        width: 18,
                    }}
                    source={require('../../../../assets/images/icons/EditImage.png')}
                    resizeMode={'contain'}
                />
            </View>

        );

    }
}

const ROW_HEIGHT = 60;

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tagViewLeft: {
        width: '50%', height: 40,
        justifyContent: 'center'
    },
    tagViewRight: {
        width: '50%', height: 40,
        justifyContent: 'center', alignItems: 'flex-end',

    },
    bagView: {
        width: 105,
        height: '85%',
        marginLeft: 10,
        backgroundColor: SkyBlue,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    container: {

        backgroundColor: 'white'
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: Large
    },
    textStyles: {
        height: 35, margin: 2, justifyContent: 'center', alignItems: 'center'
    },
    tabbar: {
        backgroundColor: backColor,
    },
    tab: {
        width: width / 3,
    },
    indicator: {
        backgroundColor: AccentColor,
    },
    label: {
        fontWeight: '400',
        color: SecondaryTextColor,
        fontFamily: AppFont
    }
});

Profile.propsTypes = {
    isReadOnly: propTypes.bool,
    profileData: propTypes.object,
    showOnNavigation: propTypes.bool
};

Profile.defaultProps = {
    isReadOnly: false,
    showOnNavigation: true,
    profileData: null
};

const mapDispatchToProps = (dispatch) => {

    return {

        setUser: (user) => {
            dispatch(setUser(user))
        }

    }

};

const mapStateToProps = (states) => {

    return {User: states.User}

};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);