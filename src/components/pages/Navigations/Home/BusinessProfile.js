import React, {Component} from "react";
import BaseUi from "../../../basepage/BaseUi";
import {
    ActivityIndicator,
    FlatList,
    Image,
    TouchableOpacity,
    View
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {
    getProfilePhoto,
    HeaderHeight, PageCount, pickFileGallery,
    pickSingle,
    pickSingleWithCamera,
    ScreenHeight,
    ScreenWidth, SendUserPost
} from "../../../publics/Function";
import MyTabBar from "../../../customs/MyTabBar";
import {FloatingAction} from "../../../../../custom_package/react-native-floating-action";
import Information from "./BusinessTab/Information";
import {connect} from "react-redux";
import {FetchDataFromAPI} from "../../../publics/DataBase";
import propTypes from "prop-types";
import {
    BUSINESS_PROFILE_INFORMATION,
    BUSINESS_PROFILE_POSTS,
    BUSINESS_PROFILE_REVIEW,
    CAMERA,
    CHANGE_PROFILE_IMAGE,
    GALLERY,
    I_IN_PLACE,
    PROFILE_RATE,
    PROFILE_REVIEW,
    PROFILE_SEND_POST,
    REMOVE,
    SEND_POST
} from "../../../publics/Constant";
import {AccentColor, backColor, Medium, PrimaryTextColor, SecondaryTextColor, Small, width} from "../../../publics/Ui";
import MyText from "../../../customs/MyText";
import {Actions} from "react-native-router-flux";
import {setUser} from "../../../../redux/actions";
import CircleImageBadgeDescList from "../../../customs/List/CircleImageBadgeDescList";
import UserPostSquare from '../../../customs/UserPostSquare';
import FastImage from "react-native-fast-image";

const actions = [
    {
        text: 'تغییر عکس پروفایل',
        icon: require('./../../../../assets/images/icons/comment.png'),
        name: CHANGE_PROFILE_IMAGE,
        position: 1,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    },
    {
        text: 'ارسال پست',
        icon: require('./../../../../assets/images/icons/add_photo.png'),
        name: SEND_POST,
        position: 3,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    }
];

const UserActions = [
    {
        text: 'اینجا بوده ام',
        icon: require('./../../../../assets/images/icons/checkLocation.png'),
        name: I_IN_PLACE,
        position: 1,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    },
    {
        text: 'امتیاز دهی',
        icon: require('./../../../../assets/images/icons/star_white.png'),
        name: PROFILE_RATE,
        position: 2,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    },
    {
        text: 'ثبت نقد و بررسی',
        icon: require('./../../../../assets/images/icons/comment.png'),
        name: PROFILE_REVIEW,
        position: 3,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    },

    {
        text: 'ارسال تصویر',
        icon: require('./../../../../assets/images/icons/add_photo.png'),
        name: PROFILE_SEND_POST,
        position: 3,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    }
];

class BusinessProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [Information],
            profileData: this.props.profileData === null ? this.props.User : this.props.profileData,
            selectedPage: BUSINESS_PROFILE_INFORMATION,
            refreshing: false,
            ListLoading: false,
            EndList: false,
            page: 1,
            noData: false,
            scrollEnabled: false,
            titleOpacity: 0,
            image: null,
            Loading: false,
            Visible: true
        }
    }

    fetchDataAPI() {

        switch (this.state.selectedPage) {
            case BUSINESS_PROFILE_INFORMATION : {
                this.setState({data: [Information], refreshing: false, ListLoading: false});
                break;
            }
            case BUSINESS_PROFILE_REVIEW : {
                this.fetchReviewData();
                break;
            }
            case BUSINESS_PROFILE_POSTS : {
                this.fetchUserPostData();
                break;
            }
        }

    }

    fetchReviewData() {

        let Parameter = JSON.stringify({
            UserId: this.state.profileData.ID,
            Page: this.state.page,
            IsBusiness: true
        });

        FetchDataFromAPI("getUserReviews", Parameter, (response) => {

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

        }).done(() => this.setState({refreshing: false, ListLoading: false, noData: this.state.data.length <= 0}))

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
                    backgroundColor: backColor
                }}>
                    <View style={{width: 50}}>


                        <TouchableOpacity
                            onPress={() => Actions.Chat({
                                ToUserID: this.state.profileData.ID,
                                Name: this.state.profileData.FullName
                            })}

                            style={{
                                display: this.props.profileData === null ? 'none' : 'flex',
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>

                            <FastImage
                                source={require('../../../../assets/images/icons/chat_black.png')}
                                style={[{width: 25, height: 25}]}
                                resizeMode={"contain"}
                            />
                        </TouchableOpacity>

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
                        onPress={() => Actions.BusinessEditProfile({
                            callBack: (UserData) => {
                                this.setState({refreshing: true, data: []}, () => {
                                    let ProfileData = this.state.profileData;
                                    ProfileData.UserName = UserData.UserName;
                                    ProfileData.Status = UserData.Status;
                                    ProfileData.CityName = UserData.CityName;
                                    ProfileData.CityId = UserData.CityId;
                                    ProfileData.Email = UserData.Email;
                                    ProfileData.Address = UserData.Address;
                                    ProfileData.Latitudes = UserData.Latitudes;
                                    ProfileData.Longitudes = UserData.Longitudes;
                                    ProfileData.ContactData = UserData.ContactData;
                                    ProfileData.Cars = UserData.Cars;
                                    ProfileData.VIPServices = UserData.VIPServices;
                                    ProfileData.Services = UserData.Services;
                                    this.setState({profileData: ProfileData, data: [Information], refreshing: false});
                                });
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
                            style={[{width: 22, height: 22}]}
                            resizeMode={"contain"}
                        />
                    </TouchableOpacity>


                </View>

                {this.renderHeaderButton()}

                {this.renderChooseFlatList()}

                <FloatingAction
                    visible={this.state.Visible}
                    showBackground={true}
                    position='left'
                    actions={this.props.isReadOnly ? UserActions : actions}
                    onPressItem={(itemName) => this.selectedItem(itemName)}
                />


            </BaseUi>
        );
    }

    renderChooseFlatList() {

        if (this.state.selectedPage !== BUSINESS_PROFILE_POSTS) {
            return (
                <FlatList
                    ref={(list) => this.flatList = list}
                    key={1}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderFlatListItems(item)}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    refreshing={this.state.refreshing}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={1}
                    removeClippedSubviews
                    /*                    onScrollEndDrag={() => this.ShowFabButton()}
                                        onScrollBeginDrag={() => this.HideFabButton()}*/
                    ListHeaderComponent={() => this.renderForeground()}
                />);

        } else {

            return (
                <FlatList
                    ref={(list) => this.flatList = list}
                    key={2}
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderFlatListItems(item)}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    refreshing={this.state.refreshing}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={1}
                    /*                    onScrollEndDrag={() => this.ShowFabButton()}
                                        onScrollBeginDrag={() => this.HideFabButton()}*/
                    ListHeaderComponent={() => this.renderForeground()}
                />);

        }
    }

    renderForeground() {

        return (
            <View>
                <View style={{height: ScreenHeight * 0.35}}>
                    <Image
                        resizeMode='cover'
                        style={{height: '100%', width: '100%'}}
                        source={this.renderImageProfile()}
                    />
                </View>
                <MyTabBar
                    defaultTab={BUSINESS_PROFILE_INFORMATION}
                    selectedTab={this.state.selectedPage}
                    tabs={[
                        {
                            tabName: BUSINESS_PROFILE_REVIEW,
                            onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                            text: "نقد و بررسی",
                            badge: this.state.profileData.ReviewCount
                        },
                        {
                            tabName: BUSINESS_PROFILE_POSTS,
                            onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                            text: "پست ها",
                            badge: this.state.profileData.PostCount
                        },
                        {
                            tabName: BUSINESS_PROFILE_INFORMATION,
                            onPress: (selectedPage) => this.onChangeTabBar(selectedPage),
                            text: "مشخصات",
                        }
                    ]}
                />
            </View>
        );

    }

    renderFlatListItems(item) {

        if (this.state.selectedPage === BUSINESS_PROFILE_INFORMATION)
            return <Information profileData={this.state.profileData}/>;
        else if (this.state.selectedPage === BUSINESS_PROFILE_REVIEW)
            return this.renderReviewItem(item);
        else if (this.state.selectedPage === BUSINESS_PROFILE_POSTS)
            return this.renderPostItem(item);


    };

    renderReviewItem({item}) {

        return (
            <CircleImageBadgeDescList
                Id={item.ReviewId}
                UserId={item.ID}
                ProfileName={item.FullName}
                CityName={item.CityName}
                DescDateTime={item.ReviewDateTime}
                Description={item.ReviewDescription}
                PhotoFileName={item.PhotoFileName}
            />
        );
    }

    renderEmptyList() {

        if (!this.state.noData && !this.state.refreshing) {
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        } else
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>

                    <MyText
                        componentStyles={{color: SecondaryTextColor, fontSize: 16}}
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

    selectedItem(itemName) {

        switch (itemName) {
            case CHANGE_PROFILE_IMAGE : {
                Actions.ChangePictureDialog({callback: (clicked) => this.ChangeProfileImage(clicked)});
                break;
            }

            case SEND_POST : {
                Actions.CameraDialog({callback: (clicked) => SendUserPost(clicked, (postData) => this.setUserPostData(postData))});
                break;
            }

            ///   Read Only Profile Actions
            case I_IN_PLACE : {
                Actions.IWasThereDialog({
                    UserId: this.props.User.ID,
                    BusinessUserId: this.state.profileData.ID,
                    BusinessFullName: this.state.profileData.FullName,
                    BusinessAddress: this.state.profileData.Address
                });
                break;
            }
            case PROFILE_RATE : {
                this.ShowRateDialog();
                break;
            }
            case PROFILE_REVIEW : {
                Actions.CriticizeDialog({
                    UserId: this.props.User.ID,
                    BusinessUserId: this.state.profileData.ID,
                    BusinessFullName: this.state.profileData.FullName,
                    onReviewSave: (review) => {

                        if (this.state.selectedPage === BUSINESS_PROFILE_REVIEW) {

                            this.setState((preState) => {

                                return {
                                    data: [review, ...preState.data]
                                }

                            });

                        } else
                            this.onChangeTabBar(BUSINESS_PROFILE_REVIEW);

                    }
                });
                break;
            }


            case PROFILE_SEND_POST : {
                pickFileGallery((file) => {
                    Actions.SendPost({
                        ImageData: file,
                        SenderId: this.state.profileData.ID,
                        onSendPost: (postData) => this.setUserPostData(postData)
                    });
                }, 'photo');
                break;
            }

        }


    }

    ChangeProfileImage(clicked) {

        switch (clicked) {

            case CAMERA : {
                pickSingleWithCamera(false, (image) => {
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
                pickSingle(false, (image) => {
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

                const UserData = this.props.User;
                UserData.PhotoFileName = FileName;
                this.props.setUser(UserData);

                if (imageData === null)
                    this.setState({image: null});

            } else
                Actions.ExceptionDialog({Message: response.Message});

        }).done(() => this.setState({Loading: false}));

    }

    renderHeaderButton() {

        if (this.props.showOnNavigation) {

            return (

                <View
                    style={{
                        height: HeaderHeight,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        zIndex: 1,
                        left: 0,
                        top: 0
                    }}>

                    <TouchableOpacity
                        style={{
                            width: 40,
                            height: HeaderHeight,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => this.signOutUser()}>

                        <FastImage
                            source={require('../../../../assets/images/icons/sign_out.png')}
                            style={{width: '50%', height: '50%'}}
                            resizeMode={"contain"}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: 50,
                            height: HeaderHeight,
                            justifyContent: 'center'
                        }}
                        onPress={() => Actions.BusinessBookMarkPosts()}>

                        <FastImage
                            source={require('../../../../assets/images/icons/Bookmark-Fill.png')}
                            style={{width: '40%', height: '40%'}}
                            resizeMode={"contain"}
                        />

                    </TouchableOpacity>

                </View>

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

    setUserPostData(postData) {

        if (this.state.selectedPage !== BUSINESS_PROFILE_POSTS)
            this.onChangeTabBar(BUSINESS_PROFILE_POSTS);
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

    renderPostItem(itemData) {

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

    ShowRateDialog() {

        const Parameter = JSON.stringify({

            UserId: this.props.User.ID,
            BusinessUserId: this.state.profileData.ID

        });

        this.setState({Loading: true});

        FetchDataFromAPI("getUserRateValue", Parameter, (response) => {

            if (response.Success) {
                Actions.RatingDialog({
                    UserId: this.props.User.ID,
                    BusinessUserId: this.state.profileData.ID,
                    BusinessFullName: this.state.profileData.FullName,
                    Rate: Number.parseInt(response.Response.Rate)
                });
            }

        }).done(() => this.setState({Loading: false}));

    }
}

BusinessProfile.propsTypes = {
    isReadOnly: propTypes.bool,
    profileData: propTypes.object,
    showOnNavigation: propTypes.bool
};

BusinessProfile.defaultProps = {
    isReadOnly: false,
    profileData: null,
    showOnNavigation: true
};

const mapDispatchToProps = (dispatch) => {

    return {

        setUser: (user) => {
            dispatch(setUser(user))
        }

    }

};

const mapStateToProps = (states) => {

    return {User: states.User};

};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessProfile);