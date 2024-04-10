import React from 'react';
import {connect} from 'react-redux';
import {Image, View, Dimensions, Animated} from "react-native";
import {
    backColor,

    PrimaryTextColor,
    SecondaryTextColor, VerySmall
} from "../publics/Ui";
import { MediaAddress, MediaURL } from '../publics/DataBase';
import styles from "../publics/homeStyle";
import MyText from "../customs/MyText";
import ProgressiveImage from "../customs/ProgressiveImage";
import Video from "../../../custom_package/react-native-video";
import Animation from 'lottie-react-native';
import EStyleSheet from "react-native-extended-stylesheet";

const ScreenWidth = Dimensions.get('window').width * .95;
const ScreenHeight = Dimensions.get('window').height * .4;

class PostDialog extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            loading : false,
            PostHeight : ScreenHeight,
            opacity : new Animated.Value(0)
        };
    }

    componentWillMount() {

        const { item } = this.props;

        let post = item.Posts[0];

        const Width  = post.Width;
        const Height = post.Height;

        const PostHeight = ((Height * ScreenWidth) / Width);
        this.setState({ PostHeight });

        Animated.timing(this.state.opacity,{
            toValue : 1,
            duration : 200
        }).start();

    }

    render() {

        const  { item } = this.props;

        return (

            <Animated.View
                style={[DialogStyle.container , {
                    opacity : this.state.opacity
                }]}>

                <View style={{
                    width : ScreenWidth,
                    height : this.state.PostHeight + 50,
                    justifyContent: 'flex-start' ,
                    alignItems: 'flex-start' ,
                    backgroundColor : backColor ,
                    borderRadius : 4
                }}>

                    <View
                        style={{
                            width : '100%',
                            height : 50,
                            justifyContent: 'flex-end',
                            alignItems : 'center',
                            flexDirection: 'row',
                            paddingTop: 5,
                            paddingBottom : 5,
                            paddingRight : 5
                        }}>

                        <View
                            style={{
                                flex : .8,
                                justifyContent: 'center',
                                marginRight: '2%'
                            }}>

                            <MyText
                                text={item.FullName}
                                componentStyles={{color : PrimaryTextColor}}
                            />

                            <MyText
                                componentStyles={{
                                    fontSize: VerySmall,
                                    color : SecondaryTextColor
                                }}
                                text={item.PersianDate}
                            />

                        </View>

                        <View
                            style={[styles.ProfileBackCircle,{marginRight : '1.5%'}]}>

                            <Image
                                style={[styles.ProfileCircleStyle,{margin : 0}]}
                                source={{uri: MediaURL + MediaAddress + item.ProfilePhotoName }}
                            />

                        </View>

                    </View>

                    <View style={{width : '100%' , height : .5 , backgroundColor : 'rgba(0,0,0,.2)'}}/>

                    <View style={{
                        width: '100%',
                        height: this.state.PostHeight ,
                        justifyContent : 'center' ,
                        alignItems : 'center'
                    }}>
                        {this.renderLoading()}
                        {this._renderPage()}
                    </View>

                </View>

            </Animated.View>
        );
    }

    _renderPage(){

        const { item } = this.props;

        let post = item.Posts[0];

        return(

                <View
                    key={post.SlideId}
                    style={{
                        width : '100%',
                        height : '100%',
                        justifyContent : 'center',
                        alignItems :'center'
                    }}>

                    { post.IsVideo === "0" ?

                        <ProgressiveImage
                            thumbnailSource={{ uri: MediaURL + MediaAddress + post.PostName  }}
                            imageSource={{ uri: MediaURL + MediaAddress + post.PostName  }}
                            style={{width: '100%', height: '100%'}}
                            thumbnailBlurRadius={10}
                        />

                        :

                        this.renderVideoComponent(post)

                    }

                </View>
        );

    }

    renderVideoComponent(post){

        return(

            <Video
                style={{width: '100%', height: '100%'}}
                source={{ uri : MediaURL + MediaAddress + post.PostName , cache: true }}
                ref={(ref) => this.playerRef = ref }
                rate={1.0}
                volume={1}
                paused={false}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch={"ignore"}
                onLoadStart={() => this.setState({loading : true })}
                onLoad={ () => this.setState({ loading : false })}
                onBuffer={ (e) => this.setState({loading : e.isBuffering }) }
                onEnd={()=>  this.playerRef.seek(0) }
            />

        );

    }

    renderLoading(){

        if (this.state.loading) {

            return (
                <Animation
                    source={require('../../assets/lottie/loading')}
                    autoPlay
                    loop
                    style={{
                        width: 75,
                        height: 75,
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf:'center'
                    }}/>
            );
        }else
            return null;

    }
}

const DialogStyle = EStyleSheet.create({
    container : {
        backgroundColor: 'rgba(52,52,52,.5)',
        position: 'absolute',
        top : 0 ,
        bottom : 0,
        left : 0,
        right : 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


const mapStateToProps = (states) => {
    return { User : states.User }
};

export default connect(mapStateToProps)(PostDialog);