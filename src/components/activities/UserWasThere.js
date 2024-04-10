import React from 'react';
import BaseUi from "../basepage/BaseUi";
import {Actions} from "react-native-router-flux";
import {ActivityIndicator, FlatList, View} from "react-native";
import {AccentColor, SecondaryTextColor} from "../publics/Ui";
import MyText from "../customs/MyText";
import DescBadgeImageList from "../customs/List/DescBadgeImageList";
import {FetchDataFromAPI} from "../publics/DataBase";
import MyHeader from "../customs/MyHeader";
import {getCurrentLocation} from "../publics/Function";

export default class UserWasThere extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            data : [],
            noData : false
        }

    }

    async componentWillMount(): void {

        const CurrLocation = await getCurrentLocation();

        const Parameter = JSON.stringify({

            UserId: this.props.UserId,
            Latitude: CurrLocation.latitude,
            Longitude: CurrLocation.longitude

        });

        FetchDataFromAPI("getUserWasThere", Parameter, (response) => {

            this.setState({
                data: response.Response,
                noData: response.Response.length <= 0
            });

        }).done();

    }

    render(){
        return(

            <BaseUi>

                <MyHeader
                    showText={true}
                    text={'آنجا بوده است'}
                    buttonRightOnPress={() => {
                        Actions.pop();
                    }}
                />

                <FlatList
                    data={this.state.data}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => this.renderEmptyList()}
                />

            </BaseUi>

        );
    }

    renderItem({item}){

        return(

            <DescBadgeImageList
                UserId={item.ID}
                ProfileName={item.FullName}
                CityName={item.CityName}
                AreaName={item.AreaName}
                Distance={item.Distance}
                PhotoFileName={item.PhotoFileName}
                Rate={item.Rate}
                showDesc={false}
                showText={false}
            />

        );

    }

    renderEmptyList(){

        if (this.state.noData)
            return (
                <View style={{
                    marginTop : 20,
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

}