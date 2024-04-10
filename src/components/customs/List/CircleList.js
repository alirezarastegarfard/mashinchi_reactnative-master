import React from "react";
import {FlatList, View, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import propTypes from "prop-types";
import {AccentColor, SecondaryTextColor, Small} from "../../publics/Ui";
import MyText from "../MyText";
import {BaseURL, ChatFileAddress, FetchDataFromAPI, ForumGroupImage} from "../../publics/DataBase";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";



export default class CircleList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillMount() {
        this.fetchDataFromAPI();
    }
    fetchDataFromAPI() {
        this.setState({ListLoading: true});

        let Parameter = JSON.stringify({
            BrandID: this.props.BrandSelected,
        });

        FetchDataFromAPI("GetForumGroup", Parameter, (response) => {


            if (response.Response === null) {
                this.setState({ListLoading: false});
                return;
            }

            if (response.Response.length > 0) {
                this.setState({data: response.Response});
            } else
                this.setState({ListLoading: false});


        }).done(() => this.setState({ListLoading: false, EmptyList: this.state.data.length <= 0}))

    }

    renderEmptyList(){



        if (this.state.EmptyList)
            return (
                <View style={{      transform: [{scaleX: -1}],justifyContent: 'center', alignItems: 'center', marginTop: 20}}>
                    <MyText
                        componentStyles={{ fontSize : Small , color : SecondaryTextColor}}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>
                </View>
            );
        else
            return <ActivityIndicator color={AccentColor} size={"large"}/>;

    }


    render() {

        return (
            <View
                style={{transform: [{scaleX: -1}], backgroundColor: 'transparent'}}>
                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item) => item.ID.toString()}
                    numColumns={3}
                    ListEmptyComponent={() => this.renderEmptyList()}

                />
            </View>
        )
    }

    renderItem = item => {
        return (
            <TouchableOpacity
                onPress={()=>Actions.ForumSortingPage({connectionID:item.connectionID,GroupName:item.GroupName})}
                style={{
                transform: [{scaleX: -1}],
                height: 120, width: '33.33%', justifyContent: 'center', alignItems: 'center'
            }}>
                <FastImage
                    resizeMode={'cover'}
                    source={{uri: BaseURL + ForumGroupImage+item.GroupImage}}
                    style={{
                        height: 90,
                        width:90,
                        borderRadius: 90/ 2,
                        marginBottom: 5
                    }}
                />
                <MyText
                    componentStyles={{
                        color: SecondaryTextColor,
                        fontSize: Small,
                    }}
                    text={item.GroupName}/>
            </TouchableOpacity>
        )


    }

}

CircleList.propTypes = {
    data: propTypes.array
};