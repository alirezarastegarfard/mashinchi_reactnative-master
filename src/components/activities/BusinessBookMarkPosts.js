import React from 'react';
import BaseUi from "../basepage/BaseUi";
import {AccentColor, backColor, SecondaryTextColor} from "../publics/Ui";
import MyHeader from "../customs/MyHeader";
import {ActivityIndicator, FlatList, View} from "react-native";
import {PageCount} from "../publics/Function";
import PostSquare from "../customs/PostSquare";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import MyText from "../customs/MyText";
import {setProfilePostSync} from "../publics/FuncLibs";

class BusinessBookMarkPosts extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data : [],
            page : 1,
            refreshing : false,
            EndList : false,
            ListLoading : false,
        };

        setProfilePostSync( (postId) => this.removeSavedPost(postId) );

    }

    componentDidMount(): void {
        this.fetchDataAPI();
    }

    render(){

        return(

            <BaseUi
                 ViewStyle={{
                     flex : 1,
                     backgroundColor : backColor
                 }}>


                <MyHeader
                    showText
                    text={'پست های نشان شده'}
                />

                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.renderSavePostItem(item)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    refreshing={this.state.refreshing}
                    keyExtractor={(item,index) => index.toString() }
                    ListEmptyComponent={() => this.renderEmptyList() }
                    onRefresh={this.handleRefresh.bind(this)}
                    onEndReached={this.onEndPage.bind(this)}
                    ListFooterComponent={this.getRenderFooter.bind(this)}
                    onEndReachedThreshold={1}
                />


            </BaseUi>

        );

    }

    renderSavePostItem({item}){

        return (
            <PostSquare
                Post={item}
            />
        );

    }

    handleRefresh(){
        this.setState({page : 1 , refreshing : true , data : []}, () =>
            this.fetchDataAPI());
    };

    onEndPage(){
        if (this.state.EndList)
            return;

        if (this.state.data.length >= PageCount){
            this.setState({page : this.state.page + 1 , ListLoading:true},() =>
                this.fetchDataAPI());
        }

    }

    getRenderFooter(){

        if (this.state.data.length <= 0) return null;

        if (this.state.ListLoading)
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        else
            return null;
    }

    renderEmptyList(){

        if (!this.state.noData && !this.state.refreshing){
            return <ActivityIndicator color={AccentColor} size={"large"}/>;
        }else
            return (
                <View style={{justifyContent : 'center',alignItems : 'center',marginTop:20}}>

                    <MyText
                        componentStyles={{color : SecondaryTextColor , fontSize : 16}}
                        text={"اطلاعاتی برای نمایش وجود ندارد"} />

                </View>
            );

    }


    fetchDataAPI(){

        let Parameter = JSON.stringify({
            UserId      : this.props.User.ID,
            page        : this.state.page,
            SavePosts   : true
        });

        FetchDataFromAPI("getPosts",Parameter, (response) => {

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
                        refreshing: false,
                        EndList : false
                    }
                });
            }else
                this.setState({refreshing : false,ListLoading : false});

        }).done( () => this.setState({refreshing : false,ListLoading : false , noData : this.state.data.length <= 0}) );

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

}

const mapStateToProps = (states) => {
    return { User : states.User };
};

export default connect(mapStateToProps)(BusinessBookMarkPosts);