import React from "react";
import propTypes from 'prop-types';
import {Image, View,TouchableOpacity,TextInput} from "react-native";
import {
    AccentColor,
    AppFont,
    BorderColor,
    PrimaryTextColor,
    SecondaryTextColor, Small
} from "../publics/Ui";
import FastImage from "react-native-fast-image";

const SearchHeight = 51;

export default class MySearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: '',
            isActiveSort : false
        };

    }

    render() {

        return (
            <View style={{
                height: SearchHeight,
                flexDirection: 'row',
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
                paddingRight: 10,
                paddingLeft: 10,

            }}>
                <View
                    style={{
                        height: SearchHeight,
                        width: '15%',
                        justifyContent: 'center',

                    }}>

                    <TouchableOpacity
                        activeOpacity={.6}
                        onPress={() => this.setState({isActiveSort : !this.state.isActiveSort} , () => {
                            if (this.props.onSortClicked === null)
                                return;

                            this.props.onSortClicked(this.state.isActiveSort);
                        })}
                        style={{
                            width: '100%',
                            height: '85%',
                            backgroundColor:'transparent',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                        <Image
                            style={{
                                width: '80%',
                                height: '60%',
                                tintColor: this.state.isActiveSort ? AccentColor : PrimaryTextColor
                            }}
                            resizeMode={'contain'}
                            source={require('../../assets/images/icons/sort.png')}
                        />


                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        height : '85%' ,
                        width: '75%',
                        alignItems : 'center',
                        backgroundColor : 'white',
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                        borderColor:BorderColor,
                        borderWidth:1,
                        borderRightWidth:0,
                        flexDirection:'row'
                    }}>

                    <View
                        style={{
                            height: SearchHeight,
                            width: '10%',
                            justifyContent: 'center',
                        }}>

                        <TouchableOpacity
                            onPress={()=> this.onChangeText('')}
                            style={{
                                width: '100%',
                                height: '80%',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                backgroundColor: 'white',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: this.state.data!==''?'flex':'none'
                            }}>

                            <FastImage
                                style={{
                                    width: '45%',
                                    height: '45%',
                                }}
                                resizeMode={'contain'}
                                source={require('../../assets/images/imgs/close.png')}
                            />


                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder={'جستجو ...'}
                        value={this.state.data}
                        onChangeText={(text) => this.onChangeText(text)}
                        placeholderTextColor={SecondaryTextColor}
                        style={{
                            width: '90%',
                            height : '100%',
                            color: PrimaryTextColor,
                            fontSize: Small,
                            fontFamily:AppFont,
                            textAlign: 'right',
                            paddingRight:8,


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

                            if (this.props.onTextCompleted === null)
                                return;

                            this.props.onTextCompleted(this.state.data , this.state.isActiveSort);

                        }}
                        style={{
                            width: '100%',
                            height: '85%',
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                            backgroundColor:  'white',
                            borderWidth:1,
                            borderLeftWidth:0,
                            borderColor:BorderColor,
                            justifyContent: 'center',
                            alignItems : 'center'
                        }}>

                        <FastImage
                            style={{
                                width: '60%',
                                height: '60%',
                            }}
                            resizeMode={'contain'}
                            source={require('../../assets/images/icons/Search.png')}
                        />

                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    onChangeText(text){

        clearTimeout(this.search);

        this.setState({data : text},() => {

            this.search = setTimeout( () => {

                if (this.props.onTextCompleted === null)
                    return;

                this.props.onTextCompleted(this.state.data , this.state.isActiveSort);

            },this.props.TimeOut );

        });

    }



}

MySearchBar.propTypes = {

    TimeOut : propTypes.number,
    onTextCompleted : propTypes.func,
    onSortClicked : propTypes.func
};

MySearchBar.defaultProps = {
    onTextCompleted : null,
    onSortClicked : null,
    TimeOut : 1000
};