import React from 'react';
import {Actions} from "react-native-router-flux";
import {Image, TouchableWithoutFeedback, View} from "react-native";
import {MediaAddress, MediaURL} from "../publics/DataBase";
import { PlaceHolderColor, width} from '../publics/Ui';
import ProgressiveImage from "./ProgressiveImage";
import SlideCarImage from '../../assets/images/icons/slidecar.png';
import VideoImage from '../../assets/images/icons/VideoImage.png';
import TV from '../../assets/images/icons/television.png';
import MyText from "./MyText";
import FastImage from "react-native-fast-image";

export default class PostSquare extends React.PureComponent{

    constructor(props){
        super(props);

        this.state = {
            ShowDialog  : false
        };

        this.timer = null;
    }

    _onPressIn() {

        if (this.props.Post.GetPostTypeId !== "1")
            return;

        this.timer = setTimeout(() => {

            this.setState({ShowDialog: true});
            Actions.PostDialog({ item : this.props.Post });

        }, 300);

    }

    _onPressOut(){

        if (this.state.ShowDialog)
            Actions.pop();

        this.setState({
            ShowDialog  : false
        }, () => clearTimeout(this.timer))
    }

    render(){

        const { Post } = this.props;

        return(

            <View style={{paddingLeft: width * .75 / 100, paddingRight: width *.75 / 100, marginTop: width * 1.5 / 100}}>

                <TouchableWithoutFeedback
                    onPressIn={this._onPressIn.bind(this)}
                    onPressOut={this._onPressOut.bind(this)}
                    activeOpacity={.9}
                    delayLongPress={500}
                    onPress={()=> {

                            if (!this.state.ShowDialog)
                                Actions.MediaPost({Post})
                    }}>

                    <View>

                        {this.renderPostTypeImage(Post.PostType)}

                        <ProgressiveImage
                            style={{
                                backgroundColor:PlaceHolderColor,
                                width: width * 31.5 / 100,
                                height: width * 31.5 / 100,
                                borderRadius: 2
                            }}
                            thumbnailSource={{ uri: Post.GetPostTypeId === "1" ? MediaURL + MediaAddress + Post.ThumbnailName : Post.ThumbnailName  }}
                            imageSource={{ uri: Post.GetPostTypeId === "1" ? MediaURL + MediaAddress + Post.ThumbnailName : Post.ThumbnailName }}
                            thumbnailBlurRadius={10}
                            resizeMode={'cover'}
                        />

                        {this.renderProfileName(Post.FullName)}

                    </View>

                </TouchableWithoutFeedback>

            </View>
        )
    }

    renderPostTypeImage(PostType){

        let ImageName = null;

        switch (PostType) {

            case "GraphSidecar" : ImageName = SlideCarImage;break;
            case "LongVideo"    : ImageName = TV;break;
            case "GraphImage"   : ImageName = null;break;
            case "GraphVideo"   : ImageName = VideoImage;break;
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

}