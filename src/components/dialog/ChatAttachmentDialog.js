import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import BaseLightbox from "../basepage/BaseLightbox";
import {BorderColor} from "../publics/Ui";
import MyText from "../customs/MyText";
import {CAMERA, GALLERY, Audio} from "../publics/Constant";
import FastImage from "react-native-fast-image";


export default class ChatAttachmentDialog extends BaseLightbox {

    render() {
        const {callback = null} = this.props;

        return (

            <BaseLightbox
                verticalPercent={0.7}
                horizontalPercent={0.3}
                aItems={'stretch'}
                jContent={'flex-start'}
                cancelOutTouchSide>
                <View style={{flex: 1,backgroundColor:'white',paddingRight:5,borderRadius:10}}>
                    <View
                        style={{
                            flex: 0.25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                            paddingLeft: '2%'
                        }}>

                        <View style={{flex: 0.1}}>


                        </View>


                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <MyText text={'ارسال '}

                            />

                        </View>

                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            Actions.pop();
                            callback(CAMERA);
                        }}
                        style={{
                            flex: 0.25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                            paddingRight: '2%',borderBottomWidth:1,borderColor:BorderColor
                        }}>

                        <View style={{flex: 0.1}}>


                        </View>

                        <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
                            <MyText
                                componentStyles={{width: '85%', textAlign: 'right'}}
                                text={'گرفتن عکس با دوربین'}
                            />

                        </View>

                        <View style={{flex: 0.1}}>
                            <FastImage source={require('../../assets/images/icons/media.png')}
                                   style={{width: '100%', height: '80%'}}
                                   resizeMode={'contain'}
                            />

                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Actions.pop();
                            callback(GALLERY);
                        }}
                        style={{
                            flex: 0.25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                            paddingRight: '2%',borderBottomWidth:1,borderColor:BorderColor
                        }}>
                        <View style={{flex: 0.1}}>


                        </View>

                        <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
                            <MyText
                                componentStyles={{width: '85%', textAlign: 'right'}}
                                text={'انتخاب از گالری'}
                            />

                        </View>

                        <View style={{flex: 0.1}}>
                            <FastImage source={require('../../assets/images/icons/gallery.png')}
                                   style={{width: '100%', height: '100%'}}
                                   resizeMode={'contain'}
                            />
                        </View>

                    </TouchableOpacity>


                    <TouchableOpacity
                        onPress={() => {
                            Actions.pop();
                            callback(Audio);
                        }}
                        style={{
                            flex: 0.25, justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                            paddingRight: '2%'
                        }}>

                        <View style={{flex: 0.1}}>


                        </View>

                        <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
                            <MyText
                                componentStyles={{width: '85%', textAlign: 'right'}}
                                text={'ارسال فایل صوتی'}
                            />

                        </View>

                        <View style={{flex: 0.1}}>
                            <FastImage source={require('../../assets/images/icons/play-button.png')}
                                   style={{width: '100%', height: '100%'}}
                                   resizeMode={'contain'}
                            />
                        </View>


                    </TouchableOpacity>

                </View>

            </BaseLightbox>

        );

    }

}

