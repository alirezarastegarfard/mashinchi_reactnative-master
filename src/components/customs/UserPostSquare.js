import React from 'react';
import {Image , TouchableOpacity , View} from "react-native";
import {MediaURL, UsersPostAddress} from "../publics/DataBase";
import { PlaceHolderColor, width} from '../publics/Ui';
import ProgressiveImage from "./ProgressiveImage";
import VideoImage from '../../assets/images/icons/VideoImage.png';
import MyText from "./MyText";
import {Actions} from 'react-native-router-flux';
import {VISIBLE} from "../publics/Constant";
import FastImage from "react-native-fast-image";

export default class UserPostSquare extends React.PureComponent{

    constructor(props){
        super(props);
    }

    render(){

        const { Post } = this.props;

        return(

            <View style={{paddingLeft: width * .75 / 100, marginLeft: width *.28 / 100, paddingRight: width *.75 / 100, marginTop: width * 1.5 / 100}}>

                <TouchableOpacity
                    activeOpacity={.9}
                    delayLongPress={500}
                    onPress={()=> {
                        Actions.UserShowPost({
                            PostData : Post ,
                            callback : (data) => this.props.onChangeData(data),
                            onRemove : () => this.props.onRemovePost(this.props.PostIndex)
                        });
                    }}>

                    <View>

                        {this.renderHiddenPost(Post.Visible)}

                        {this.renderPostTypeImage(Post.PostFileTypeId)}

                        <ProgressiveImage
                            style={{
                                backgroundColor:PlaceHolderColor,
                                width: width * 31.5 / 100,
                                height: width * 31.5 / 100,
                                borderRadius: 2
                            }}
                            thumbnailSource={{ uri:  MediaURL + UsersPostAddress + Post.ThumbnailName }}
                            imageSource={{ uri: MediaURL + UsersPostAddress + Post.ThumbnailName  }}
                            thumbnailBlurRadius={10}
                            resizeMode={'cover'}
                        />

                        {this.renderProfileName(Post.FullName)}

                    </View>

                </TouchableOpacity>

            </View>
        )
    }

    renderPostTypeImage(PostFileTypeId){

        let ImageName = null;

        switch (PostFileTypeId) {
            case "1"   : ImageName = null;break;
            case "2"   : ImageName = VideoImage;break;
        }

        if (ImageName !== null) {
            return (

                <FastImage
                    style={{
                        position: 'absolute',
                        right: 5,
                        top: 5,
                        width: 20,
                        height: 20,
                        zIndex : 1
                    }}
                    source={ImageName}
                    resizeMode={'stretch'}
                />
            );

        }else
            return null;
    }

    renderProfileName(FullName){

        const { ShowName = false } = this.props;

        if (!ShowName)
            return null;

        return(

            <View style={{
                backgroundColor:'rgba(0,0,0,.5)',
                alignItems : 'center',
                justifyContent : 'center',
                height : '20%',
                width : '100%',
                position: 'absolute',
                bottom : 0
            }}>

                <MyText
                    componentStyles={{
                        color : 'white',
                        textAlign : 'right',
                        width : '95%'
                    }}
                    numberOfLines={1}
                    text={FullName}
                />

            </View>

        );

    }

    renderHiddenPost(Hidden) {

        if (Hidden === VISIBLE)
            return null;

        return (

            <View
                style={{
                    width : '100%',
                    height : '100%',
                    backgroundColor : 'rgba(0,0,0,.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position : 'absolute',
                    top : 0,
                    left : 0,
                    zIndex: 2
                }}>

                <FastImage
                    source={require('../../assets/images/icons/hidden.png')}
                    style={{ width : 40 , height : 40 }}
                    resizeMode={'contain'}
                />

            </View>


        );

    }
}