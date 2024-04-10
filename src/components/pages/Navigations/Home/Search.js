import React, {Component} from 'react';
import MySearchBar from "../../../customs/MySearchBar";
import BaseUi from "../../../basepage/BaseUi";
import {AccentColor, AppFont, backColor, SecondaryTextColor, width} from "../../../publics/Ui";
import {SceneMap, TabBar, TabView} from "react-native-tab-view";
import {View,StyleSheet} from "react-native";
import BusinessSearch from "../../Searchs/BusinessSearch";
import NewsSearch from "../../Searchs/NewsSearch";
import VideoSearch from "../../Searchs/VideoSearch";
import PostsSearch from "../../Searchs/PostsSearch";
import {connect} from "react-redux";

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SearchText : '',
            isActiveSort : false,
            index: 3,
            routes: [
                {key: 'news'    , title: 'اخبار'},
                {key: 'posts'   , title: 'رسانه'},
                {key: 'videos'  , title: 'ویدیو'},
                {key: 'business', title: 'مشاغل'}
            ],
        }
    }



    render() {

        return (
            <BaseUi ViewStyle={{backgroundColor:backColor}}>
                <MySearchBar
                    onTextCompleted={(SearchText , isActiveSort) => this.onTextCompleted(SearchText , isActiveSort)}
                    onSortClicked={ (Active) => this.onSortClick(Active) }
                />
                <View style={{flex:1}}>
                    <TabView
                        style={this.props.style}
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderTabBar={(props) => this._renderTabBar(props)}
                        onIndexChange={(index) => this._handleIndexChange(index)}
                    />
                </View>


            </BaseUi>
        )
    }

    onTextCompleted(SearchText , isActiveSort){

        this.setState({SearchText , isActiveSort} , () => {
            this.searchDataOnPages();
        });
    }

    _renderScene = SceneMap({
        news    : () => <NewsSearch     ref={(news) => this.NewsSearch = news}/>,
        posts   : () => <PostsSearch    ref={(posts) => this.PostSearch = posts} UserId={this.props.User.ID}/>,
        videos  : () => <VideoSearch    ref={(videos) => this.VideoSearch = videos} UserId={this.props.User.ID}/>,
        business: () => <BusinessSearch ref={(business) => this.BusinessProfile = business}/>
    });

    _renderTabBar(props) {

        return (

            <TabBar
                {...props}
                scrollEnabled
                useNativeDriver
                indicatorStyle={styles.indicator}
                style={styles.tabbar}
                tabStyle={styles.tab}
                labelStyle={styles.label}
            />
        );
    }

    _handleIndexChange(index) {
        this.setState({index}, () => this.searchDataOnPages());
    }

    searchDataOnPages(){

        switch (this.state.index) {
            case 0 : this.NewsSearch     .searchData(this.state.SearchText,this.state.isActiveSort);break;
            case 1 : this.PostSearch     .searchData(this.state.SearchText,this.state.isActiveSort);break;
            case 2 : this.VideoSearch    .searchData(this.state.SearchText,this.state.isActiveSort);break;
            case 3 : this.BusinessProfile.searchData(this.state.SearchText,this.state.isActiveSort);break;
        }

    }

    onSortClick(Active) {
        this.setState({ isActiveSort : Active } , () =>{
            this.searchDataOnPages();
        })

    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tabbar: {
        backgroundColor: backColor,
        height:50,
    },
    tab: {
        width: width / 4,
    },
    indicator: {
        backgroundColor: AccentColor,
    },
    label: {
        fontWeight: '400',
        color: SecondaryTextColor,
        fontFamily : AppFont,
    },
});

const mapStateToProps = (states) => {

    return { User : states.User };

};

export default connect(mapStateToProps)(Search);
