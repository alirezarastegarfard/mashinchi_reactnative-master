import React from 'react';
import propTypes from 'prop-types';
import {Image, View , TouchableOpacity} from "react-native";
import MyText from "../../customs/MyText";
import {
    MiniSize,
    PrimaryTextColor,
    RedCircle,
    SecondaryTextColor,
    Small,
    VerySmall
} from "../../publics/Ui";
import {BaseURL, ProfileAddress} from "../../publics/DataBase";
import {ProfileCircleImageSize} from '../../activities/Comment'
import {Actions} from 'react-native-router-flux';

export default class CommentListItem extends React.PureComponent{

    constructor(props){
        super(props);

        this.state = {
            Selected : this.props.Selected
        }

    }

    render() {

        return (
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                    paddingTop: 10,
                    justifyContent: 'flex-end',
                    backgroundColor : this.state.Selected ? 'rgba(56,151,241,.3)' : 'white'
                }}
                activeOpacity={1}
                onPress={ () => {

                    if (!this.props.isSelectable && !this.state.Selected)
                        return;

                    this.setState({ Selected : !this.state.Selected }, () => {

                        if (this.state.Selected)
                            this.props.onCommentSelected(this.props.CommentId , this.props.ProfileId , this.props.index);
                        else
                            this.props.onCommentSelected(0 , 0 , -1);

                    });

                }}>

                <View style={{
                    flex: .2,
                    flexDirection: 'row',
                    paddingLeft: 5,
                }}>
                    <MyText
                        text={this.props.CommentDateTime}
                        componentStyles={{
                            color: SecondaryTextColor,
                            fontSize: MiniSize
                        }}
                    />
                </View>

                <View
                    style={{
                        flex: .8,
                        justifyContent: 'center',
                        marginRight: '2%'
                    }}>

                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={() => Actions.ShowProfile({ UserId : this.props.ProfileId }) }>
                        <MyText
                            text={this.props.CommentUserName}
                            componentStyles={{color: PrimaryTextColor,   fontSize: Small}}
                        />
                    </TouchableOpacity>

                    <MyText
                        componentStyles={{
                            fontSize:VerySmall,
                            color: SecondaryTextColor
                        }}
                        text={this.props.Comment}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={1}
                    style={{
                        width: ProfileCircleImageSize + 7,
                        height: ProfileCircleImageSize + 7,
                        borderRadius: (ProfileCircleImageSize + 7) / 2,
                        borderWidth: 2,
                        borderColor: RedCircle,
                        justifyContent: 'center',
                        alignItems: 'center', marginRight: '1.5%',
                    }}
                    onPress={() => Actions.ShowProfile({ UserId : this.props.ProfileId }) }>

                    <Image
                        style={{
                            width: ProfileCircleImageSize,
                            height: ProfileCircleImageSize,
                            borderRadius: ProfileCircleImageSize / 2,
                            margin: 0
                        }}
                        source={{uri: BaseURL + ProfileAddress + this.props.PhotoFileName}}
                    />

                </TouchableOpacity>


            </TouchableOpacity>
        );
    }

}

CommentListItem.propTypes = {
    ProfileId         : propTypes.string,
    CommentId         : propTypes.string,
    CommentUserName   : propTypes.string,
    Comment           : propTypes.string,
    CommentDateTime   : propTypes.string,
    PhotoFileName     : propTypes.string,
    onCommentSelected : propTypes.func,
    isSelectable      : propTypes.bool,
    index             : propTypes.number,
    Selected          : propTypes.bool
};

CommentListItem.defaultProps = {
    isSelectable : true,
    Selected : false
};