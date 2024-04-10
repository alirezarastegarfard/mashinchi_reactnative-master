import * as React from "react";
import BaseUi from "../basepage/BaseUi";
import {Image, StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import {
    backColor,
    BackColorDark,
    SecondaryTextColor,
    BorderColor,
    AppFont, PrimaryTextColor
} from "../publics/Ui";
import ForumListSearch from "../customs/List/ForumListSearch";
import {Actions} from "react-native-router-flux";
import FastImage from "react-native-fast-image";


const SearchHeight = 57;
export default class ForumSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OrderMode: 1,
            Search: ""
        };

        this.timeout = null;

    }

    CheckSearching(Search) {


        clearTimeout(this.timeout);
        this.setState({
            Search,
            OrderMode: Search.trim() == "" ? 1 : 2
        }, () => {
            this.timeout = setTimeout(() => {
                this.ForumListSearchRef.handleRefresh();
            }, 1000);

        });

    }


    render() {
        return (
            <BaseUi ViewStyle={{backgroundColor: BackColorDark}}>

                <View style={FormStyle.HeaderView}>
                    <View style={FormStyle.SearchViewStyle}>
                        <View style={FormStyle.InputViewStyle}>
                            <View
                                style={{
                                    height: SearchHeight,
                                    width: '10%',
                                    justifyContent: 'center', backgroundColor: 'transparent'
                                }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            Search:"",
                                            OrderMode: 1
                                        });
                                        this.ForumListSearchRef.handleRefresh();
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '80%',
                                        borderTopLeftRadius: 10,
                                        borderBottomLeftRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                       display:this.state.OrderMode==1?'none':'flex'
                                    }}>

                                    <FastImage
                                        style={{
                                            width: '35%',
                                            height: '35%',

                                        }}
                                        resizeMode={'contain'}
                                        source={require('../../assets/images/imgs/close.png')}
                                    />


                                </TouchableOpacity>
                            </View>
                            <TextInput
                                value={this.state.Search}
                                onChangeText={(Search) => this.CheckSearching(Search)}
                                autoFocus={true}
                                placeholder={'جستجو در بین تمامی دسته ها'}
                                placeholderTextColor={SecondaryTextColor}
                                style={FormStyle.InputStyle}
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <View style={FormStyle.SearchBtnView}>
                            <TouchableOpacity

                                style={FormStyle.SearchButtonStyle}>
                                <FastImage
                                    style={{width: '65%', height: '65%'}}
                                    resizeMode={'contain'}
                                    source={require('../../assets/images/icons/Search.png')}
                                />

                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => Actions.pop()}
                        style={FormStyle.RightArrowBtn}>
                        <FastImage style={{width: '55%', height: '55%'}}
                               resizeMode={'contain'}
                               source={require('../../assets/images/icons/RightArrow.png')}
                        />
                    </TouchableOpacity>
                </View>

                <ForumListSearch
                    ref={ref => (this.ForumListSearchRef = ref)}
                    Search={this.state.Search} OrderMode={this.state.OrderMode}/>
            </BaseUi>
        )
    }
}

const FormStyle = StyleSheet.create({


    SearchBtnView: {
        height: SearchHeight,
        width: '12%',
        justifyContent: 'center',
    },
    SearchViewStyle: {
        height: SearchHeight,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: '3%',
        paddingLeft: '3%',
        width: '90%',

    },
    InputViewStyle: {
        height: '80%',
        width: '88%',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderColor: BorderColor,
        borderWidth: 1,
        borderRightWidth: 0, flexDirection: 'row'
    },
    InputStyle: {
        width: '90%',
        height: '100%',
        color: PrimaryTextColor,

        fontFamily: AppFont,
        textAlign: 'right',
        paddingRight: 8,
        marginTop: '0.5%'


    },
    SearchButtonStyle: {
        width: '100%',
        height: '80%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

        borderWidth: 1,
        borderLeftWidth: 0,
        borderColor: BorderColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    HeaderView:
        {
            backgroundColor: backColor,
            width: '100%',
            height:60,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: 4
        },

    RightArrowBtn: {
        width: '10%', height: '100%', justifyContent: 'center', alignItems: 'center'

    }

});