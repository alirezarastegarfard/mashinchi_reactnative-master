import React from 'react';
import {Image, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {
    AccentColor,
    badgeColor,
   MiniSize,

    SecondaryTextColor,
    Small,
    VerySmall
} from "../../publics/Ui";
import MyText from "../../customs/MyText";
import propTypes from 'prop-types';
import {BaseURL, FetchDataFromAPI, ProfileAddress} from "../../publics/DataBase";
import {Actions} from 'react-native-router-flux';
import MyCard from "../MyCard";
import {ScreenWidth} from "../../publics/Function";
import FastImage from "react-native-fast-image";


const ItemHeight = 70;
export default class DescBadgeImageList extends React.PureComponent {

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
                <MyCard containerStyle={{padding: 5, elevation: 7}}>
                    <View style={{
                        flexDirection: 'row',
                        height: ItemHeight,
                        justifyContent:'flex-end'
                    }}>
                        <View style={{height: 25, width: 60, paddingTop: 5,}}>
                            {this.renderBadge()}
                        </View>
                        <View style={{height: ItemHeight, width: ScreenWidth - 165, paddingRight: 10}}>
                            <MyText text={this.props.ProfileName}
                                    componentStyles={{fontSize: Small}}/>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <MyText text={this.props.AreaName}
                                        componentStyles={{color: SecondaryTextColor}}/>
                                <MyText text={' _ '}
                                        componentStyles={{color: SecondaryTextColor}}/>
                                <MyText text={this.props.CityName}
                                        componentStyles={{color: SecondaryTextColor}}/>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <MyText text={this.props.Distance}
                                        componentStyles={{color: SecondaryTextColor}}/>
                            </View>
                        </View>
                        <View
                            style={{
                                height: 60,
                                width: 60,
                                justifyContent: 'center',
                                alignItems:'center'
                            }}>
                            <Image
                                style={{height: 60, width: 60, borderRadius: 12}}
                                source={{uri: BaseURL + ProfileAddress + this.props.PhotoFileName }}
                            />
                        </View>


                    </View>

                    {this.renderOption()}

                    {this.renderDesc()}

                    {this.renderDateTime()}

                </MyCard>

            </TouchableOpacity>

        );
    }

    renderBadge() {
        if (!this.props.showText) {
            return(
                <View
                    style={{
                        height: 25,
                        width: 55,
                        backgroundColor: badgeColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 7,paddingRight:3
                    }}>

                    <FastImage
                        resizeMode='contain'
                        style={{height: '70%', width: '47%', borderRadius: 12, marginRight: 4}}
                        source={require('../../../assets/images/icons/star_empty.png')}

                    />
                    <MyText text={this.props.Rate}
                            componentStyles={{color: 'white', fontSize: VerySmall}}/>
                </View>
            );
        }

    }

    renderDateTime(){

        if (this.props.showText) {
            return(
                <View
                    style={{
                        justifyContent:'center',
                        alignItems : 'flex-start'
                    }}>

                    <MyText text={this.props.DescDateTime}
                            componentStyles={{
                                color: SecondaryTextColor,
                                fontSize: MiniSize,
                                marginTop : 5
                            }}/>
                </View>
            );
        }

    }

    renderDesc() {

        if (this.props.showDesc) {
            return(
                <View style={{marginTop:2}}>
                    <MyText text={this.props.Description}
                            componentStyles={{ fontSize: VerySmall}}/>
                </View>

            );


        }

    }

    renderOption(){

        if (!this.props.ShowOption)
            return null;

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
                onPress={ () => Actions.EditReviewDialog({ Context : this }) }
            >

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

    onEditClick(){

        Actions.CriticizeDialog({
            LastReview       : this.props.Description ,
            LastReviewId     : this.props.Id ,
            BusinessFullName : this.props.ProfileName,
            onReviewSave     : (newData) => {
                if (this.props.onReviewSave !== null)
                    this.props.onReviewSave(newData , this.props.Index);
            }
        });

    }

    RemoveClick(){
        Actions.QuestionDialog({

            Message : 'آیا برای حذف نقد و بررسی اطمینان دارید؟',
            onConfirm : () => {

                this.setState({ loading : true });

                const Parameter = JSON.stringify({
                    ReviewId : this.props.Id
                });

                FetchDataFromAPI("removeProfileReview",Parameter,(response) =>{

                    if (!response.Success){
                        Actions.ExceptionDialog({ Message : response.Message });
                        return;
                    }

                    if (this.props.onRemoveClick !== null)
                        this.props.onRemoveClick(this.props.Index);

                }).done( () => this.setState({ loading : false }) );

            }

        });

    }
}

DescBadgeImageList.propTypes = {
    Id            : propTypes.string,
    Index         : propTypes.number,
    UserId        : propTypes.string,
    ProfileName   : propTypes.string,
    AreaName      : propTypes.string,
    CityName      : propTypes.string,
    Description   : propTypes.string,
    showDesc      : propTypes.bool,
    showText      : propTypes.bool,
    Distance      : propTypes.string,
    PhotoFileName : propTypes.string,
    DescDateTime  : propTypes.string,
    Rate          : propTypes.string,
    ShowOption    : propTypes.bool,
    onReviewSave  : propTypes.func,
    onRemoveClick : propTypes.func
};

DescBadgeImageList.defaultProps = {
    showDesc       : false,
    showText       : false,
    Distance       : '',
    PhotoFileName  : '__profile.png',
    Rate           : '0',
    ShowOption     : false,
    onReviewSave   : null,
    onRemoveClick  : null,
    Index          : 0
};

