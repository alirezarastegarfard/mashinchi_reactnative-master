import React from "react";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {AppFont, backColor, BorderColor, ButtonColor, CancelColor, height} from "../publics/Ui";
import {Image, View, ScrollView, TextInput,StyleSheet} from "react-native";
import MyButton from "../customs/MyButton";
import {Actions} from 'react-native-router-flux';
import {connect} from "react-redux";
import propTypes from 'prop-types';
import {FetchDataFromAPI} from "../publics/DataBase";
import {ScreenWidth} from "../publics/Function";
import FastImage from "react-native-fast-image";

class SendPost extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Caption   : '',
            Loading   : false,
            imageData : {
                uri: `data:${this.props.ImageData.mime};base64,` + this.props.ImageData.data,
                width: this.props.ImageData.width,
                height: this.props.ImageData.height
            }
        }

    }


    render() {
        return (
            <BaseUi
                ViewStyle={{flex : 1, BackgroundColor: backColor}}
                Loading={this.state.Loading}>

                <MyHeader
                    buttonLeftShowing={false}
                    buttonRightShowing={false}
                    showText={true}
                    text={'ارسال عکس'}
                />

                <ScrollView>

                    <View style={{padding: 8}}>

                        <FastImage style={PageStyle.imgStyle}
                               source={this.state.imageData}
                        />

                        <View style={PageStyle.inputStyleView}>

                            <TextInput
                                underlineColorAndroid='transparent'
                                multiline={true}
                                style={PageStyle.inputStyle}
                                value={this.state.Caption}
                                onChangeText={(text) => this.setState({Caption: text})}
                            />

                        </View>

                        <View style={PageStyle.buttomStyleView}>

                            <MyButton
                                viewStyle={PageStyle.buttomStyleLeft}
                                text={'انصراف'}
                                touchableOpacityStyle={{backgroundColor: CancelColor}}
                                buttonOnPress={ () => Actions.pop() }
                            />

                            <MyButton
                                viewStyle={PageStyle.buttomStyleRight}
                                text={'ارسال'}
                                buttonOnPress={ () => this.sendPostAPI() }
                            />


                        </View>
                    </View>

                </ScrollView>

            </BaseUi>

        )

    }

    sendPostAPI(){

        const Params = JSON.stringify({
            SenderId  : this.props.User.ID,
            UserId    : this.props.SenderId === null ? this.props.User.ID : this.props.SenderId,
            File      : this.props.ImageData.data,
            Caption   : this.state.Caption,
            Type      : 'jpg',
            Width     : this.props.ImageData.width,
            Height    : this.props.ImageData.height
        });

        this.setState({ Loading : true });

        FetchDataFromAPI("sendUserPost",Params, (response) => {

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            if (this.props.onSendPost !== null)
                this.props.onSendPost(response.Response[0]);

            Actions.pop();

        }).done( () => this.setState({ Loading : false }) );

    }

}


export const PageStyle = StyleSheet.create({
    imgStyle: {
        width: '100%',
        height:
            height * 0.5,
        borderRadius: 7
    },
    inputStyleView: {
        borderColor: BorderColor,
        borderWidth: 1,
        borderRadius: 6,
        width : ScreenWidth * .95,
        height: height * 0.25,
        marginTop: height * 0.01,
        backgroundColor: ButtonColor
    },
    buttomStyleView: {
        height: height * 0.11,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    buttomStyleLeft: {
        marginRight: '2%',
        marginLeft: '0%',
        marginTop: '0%',
        height: '60%',
        width: '48%'
    },
    buttomStyleRight: {
        marginRight: '0%',
        marginLeft: '0%',
        marginTop: '0%',
        height: '60%',
        width: '48%'
    },
    inputStyle: {

        fontFamily: AppFont,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'right',
        textAlignVertical : 'top',
        minHeight: height * 0.25
    }

});

SendPost.propTypes = {
    ImageData  : propTypes.object,
    SenderId   : propTypes.string,
    onSendPost : propTypes.func
};

SendPost.defaultProps = {
    ImageData  : null,
    SenderId   : null,
    onSendPost : null
};

const mapStateToProps = (states) =>{
    return { User : states.User }
};

export default connect(mapStateToProps)(SendPost);