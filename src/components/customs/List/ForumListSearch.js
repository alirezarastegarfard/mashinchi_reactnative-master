import React from "react";
import {FlatList, View, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import {AccentColor,  Medium, SecondaryTextColor} from "../../publics/Ui";
import MyCard from "../MyCard";
import MyText from "../MyText";
import {FetchDataFromAPI} from "../../publics/DataBase";
import {ForumPageCount} from "../../publics/Function";
import ForumSortingPage from "../../activities/ForumSortingPage";
import propTypes from "prop-types";
import {Actions} from "react-native-router-flux";
export default class ForumListSearch extends React.PureComponent {

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
                style={{backgroundColor: 'transparent', paddingBottom: 60}}>
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
                />
            </View>
        )
    }

    renderItem = item => {
        return (
            <TouchableOpacity
                onPress={() => Actions.ForumReplyList({item: item})}
            >
                <MyCard MyCardStyle={{height:147}}>
                    <View>
                        <MyText
                            text={item.Subject}
                            componentStyles={{fontSize: Medium ,color: AccentColor}}
                        />
                    </View>

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

                    <View>
                        <MyText
                            numberOfLines={1}
                            text={item.GroupName}
                            componentStyles={{color: SecondaryTextColor}}
                        />
                    </View>

                    <View>
                        <MyText
                            numberOfLines={3}
                            text={item.Description}

                        />
                    </View>

                </MyCard>

            </TouchableOpacity>
        )


    };

    fetchDataFromAPI() {


        let Parameter = JSON.stringify({
            OrderMode: this.props.OrderMode,
            Page: this.state.page,
            Search: this.props.Search,
        });


        FetchDataFromAPI("GetForumSearch", Parameter, (response) => {

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


}

ForumSortingPage.propTypes = {
    Search: propTypes.string,
    OrderMode: propTypes.number,
};