import React from "react";
import {AccentColor, Medium, SecondaryTextColor,} from "../../publics/Ui";
import {FlatList, View, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import MyCard from "../MyCard";
import MyText from "../MyText";
import propTypes from "prop-types"
import {BaseURL, FetchDataFromAPI, ProfileAddress} from "../../publics/DataBase";
import {ForumPageCount} from "../../publics/Function";
import {Actions} from "react-native-router-flux";

export default class ForumSortList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            ListLoading: false,
            page: 1,
            EmptyList: false
        }
    }

    componentWillMount() {

        this.fetchDataFromAPI();
    }

    render() {
        return (
            <View
                style={{backgroundColor: 'transparent', paddingBottom: 95}}>
                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item) => item.ID.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={0.5}
                />
            </View>
        )
    }

    renderItem = item => {
        return (
            <TouchableOpacity
                onPress={() => Actions.ForumReplyList({item:item})}
                activeOpacity={0.8}>
                <MyCard MyCardStyle={{height: 180}}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{marginRight: '3%'}}>
                            <MyText
                                text={item.FullName}
                                componentStyles={{ color: AccentColor}}
                            />
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <MyText
                                    text={' بازدید ' + item.ReviewCount}
                                    componentStyles={{marginRight: '4%', color: SecondaryTextColor}}
                                />
                                <MyText
                                    text={' پاسخ ' + item.ReplyCount}
                                    componentStyles={{marginRight: '4%', color: SecondaryTextColor}}
                                />
                                <MyText
                                    text={item.PersianTime}
                                    componentStyles={{color: SecondaryTextColor}}
                                />
                            </View>
                        </View>
                        <Image
                            source={{uri: BaseURL + ProfileAddress + item.PhotoFileName}}
                            style={{
                                height: 70,
                                width: 70,
                                borderRadius: 70/ 2,
                                marginBottom: 5
                            }}
                        />
                    </View>
                    <View style={{paddingRight: '2%'}}>
                        <View>
                            <MyText
                                numberOfLines={1}
                                text={item.Subject}
                                componentStyles={{fontSize: Medium, color: AccentColor}}
                            />
                        </View>

                        <View>
                            <MyText
                                numberOfLines={3}
                                text={item.Description}

                            />
                        </View>
                    </View>
                </MyCard>
            </TouchableOpacity>
        )


    };

    fetchDataFromAPI() {


        let Parameter = JSON.stringify({
            connectionID: this.props.connectionID,
            OrderMode: this.props.OrderMode,
            Page: this.state.page
        });


        FetchDataFromAPI("GetForumQuestion", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }


            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false,
                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});


        }).done(() => this.setState({refreshing: false, ListLoading: false, EmptyList: this.state.data.length <= 0}))

    }

    handleRefresh() {
        this.setState({page: 1, refreshing: true, data: [], ListLoading: false}, () =>
            this.fetchDataFromAPI());
    };

    renderEmptyList() {

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
                this.fetchDataFromAPI());
        }

    }

    getRenderFooter() {
        if (this.state.data.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    UpdateListAfterReply(item) {

        this.setState(preState => {
            return {
                data: [item, ...preState.data]
            }

        });

        // if (this.props.OrderMode == 1) {
        //
        //
        // }
        //
        // if (this.props.OrderMode == 2) {
        //
        //     this.setState(preState => {
        //         return {
        //             data: [ ...preState.data,item]
        //         }
        //
        //     });
        //
        // }
    }

}

ForumSortList.propTypes = {
    connectionID: propTypes.string,
    OrderMode: propTypes.number
};

