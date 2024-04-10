import React from 'react';
import {FetchDataFromAPI} from "../../publics/DataBase";
import {ActivityIndicator, FlatList, View} from "react-native";
import MyText from "../../customs/MyText";
import {AccentColor, SecondaryTextColor} from "../../publics/Ui";
import {PageCount} from "../../publics/Function";
import DescVideoList from "../../customs/List/DescVideoList";
import {GET_POST_TYPE_INSTAGRAM, GET_POST_TYPE_LONGVIDEO} from "../../publics/Constant";

export default class VideoSearch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            SearchText: '',
            isActiveSort : false,
            noData: false,
            Page: 1,
            refreshing: false,
            ListLoading: false,
            EndList: false
        }

    }

    searchData = (SearchText,isActiveSort) => {

        if (SearchText === this.state.SearchText && isActiveSort === this.state.isActiveSort && this.state.data.length > 0)
            return;

        this.setState({Page: 1, noData: false, data: [], SearchText , isActiveSort}, () => this.fetchDataAPI());

    };

    componentWillMount(): void {
        this.fetchDataAPI();
    }

    fetchDataAPI() {

        const Parameter = JSON.stringify({
            SearchText   : this.state.SearchText,
            UserId       : this.props.UserId,
            Page         : this.state.Page,
            isSort       : this.state.isActiveSort,
            GetPostType  : GET_POST_TYPE_LONGVIDEO
        });

        FetchDataFromAPI("SearchPosts", Parameter, (response) => {

            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }

            if (this.state.Page > 1 && response.Response.length <= 0) {
                this.setState({EndList: true});
                return;
            }

            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.Page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false,
                        noData: response.Response.length <= 0,
                        EndList: false
                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});

        }).done(() => this.setState({refreshing: false, ListLoading: false, noData: this.state.data.length <= 0}));


    }

    render() {
        return (

            <FlatList
                data={this.state.data}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => this.renderEmptyList()}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh.bind(this)}
                onEndReached={this.onEndPage.bind(this)}
                onEndReachedThreshold={.5}
                ListFooterComponent={this.getRenderFooter.bind(this)}
            />

        );
    }

    renderEmptyList() {

        if (this.state.refreshing)
            return null;

        if (this.state.noData)
            return (
                <View style={{
                    marginTop: 20,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <MyText
                        componentStyles={{

                            color : SecondaryTextColor
                        }}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>
                </View>
            );
        else
            return <ActivityIndicator color={AccentColor} size={"large"}/>;

    }

    handleRefresh() {
        this.setState({Page: 1, refreshing: true, data: []}, () =>
            this.fetchDataAPI());
    };

    onEndPage() {

        if (this.state.EndList)
            return;

        if (this.state.data.length >= PageCount) {
            this.setState({Page: this.state.Page + 1, ListLoading: true}, () =>
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

    renderItem({item}) {

        return (

            <DescVideoList
                MediaId={item.PostId}
                MediaTitle={item.PostTitle}
                MediaDateTime={item.PersianDate}
                ViewCount={item.ViewCount}
                ThumbnailName={item.ThumbnailName}
                VideoName={item.Posts[0].PostName}
                UserName={item.UserName}
                Duration={item.Duration}
            />

        );
    }

}
