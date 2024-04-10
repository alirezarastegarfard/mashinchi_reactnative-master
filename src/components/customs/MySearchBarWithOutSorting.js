import React from "react";
import {Image, View,TouchableOpacity,TextInput} from "react-native";
import {
    AppFont,
    DarkPrimaryColor,
    height,

    PrimaryTextColor,
    SecondaryTextColor,
    VerySmall
} from "../publics/Ui";
import FastImage from "react-native-fast-image";
const SearchHeight = height * (7 / 100);

export default class MySearchBarWithOutSorting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {data: ''};}
    render() {
        const {functions} = this.props;
        return (
            <View style={{
                height: SearchHeight,
                flexDirection: 'row',
                backgroundColor: DarkPrimaryColor,
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 10,
                paddingLeft: 10,
            }}>
                <View
                    style={{
                        height: SearchHeight,
                        width: '10%',
                        justifyContent: 'center',
                    }}>

                    <TouchableOpacity
                        onPress={()=>this.setState({data:''},functions('')
                       // ,this.input.setNativeProps({text: ''})
                            //this.input._root.clear())
                        )}
                        style={{
                            width: '100%',
                            height: '80%',
                            borderTopLeftRadius: 10,
                            borderBottomLeftRadius: 10,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                        <FastImage
                            style={{
                                width: '25%',
                                height: '25%',
                            }}
                            resizeMode={'contain'}
                            source={require('../../assets/images/imgs/close.png')}
                        />


                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        height : '80%' ,
                        width: '80%',
                        alignItems : 'center',
                        backgroundColor : 'white'
                    }}>

                    <TextInput
                        placeholder={'جستجو ...'}
                        value={this.state.data}
                        onChangeText={(text) => this.setState({data:text},functions(text))}
                        placeholderTextColor={SecondaryTextColor}
                        style={{
                            width: '100%',
                            height : '100%',
                            color: PrimaryTextColor,
                            fontSize:VerySmall,
                            fontFamily:AppFont,
                            textAlign: 'right',
                            paddingRight:8,
                            justifyContent : 'flex-end',
                            alignItems :'flex-end'
                        }}
                        underlineColorAndroid="transparent"
                    />

                </View>

                <View
                    style={{
                        height: SearchHeight,
                        width: '10%',
                        justifyContent: 'center',

                    }}>

                    <TouchableOpacity
                        onPress={()=>{
                            functions(this.state.data);
                        }}
                        style={{
                            width: '100%',
                            height: '80%',
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems : 'center'
                        }}>

                        <FastImage
                            style={{
                                width: '55%',
                                height: '55%',
                            }}
                            resizeMode={'contain'}
                            source={require('../../assets/images/icons/Search.png')}
                        />

                    </TouchableOpacity>
                </View>

            </View>
        )
    }


}