import React from "react";
import {
    AccentColor,
    height,

    PrimaryTextColor,
    SecondaryTextColor,
    Small,
    VerySmall
} from "../../publics/Ui";
import {Image, TouchableOpacity, View,ActivityIndicator} from "react-native";
import MyText from "../MyText";
import propTypes from "prop-types";
import {BaseURL, FetchDataFromAPI, ProfileAddress} from "../../publics/DataBase";
import MyCard from "../MyCard";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";


export default class CircleImageBadgeDescList extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            loading : false
        }

    }

    render() {
        return (

            <TouchableOpacity
                activeOpacity={1}
                onPress={() => Actions.ShowProfile({UserId : this.props.UserId})}>

                <MyCard>
                    <View>
                        <View style={{height: height * 0.07, flexDirection: 'row'}}>

                            <View style={{
                                width: '30%',
                                height: '100%'
                            }}>
                                <FastImage
                                    resizeMode='contain'
                                    style={{
                                        height: '55%',
                                        width: '33%',
                                        display : this.props.IsOnPlace ? 'flex' : 'none'
                                    }}
                                    source={require('../../../assets/images/icons/parking_blue.png')}
                                />

                            </View>

                            <View
                                style={{
                                    width: '70%',
                                    height: height * 0.07,
                                    justifyContent: 'flex-end',
                                    flexDirection: 'row'
                                }}>

                                <View style={{marginRight: 10}}>
                                    <MyText text={this.props.ProfileName}
                                            componentStyles={{
                                                fontSize: Small,
                                                color: PrimaryTextColor
                                            }}/>
                                    <MyText text={this.props.CityName}
                                            componentStyles={{color: SecondaryTextColor}}/>
                                </View>

                                <Image style={{
                                    height:50,
                                    width:50,
                                    borderRadius: 50 / 2,
                                }}
                                       source={{uri: BaseURL + ProfileAddress + this.props.PhotoFileName}}
                                />


                            </View>


                        </View>
                    </View>
                    <View
                        style={{marginTop:10}}>

                        <MyText
                            text={this.props.Description}
                            componentStyles={{
                                fontSize: Small,
                                color: SecondaryTextColor
                            }}
                        />

                    </View>

                    <View style={{flexDirection:'row',justifyContent:'flex-start'}}>
                        <MyText text={this.props.DescDateTime}
                                componentStyles={{
                                    fontSize: VerySmall,
                                    color: SecondaryTextColor}}/>
                    </View>

                    {this.renderOption()}

                </MyCard>

            </TouchableOpacity>
        )
    }

    renderOption(){

        if (this.state.loading)
            return (

                <View
                    style={{
                        position : 'absolute',
                        width : 40,
                        height : 35,
                        top : 10,
                        left : 5
                    }}>

                    <ActivityIndicator color={AccentColor} size={'small'}/>

                </View>

            );

        return(

            <TouchableOpacity
                style={{
                    position : 'absolute',
                    width : 40,
                    height : 35,
                    top : 10,
                    left : 5
                }}
                activeOpacity={.6}
                onPress={ () => Actions.ReportDialog({ Context : this.ReportData.bind(this) }) }>

                <FastImage
                    source={require('../../../assets/images/icons/menu.png')}
                    style={{ width : 20,height : 20 }}
                />


            </TouchableOpacity>

        )

    }

    ReportData(){

        this.setState({ loading : true });

        const Parameter = JSON.stringify({

            ReviewId : this.props.Id

        });

        FetchDataFromAPI("ReportReview",Parameter,(response) => {

            if (response.Success)
                Actions.ConfirmDialog({ Message : response.Message });
            else
                Actions.ExecptionDialog({ Message : response.Message });

        }).done( () => this.setState({ loading : false }) );

    }

}

CircleImageBadgeDescList.propTypes = {
    Id            : propTypes.string,
    ProfileName   : propTypes.string,
    CityName      : propTypes.string,
    Description   : propTypes.string,
    PhotoFileName : propTypes.string,
    DescDateTime  : propTypes.string,
    IsOnPlace     : propTypes.bool
};

CircleImageBadgeDescList.defaultProps = {
    PhotoFileName : '__profile.png',
    IsOnPlace     : false
};
