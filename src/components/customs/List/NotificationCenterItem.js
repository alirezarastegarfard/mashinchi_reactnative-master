import React from 'react';
import {View,TouchableOpacity,Image} from 'react-native';
import {BaseURL, MediaAddress, MediaURL, ProfileAddress, UsersPostAddress} from "../../publics/DataBase";
import propTypes from 'prop-types';
import MyText from "../MyText";
import {PrimaryTextColor, SecondaryTextColor, Small, VerySmall} from "../../publics/Ui";
import {Actions} from 'react-native-router-flux';
import {ScreenWidth} from "../../publics/Function";

export default class NotificationCenterItem extends React.Component{

    constructor(props){
        super(props);
    }

    render(){


        return(

            <TouchableOpacity
                style={{
                    flexDirection   : 'row',
                    width           : ScreenWidth,
                    minHeight       : 60,
                    alignItems      : 'flex-start',
                    justifyContent  : 'flex-end',
                    paddingRight    : 5,
                    paddingLeft     : 5,
                    marginTop       : 5,
                    marginBottom    : 5
                }}
                activeOpacity={.4}
                onPress={this.onItemClick.bind(this)}>

                <View
                    style={{
                        justifyContent : 'center',
                        alignItems : 'center',
                        width : 50,
                        height : 50
                    }}>

                    {this.renderImage()}

                </View>


                <View
                    style={{
                        width : ScreenWidth - 110,
                        justifyContent : 'center',
                        alignItems : 'flex-end',
                        paddingRight : 5,
                        paddingLeft  : 5,
                        minHeight    : 45
                    }}>

                    <MyText
                        componentStyles={{
                            fontSize : Small,
                            color    : PrimaryTextColor
                        }}
                        text={`${this.props.data.FullName} ${this.props.data.NotifyType}`}
                    />

                    <MyText
                        componentStyles={{
                            display : this.props.data.Description === '' ? 'none' : 'flex',
                            fontSize : VerySmall,
                            color    : SecondaryTextColor
                        }}
                        text={`${this.getTypeTitle() + this.props.data.Description}`}
                    />

                </View>

                <TouchableOpacity
                    style={{
                        width : 50,
                        height : 50,
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}
                    activeOpacity={.6}
                    onPress={ () => Actions.ShowProfile({ UserId : this.props.data.ActionUserId })}>

                    <Image
                        style={{
                            width  : 50,
                            height : 50,
                            borderRadius : 50 / 2,
                            justifyContent : 'center',
                            alignItems : 'center'
                        }}
                        source={{ uri : BaseURL + ProfileAddress + this.props.data.PhotoFileName }}
                    />

                </TouchableOpacity>


            </TouchableOpacity>

        );
    }

    getTypeTitle(){

        switch (this.props.data.NotifyTypeId) {

            case "3" : return "نظر : ";
            case "2" : return "نقد و بررسی : ";
            case "6" : return "عنوان : ";
            case "7" : return "پاسخ : ";
            case "8" : return "پاسخ : ";
            case "9" : return "پاسخ : ";
            default  : return "";
        }

    }

    renderImage() {

        const ImageName = this.props.data.ImageName;

        if (ImageName === '' || ImageName === undefined)
            return null;

        let Source = null;

        if (ImageName.substring(0,4) === 'http')
            Source = { uri : ImageName };
        else if (this.props.data.NotifyTypeId === "6")
            Source = { uri : MediaURL + UsersPostAddress + ImageName };
        else
            Source = { uri : MediaURL + MediaAddress + ImageName };

        return(

            <Image
                source={Source}
                style={{
                    width: 50,
                    height: 50
                }}
                resizeMode={'cover'}
            />

        );

    }

    onItemClick(){

        const data = this.props.data;

        switch (data.NotifyTypeId) {
            case "1" : Actions.MediaPost({ PostId : data.ReferenceId , isGetPost : true });break;
            case "2" : Actions.ShowReviewDialog({ ReviewId : data.ReferenceId , ReviewDescription : data.Description, ReviewerName : data.FullName });break;
            case "3" : Actions.MediaPostWithComment({ CommentId : data.ReferenceId });break;
            case "4" : Actions.ShowProfile({ UserId : data.ActionUserId });break;
            case "5" : Actions.ShowProfile({ UserId : data.ActionUserId });break;
            case "6" : Actions.UserShowPost({ UserPostId : data.ReferenceId });break;
            case "7" : Actions.ForumReplyList({ AnswerId : data.ReferenceId });break;
            case "8" : Actions.ForumReplyList({ AnswerId : data.ReferenceId });break;
            case "9" : Actions.ForumReplyList({ AnswerId : data.ReferenceId });break;
        }

    }
}

NotificationCenterItem.propTypes = {
    data : propTypes.object.isRequired
};