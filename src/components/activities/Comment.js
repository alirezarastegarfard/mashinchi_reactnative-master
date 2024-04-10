import * as React from 'react';
import {FlatList, Image, View, TouchableOpacity, TextInput, ActivityIndicator} from 'react-native';
import {
    AccentColor,
    AppFont,
    BorderColor,
    RedCircle,
    SecondaryTextColor,
    VerySmall,
    width
} from "../publics/Ui";
import MyHeader from "../customs/MyHeader";
import MyText from "../customs/MyText";
import {connect} from 'react-redux';
import CommentListItem from "../customs/List/CommentListItem";
import {BaseURL, FetchDataFromAPI, ProfileAddress} from "../publics/DataBase";
import {Actions} from 'react-native-router-flux';
import BaseUi from "../basepage/BaseUi";
import {PageCount} from "../publics/Function";
import EStyleSheet from "react-native-extended-stylesheet";
import TrashIcon from '../../assets/images/icons/trash.png';
import ReportIcon from '../../assets/images/icons/reportIcon.png';
import PropTypes from 'prop-types';

export const ProfileCircleImageSize = 50;
export const ProfileCircleImageSendSize = 38;

const HeaderItem = {Type: "Header"};

class Comment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Data: [],
            ListLoading: false,
            input: '',
            Page: 1,
            noData: false,
            postLoading: false,
            refreshing: false,
            EndList: false,
            SelectedCommentId: 0,
            SelectedProfileId: 0,
            SelectedIndex: -1,
            CommentCount: this.props.CommentCount
        };

    }

    componentWillMount(): void {
        this.fetchDataAPI();
    }

    componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {

        if (this.state.Data.length <= 0)
            this.fetchDataAPI();

    }

    componentWillUnmount(): void {

        if (this.props.onClose !== null)
            this.props.onClose(this.state.CommentCount);
    }

    fetchDataAPI() {

        const {PostId} = this.props;

        const Parameter = JSON.stringify({
            PostId,
            Page: this.state.Page,
            CommentId: this.props.CommentId
        });

        FetchDataFromAPI("getPostComments", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }

            if (this.state.Page > 1 && response.Response.length <= 0) {
                this.setState({EndList: true});
                return;
            }

            this.setState(preState => {
                return {
                    Data: this.state.Page === 1 ? response.Response : [...preState.Data, ...response.Response],
                    noData: response.Response.length <= 0,
                    EndList: false
                }
            }, () => {

                if (this.props.ListHeaderComponent === null || this.state.Page > 1)
                    return;

                this.setState(preState => {
                    return {
                        Data: [HeaderItem, ...preState.Data]
                    }
                }, this.scrollToFirstItem.bind(this));


            });

        }).done(() => this.setState({ListLoading: false, refreshing: false}))
    }

    scrollToFirstItem() {

        setTimeout(() => {

            if (this.List === null)
                return;

            this.List.scrollToIndex({
                animated: true,
                index: 1,
                viewPosition: .7,
                viewOffset: 1
            });

        }, 1300);

    }

    scrollToTopList() {

        if (this.List === null)
            return;

        this.List.scrollToIndex({
            animated: true,
            index: 0
        });
    }

    render() {
        return (
            <BaseUi>

                <MyHeader
                    showText={true} text={'نظرات'}
                    buttonLeftShowing
                    buttonLeftImage={this.renderHeaderIcon()}
                    buttonLeftOnPress={() => this.onRemoveOrReportCommentClick()}
                />

                <FlatList
                    ref={(list) => this.List = list}
                    style={{
                        backgroundColor: 'transparent',
                        marginBottom: this.props.ListHeaderComponent === null ? 60 : 70
                    }}
                    data={this.state.Data}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    onEndReachedThreshold={.5}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                />

                <View style={Style.ProfilePostStyle}>


                        {this.renderPostButton()}


                    <View style={{width: width - 115, height: '100%'}}>

                        <TextInput
                            underlineColorAndroid='transparent'
                            multiline={true}
                            style={Style.InputStyle}
                            value={this.state.input}
                            placeholder={"نظری بنویسید"}
                            placeholderTextColor={SecondaryTextColor}
                            onChangeText={(text) => this.setState({input: text})}
                        />

                    </View>


                    <View
                        style={{
                            width: ProfileCircleImageSendSize + 7,
                            height: ProfileCircleImageSendSize + 7,
                            borderRadius: (ProfileCircleImageSendSize + 7) / 2,
                            borderWidth: 2,
                            borderColor: RedCircle,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: '1.5%'
                        }}>

                        <Image
                            style={{
                                width: ProfileCircleImageSendSize,
                                height: ProfileCircleImageSendSize,
                                borderRadius: ProfileCircleImageSendSize / 2,
                            }}
                            source={{uri: BaseURL + ProfileAddress + this.props.User.PhotoFileName}}
                        />

                    </View>


                </View>


            </BaseUi>
        );
    }

    renderEmptyList() {

        if (this.state.refreshing)
            return null;

        if (this.state.noData)
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <MyText
                        componentStyles={{color: SecondaryTextColor, fontSize: 16}}
                        text={"نظری ثبت نشده است"}/>
                </View>
            );
        else
            return <ActivityIndicator color={AccentColor} size={"large"}/>;

    }

    handleRefresh() {
        this.setState({Page: 1, refreshing: true, Data: []}, () =>
            this.fetchDataAPI());
    };

    onEndPage() {

        if (this.state.EndList)
            return;

        if (this.state.Data.length >= PageCount) {
            this.setState({Page: this.state.Page + 1, ListLoading: true}, () =>
                this.fetchDataAPI());
        }

    }

    getRenderFooter() {

        if (this.state.Data.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    renderItem(CommentItem) {

        if (this.props.ListHeaderComponent !== null && CommentItem.index === 0)
            return this.props.ListHeaderComponent();

        const {item} = CommentItem;

        let SelectedProps = {};

        if (this.props.CommentId !== null && CommentItem.index === 1) {

            SelectedProps = {
                Selected: true
            }

        }

        return (<CommentListItem
            index={CommentItem.index}
            ProfileId={item.UserId}
            CommentId={item.CommentId}
            Comment={item.Comment}
            CommentUserName={item.UserName}
            CommentDateTime={item.CommentDateTime}
            PhotoFileName={item.PhotoFileName}
            onCommentSelected={(commentId, ProfileId, index) => {
                this.setState({
                    SelectedCommentId: commentId,
                    SelectedProfileId: ProfileId,
                    SelectedIndex: index
                });
            }}
            isSelectable={this.state.SelectedCommentId === 0}
            {...SelectedProps}
        />);
    }

    sendComment() {

        if (this.state.input === '')
            return;

        this.setState({postLoading: true});

        const Parameter = JSON.stringify({

            UserId: this.props.User.ID,
            PostId: this.props.PostId,
            Comment: this.state.input

        });

        FetchDataFromAPI("PostComment", Parameter, (response) => {

            if (response.Success) {

                const Comment = response.Response.CommentData;
                const CommentCount = response.Response.CommentCount;

                let CommentsData = [Comment, ...this.state.Data];

                if (this.props.ListHeaderComponent !== null) {
                    CommentsData = this.state.Data;
                    CommentsData.splice(1, 0, Comment);
                }

                this.setState({Data: CommentsData, CommentCount, input: ''}, () => {

                    if (this.props.CommentId === null)
                        this.scrollToTopList();
                    else
                        this.scrollToFirstItem();
                });

            } else
                Actions.ExceptionDialog({Message: response.Message});


        }).done(() => this.setState({postLoading: false}))

    }

    renderPostButton() {

        if (this.state.postLoading)
            return (
                <View
                    style={Style.PostButtonStyle}>

                    <ActivityIndicator color={AccentColor}/>

                </View>

            );
        else
            return (
                <TouchableOpacity
                    style={Style.PostButtonStyle}
                    activeOpacity={this.state.input === '' ? 1 : .6}
                    onPress={() => this.sendComment()}>

                    <MyText
                        text={'ارسال'}
                        componentStyles={{
                            color: this.state.input === '' ? 'rgba(56,151,241,.5)' : AccentColor,

                        }}
                    />

                </TouchableOpacity>
            );


    }

    renderHeaderIcon() {

        if (this.state.SelectedCommentId === 0)
            return null;

        if (this.state.SelectedProfileId === this.props.User.ID)
            return TrashIcon;
        else
            return ReportIcon;

    }

    onRemoveOrReportCommentClick() {

        if (this.state.SelectedCommentId === 0)
            return;

        if (this.state.SelectedProfileId === this.props.User.ID)
            this.removeComment();
        else
            this.reportComment();
    }

    removeComment() {

        const RemoveComment = () => {

            const Params = JSON.stringify({
                CommentId: this.state.SelectedCommentId
            });

            FetchDataFromAPI("removeComment", Params, (response) => {

                if (response.Success) {

                    let LastData = this.state.Data;

                    LastData.splice(this.state.SelectedIndex, 1);

                    this.setState({
                        Data: LastData,
                        SelectedCommentId: 0,
                        SelectedIndex: -1,
                        SelectedProfileId: 0
                    });

                    Actions.ConfirmDialog({Message: response.Message});
                } else
                    Actions.ExceptionDialog({Message: response.Message});

            }).done();

        };

        Actions.QuestionDialog({
            Message: "آیا برای حذف نظر اطمینان دارید؟",
            onConfirm: () => RemoveComment()
        });

    }

    reportComment() {

        const ReportComment = () => {

            const Params = JSON.stringify({
                CommentId: this.state.SelectedCommentId
            });

            FetchDataFromAPI("reportComment", Params, (response) => {

                if (response.Success)
                    Actions.ConfirmDialog({Message: response.Message});
                else
                    Actions.ExceptionDialog({Message: response.Message});

            }).done();

        };

        Actions.QuestionDialog({
            Message: "آیا برای گزارش نظر اطمینان دارید؟",
            onConfirm: () => ReportComment()
        });

    }
}

const Style = EStyleSheet.create({

    PostButtonStyle: {
        width: 60,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    InputStyle: {
        fontSize:VerySmall,
        fontFamily: AppFont,
        maxHeight: 100,
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        textAlign: 'right',
        minHeight: 30
    },
    ProfilePostStyle: {
        position: 'absolute',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: BorderColor,
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding:2
    }

});

Comment.propTypes = {
    PostId: PropTypes.string,
    ListHeaderComponent: PropTypes.func,
    onClose: PropTypes.func,
    CommentId: PropTypes.string,
    CommentCount: PropTypes.string
};

Comment.defaultProps = {
    ListHeaderComponent: null,
    onClose: null,
    CommentId: null,
    CommentCount: "0"
};

const mapStateToProps = (states) => {

    return {User: states.User}

};

export default connect(mapStateToProps)(Comment);


