import React from 'react';
import {ActivityIndicator, TextInput, TouchableOpacity, View} from "react-native";
import BaseLightbox from "../basepage/BaseLightbox";
import {
    AccentColor,
    AppFont,
    backColor, PrimaryTextColor,
    SecondaryTextColor, VerySmall
} from "../publics/Ui";
import {Actions} from "react-native-router-flux";
import MyText from "../customs/MyText";

class EditPostDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Desc    : this.props.Parent.props.PostData.PostCaption,
            loading : false
        }
    }

    render(){
        return (
            <BaseLightbox
                verticalPercent={0.9}
                horizontalPercent={0.6}
                jContent={'center'}
                aItems={'stretch'}
                cancelOutTouchSide={false}>

                <View style={{flex: 1, alignItems: 'stretch', backgroundColor: backColor, borderRadius: 4}}>
                    <View style={{
                        flex: .15,
                        backgroundColor: AccentColor,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                        <MyText
                            componentStyles={{color: 'white', fontSize: 20}}
                            text={"ویرایش پست"}
                        />

                    </View>

                    <View style={{
                        flex: .8,
                        backgroundColor: backColor,
                        paddingRight: 5,
                        paddingLeft: 5,
                        paddingBottom: 5,

                    }}>

                        <View
                            style={{
                                height: '97%',
                                marginTop: '2%',
                                backgroundColor: 'white',
                                marginRight: '1%',
                                marginLeft: '1%',
                                borderRadius: 3,
                                shadowOffset: {width: 0, height: 1},
                                shadowOpacity: 0.3,
                                shadowRadius: 2,
                                elevation: 5,
                                justifyContent: 'center',
                                paddingRight: 5
                            }}>
                            <TextInput
                                multiline
                                placeholder={'متن پست'}
                                value={this.state.Desc}
                                onChangeText={(text) => this.setState({Desc: text})}
                                placeholderTextColor={SecondaryTextColor}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    fontFamily: AppFont,
                                    color: PrimaryTextColor,
                                    fontSize: VerySmall,
                                    textAlign: 'right',
                                    textAlignVertical : 'top'
                                }}
                                underlineColorAndroid="transparent"

                            />

                        </View>


                    </View>
                    <View style={{
                        flex: .15,
                        backgroundColor: backColor,
                        paddingRight: 5,
                        paddingLeft: 5,
                        paddingBottom: 5,
                    }}>
                        <View style={{
                            height: '100%',
                            justifyContent: 'center',
                            alignItems:'center',
                            flexDirection: 'row',
                            marginRight: '2%',
                            marginLeft: '2%',

                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Actions.pop();
                                }}
                                style={{
                                    width: '50%', height: '70%',
                                    margin: '1%',
                                    backgroundColor:'#a0a0a0',
                                    borderRadius: 4,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>

                                <MyText text={'انصراف'} componentStyles={{color: 'white'}}/>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => this.editPost()}
                                style={{
                                    width: '50%', height: '70%',
                                    margin: '1%',
                                    backgroundColor: AccentColor,
                                    borderRadius: 4,
                                    alignItems: 'center', justifyContent: 'center'
                                }}>

                                {

                                    this.state.loading ?

                                        <ActivityIndicator color={'white'} size={"large"}/>

                                    :

                                        <MyText text={'تایید'} componentStyles={{color: 'white'}}/>

                                }

                            </TouchableOpacity>

                        </View>
                    </View>

                </View>

            </BaseLightbox>
        );
    }

    editPost() {

        this.setState({ loading : true });
        this.props.Parent.editPostText( this.state.Desc ,() => Actions.pop() )

    }
}

export default EditPostDialog;