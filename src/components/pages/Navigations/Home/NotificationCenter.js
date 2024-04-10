import React from 'react';
import {FlatList, View} from 'react-native';
import {connect} from "react-redux";
import {AccentColor, backColor, SecondaryTextColor} from "../../../publics/Ui";
import MyHeader from "../../../customs/MyHeader";
import BaseUi from "../../../basepage/BaseUi";
import {FetchDataFromAPI} from "../../../publics/DataBase";
import HeaderNotificationCenter from "../../../customs/List/HeaderNotificationCenter";
import NotificationCenterItem from "../../../customs/List/NotificationCenterItem";
import MyText from "../../../customs/MyText";

const TodayHeader     = { Type : 1 , Title : "امروز" };
const YesterdayHeader = { Type : 2 , Title : "دیروز" };
const EarlyHeader     = { Type : 3 , Title : "قدیمی تر" };

class NotificationCenter extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data : [],
            Loading : false,
            refreshing : false,
            noData : false
        }

    }

    componentWillMount(): void {
        this.fetchDataAPI();
    }

    fetchDataAPI(){
        this.setState({ Loading : true });

        const Parameter = JSON.stringify({
            UserId : this.props.User.ID
        });

        FetchDataFromAPI("getNotificationCenter",Parameter,(response) => {

            let TodayData     = [];
            let YesterdayData = [];
            let EarlyData     = [];

            if (response.Response.TodayData !== null)
                TodayData = [TodayHeader,...response.Response.TodayData];

            if (response.Response.YesterdayData !== null)
                YesterdayData = [YesterdayHeader,...response.Response.YesterdayData];

            if (response.Response.EarlyData !== null)
                EarlyData = [EarlyHeader,...response.Response.EarlyData];

            const NotifyData = [...TodayData,...YesterdayData,...EarlyData];

            this.setState({ data : NotifyData , noData : NotifyData.length <= 0 });

        }).done( () => this.setState({ Loading : false , refreshing : false }) );
    }

    render(){
        return(

            <BaseUi
                Loading={this.state.Loading && !this.state.refreshing}
                ViewStyle={{
                    backgroundColor : backColor,
                    flex : 1
                }}>

                <MyHeader
                    buttonRightShowing={false}/>

                <FlatList
                    data={this.state.data}
                    keyExtractor={ (item,index) => index.toString() }
                    renderItem={ ({item}) => this.renderItems(item) }
                    onRefresh={this.handleRefresh.bind(this)}
                    ListEmptyComponent={ () => this.renderEmptyList(this.state.noData) }
                    refreshing={this.state.refreshing}
                />

            </BaseUi>

        );
    }
    
    renderItems(item){

        if (item.Type !== undefined)
            return <HeaderNotificationCenter Title={item.Title}/>;
        else
            return <NotificationCenterItem data={item}/>;
    }

    handleRefresh(){
        this.setState({refreshing : true , data : []}, () =>
            this.fetchDataAPI());
    };

    renderEmptyList(noData) {

        if (!noData) {
            return null;
        } else
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 20}}>

                    <MyText
                        componentStyles={{color: SecondaryTextColor, fontSize: 16}}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>

                </View>
            );
    }
}

const mapStateToProps = (states) => {

    return {User : states.User}

};

export default connect(mapStateToProps)(NotificationCenter);