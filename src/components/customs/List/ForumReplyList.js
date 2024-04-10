import React from "react";

import {ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {
    AccentColor,
    BackColorDark,
    colorGreenDarkBtn,
    height, Medium,
    PrimaryTextColor,
    RedCircle,
    SecondaryTextColor, Small,
    width
} from "../../publics/Ui";
import MyText from "../MyText";
import MyHeader from "../MyHeader";
import MyCard from "../MyCard";
import MyButton from "../MyButton";
import propTypes from "prop-types"
import {BaseURL, FetchDataFromAPI, ProfileAddress} from "../../publics/DataBase";
import {ForumPageCount} from "../../publics/Function";
import BaseUi from "../../basepage/BaseUi";
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import FastImage from "react-native-fast-image";

class ForumReplyList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            ListLoading: false,
            page: 1,
            EmptyList: false,
            Loading: false,
            LikeLoading: false,
            DisLikeLoading: false,
            ItemLikeID:'',
            ID: this.props.item !== undefined ? this.props.item.ID : "",
            Description: this.props.item !== undefined ? this.props.item.Description : "",
            ReviewCount: this.props.item !== undefined ? this.props.item.ReviewCount : "",
            ReplyCount: this.props.item !== undefined ? this.props.item.ReplyCount : "",
            Subject: this.props.item !== undefined ? this.props.item.Subject : "",
            FullName: this.props.item !== undefined ? this.props.item.FullName : "",
            Score: this.props.item !== undefined ? this.props.item.Score : "",
            PhotoFileName: this.props.item !== undefined ? this.props.item.PhotoFileName : "",
            PersianTime: this.props.item !== undefined ? this.props.item.PersianTime : "",
            UserID_FK: this.props.item !== undefined ? this.props.item.UserID_FK : "",
        }
    }

    componentWillMount() {
        if (this.props.item !== undefined)
            this.fetchDataFromAPI();
        else
            this.fetchDataIndependent();

    }

    render() {

        if (this.state.data.length <= 0 && this.props.AnswerId != null) {

            return (
                <BaseUi
                    Loading={true}
                    ViewStyle={{flex: 1, backgroundColor: 'white'}}/>

            );

        } else {

            return (
                <BaseUi
                    Loading={this.state.Loading}
                    ViewStyle={{backgroundColor: 'white'}}>
                    <FlatList
                        style={{backgroundColor: 'white'}}
                        data={this.state.data}
                        renderItem={({item, index}) => this.renderItem(item, index)}
                        keyExtractor={(item) => item.ID.toString()}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh.bind(this)}
                        onEndReached={this.onEndPage.bind(this)}
                        ListEmptyComponent={() => this.renderEmptyList()}
                        ListFooterComponent={this.getRenderFooter.bind(this)}
                        ListHeaderComponent={() => this.renderHeader()}
                        onEndReachedThreshold={0.5}
                        showsVerticalScrollIndicator={false}
                    />
                </BaseUi>
            );
        }
    }

    renderHeader() {

        return (
            <View>
                <MyHeader
                    text={' انجمن '}
                    showText={true}/>
                <MyCard>
                    <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                        <View style={{width: '20%'}}>
                            <TouchableOpacity
                                onPress={() => Actions.ReportDialog({Context: () => this.reportAnswerData(this.state.ID, 2)})}
                                style={{width: 50}}>
                                <FastImage
                                    source={require('../../../assets/images/icons/menu.png')}
                                    style={{
                                        height: 30,
                                        width: 30,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => Actions.ShowProfile({UserId: this.state.UserID_FK})}
                            style={{width: '80%', flexDirection: 'row', justifyContent: 'flex-end',BackgroundColor:'yellow'}}>
                            <View style={{width: '60%', paddingRight: '2%'}}>
                                <MyText
                                    componentStyles={{
                                        color: AccentColor,
                                        fontSize: Medium,
                                    }}
                                    text={this.state.FullName}/>
                                <MyText
                                    componentStyles={{
                                        color: SecondaryTextColor,
                                        fontSize: Small,
                                    }}
                                    text={' امتیاز ' + this.state.Score}/>
                            </View>
                            <View style={{width: 70}}>
                                <Image
                                    source={{uri: BaseURL + ProfileAddress + this.state.PhotoFileName}}
                                    style={FormStyle.HeaderImage}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingRight: '3%'}}>
                        <MyText
                            componentStyles={{
                                color: AccentColor,
                                fontSize: Medium,
                            }}
                            text={this.state.Subject}/>
                        <MyText
                            componentStyles={{
                                color: SecondaryTextColor,

                            }}
                            text={this.state.PersianTime}/>

                        <MyText
                            componentStyles={{
                                color: PrimaryTextColor,

                                marginTop: 10
                            }}
                            text={this.state.Description}/>
                    </View>

                    <MyButton
                        buttonOnPress={() => Actions.AnswerQuestionDialog({
                            ID: this.state.ID,
                            CallBack: (item) => this.UpdateListAfterReply(item)
                        })}
                        text={'پاسخ'}
                        viewStyle={FormStyle.ReplyBtn}/>

                </MyCard>
                <View style={{paddingRight: 10}}>
                    <MyText
                        componentStyles={{
                            color: PrimaryTextColor,
                            fontSize: Medium,

                        }}
                        text={' پاسخ ' + this.state.ReplyCount}/>
                </View>
            </View>)

    }

    renderItem(item, index) {

        return (
            <View style={FormStyle.MainViewList}>
                <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                    <View style={{width: '20%'}}>
                        <TouchableOpacity
                            onPress={() => Actions.ReportDialog({Context: () => this.reportAnswerData(item.ID, 1)})}
                            style={{width: 50}}>
                            <FastImage
                                source={require('../../../assets/images/icons/menu.png')}
                                style={{
                                    height: 30,
                                    width:30,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => Actions.ShowProfile({UserId: item.UserID_Fk})}
                        style={{width: '80%', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{width: '60%', paddingRight: '2%'}}>
                            <MyText
                                componentStyles={{
                                    color: AccentColor,
                                    fontSize:Medium,
                                }}
                                text={item.FullName}/>
                            <MyText
                                componentStyles={{
                                    color: SecondaryTextColor,

                                }}
                                text={' امتیاز ' + item.Score}/>
                        </View>
                        <View style={{width: '20%'}}>
                            <Image
                                source={{uri: BaseURL + ProfileAddress + item.PhotoFileName}}
                                style={FormStyle.ImageList}
                            />
                        </View>
                    </TouchableOpacity>


                </View>
                <View style={{width: '77%'}}>
                    <MyText
                        componentStyles={{
                            color: SecondaryTextColor,
                        }}
                        text={item.Answer}/>

                    <View style={FormStyle.EndlistView}>
                        <View style={{
                            width: '35%', height: '100%',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-end'
                        }}>
                            <MyText
                                componentStyles={{
                                    color: SecondaryTextColor,

                                }}
                                text={item.PersianTime}/>
                        </View>

                        <View style={FormStyle.MainLikeView}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.SendLikeData(item.ID, 1, item.UserID_Fk)
                                }}
                                style={FormStyle.LikeTouch}>

                                <View style={FormStyle.Count}>
                                    {this.AnswerLikeRender(item)}
                                </View>
                                <View>
                                    <FastImage
                                        source={require('../../../assets/images/icons/likeComment.png')}
                                        style={{
                                            height: 30,
                                            width: 30,

                                        }}
                                    />
                                </View>

                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.SendLikeData(item.ID, 0, item.UserID_Fk)
                                }}
                                style={FormStyle.LikeTouch}>

                                <View style={FormStyle.Count}>
                                    {this.AnswerDislikeRender(item)}
                                </View>
                                <View>
                                    <FastImage
                                        source={require('../../../assets/images/icons/dislikeComment.png')}
                                        style={{
                                            height: 30,
                                            width: 30,
                                            marginTop: 30/2,
                                        }}
                                    />

                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>)


    }

    AnswerLikeRender(item) {


        if (this.state.LikeLoading && this.state.ItemLikeID==item.ID) {
            return <ActivityIndicator color={AccentColor} size={"small"}/>;
        }
        else {
            return <MyText
                componentStyles={{
                    color: colorGreenDarkBtn,

                }}
                text={item.AnswerLike}/>
        }

    }

    AnswerDislikeRender(item) {

        if (this.state.DisLikeLoading && this.state.ItemLikeID==item.ID) {
            return <ActivityIndicator color={AccentColor} size={"small"}/>;
        }
        else {
            return <MyText
                componentStyles={{
                    color: RedCircle,

                }}
                text={item.AnswerDislike}/>
        }

    }

    UpdateListAfterReply(item) {

        this.setState(preState => {
            return {
                data: [item, ...preState.data]
            }
        });

        this.setState({ReplyCount: parseInt(this.state.ReplyCount) + 1});

    }

    fetchDataFromAPI() {

        let Parameter = JSON.stringify({
            QuestionID_FK: this.props.item.ID,
            Page: this.state.page,
            UserID: this.props.User.ID
        });

        FetchDataFromAPI("GetForumAnswer", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }


            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: [...preState.data, ...response.Response],
                        refreshing: false
                    }
                }, () => this.setState({ EmptyList: this.state.data.length <= 0 }));
            } else
                this.setState({refreshing: false, ListLoading: false });


        }).done(() => this.setState({refreshing: false, ListLoading: false , EmptyList: this.state.data.length <= 0}));

    }

    handleRefresh() {
        this.setState({page: 1, refreshing: true, data: [], ListLoading: false}, () => this.checkModelRefresh())
    };

    checkModelRefresh() {
        this.props.item !== undefined ? this.fetchDataFromAPI() : this.fetchDataIndependent();
    }

    renderEmptyList(){

        if (this.state.refreshing)
            return null;

        if (this.state.EmptyList)
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <MyText
                        componentStyles={{color: SecondaryTextColor, fontSize: 16}}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>
                </View>
            );
        else
            return <ActivityIndicator color={AccentColor} size={"large"}/>;

    }

    onEndPage() {

        if (this.state.data.length >= ForumPageCount) {
            this.setState({page: this.state.page + 1, ListLoading: true, refreshing: false}, () =>
                this.checkModelRefresh());
        }

    }

    getRenderFooter() {
        if (this.state.data.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    SendLikeData(ID = null, LikeDislike = null, UserID_Fk = null) {

        if (UserID_Fk === this.props.User.ID) {
            Actions.ExceptionDialog({Message: "این امکان برای پاسخ خودتان غیر فعال است"});
            return;
        }

        if (LikeDislike === 1)
            this.setState({LikeLoading: true,ItemLikeID:ID});
        else this.setState({DisLikeLoading: true,ItemLikeID:ID});

        let Parameter = JSON.stringify({
            LikeDislike: LikeDislike,
            AnswerID_FK: ID,
            UserID: this.props.User.ID,
        });

        FetchDataFromAPI("HandleAnswerLike", Parameter, (response) => {
            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }
            if (response.Success) {

                let data = [...this.state.data];
                let index = data.findIndex(el => el.ID == response.Response[0].ID);
                data[index].AnswerLike = response.Response[0].AnswerLike;
                data[index].AnswerDislike = response.Response[0].AnswerDislike;
                this.setState({data});

            }


        }).done(() => this.setState({LikeLoading: false, DisLikeLoading: false,ItemLikeID:''}))

    }

    reportAnswerData(ID, Type) {

        this.setState({Loading: true});
        const Parameter = JSON.stringify({
            Type: Type,
            ID: ID
        });

        FetchDataFromAPI("SetReport", Parameter, (response) => {
            if (response.Success)
                Actions.ConfirmDialog({Message: response.Message});
            else
                Actions.ExecptionDialog({Message: response.Message});
        }).done(() => this.setState({Loading: false}));

    }

    fetchDataIndependent() {


        let Parameter = JSON.stringify({
            AnswerID: this.props.AnswerId,
            Page: this.state.page,

        });


        FetchDataFromAPI("GetReplyListWithID", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }


            if (response.Response.length > 0) {

                if (this.state.page === 1) {
                    let Question = response.Response[0].Question[0];


                    this.setState({
                        ID: Question.ID,
                        Description: Question.Description,
                        ReviewCount: Question.ReviewCount,
                        ReplyCount: Question.ReplyCount,
                        Subject: Question.Subject,
                        FullName: Question.FullName,
                        Score: Question.Score,
                        PhotoFileName: Question.PhotoFileName,
                        PersianTime: Question.PersianTime,
                        UserID_FK: Question.UserID_FK,
                    })
                }

                this.setState(preState => {
                    return {
                        data: [...preState.data, ...response.Response[0].Answer],
                        refreshing: false,
                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});


        }).done(() => this.setState({refreshing: false, ListLoading: false, EmptyList: this.state.data.length <= 0}))

    }
}

ForumReplyList.propTypes = {
    item: propTypes.object,
    AnswerId: propTypes.string
};

ForumReplyList.defaultTypes = {
    item: null,
    AnswerId: null
};

const FormStyle = StyleSheet.create({
    ImageList: {
        height: 50,
        width: 50,
        borderRadius: 50/ 2,
        marginBottom: 5
    },
    MainViewList: {
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: BackColorDark,
        borderRadius: 15,
        marginBottom: height * 0.02, padding: 7
    },
    HeaderImage: {
        height: 70,
        width: 70,
        borderRadius: 70 / 2,
        marginBottom: 5

    },
    ReplyBtn: {
        marginRight: '0%',
        marginLeft: '0%',
        marginTop: '0%', height: 45, width: 90
    },
    EndlistView: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.02,
        height: height * 0.05

    },
    MainLikeView: {
        width: '65%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    LikeTouch: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '40%',

    },

    Count: {
        justifyContent: 'flex-end',
        height: '100%',
        paddingBottom: 8,
        marginRight: 7
    }

});

const mapStateToProps = (states) => {
    return {
        User: states.User,
    };
};

export default connect(mapStateToProps)(ForumReplyList);