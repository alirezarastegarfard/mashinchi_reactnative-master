import React from 'react';
import {View, StatusBar, ActivityIndicator,Linking,NativeModules,Platform} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {AccentColor, height, Medium, Small, width} from "../publics/Ui";
import {Actions} from 'react-native-router-flux';
import {FetchDataFromAPI, getBaseURL, setBaseURL, setMediaURL} from "../publics/DataBase";
import {setBrands, setHomeItems, setUser} from "../../redux/actions";
import {connect} from "react-redux";
import RNExitApp from "react-native-exit-app";
import Pushe from 'react-native-pushe'
import FastImage from "react-native-fast-image";
import {
    AppPackage,
    getAppFlavor,
    getBuildNumber,
    getMarketPackage,
    getVersionInfo,
    IOS_STORE_URL
} from "../publics/Function";
import MyText from "../customs/MyText";

class Splash extends React.Component {

    constructor(props){
        super(props);
        AsyncStorage.setItem("Mute","1");

        Pushe.initialize(true);
    }

    async componentDidMount() {

        setTimeout(async () => {

            try {

                let app_JSON = await getBaseURL();

                if (app_JSON.maintenance_break === "1") {
                    Actions.ExceptionDialog({
                        Message: "خطا در اتصال به سرور",
                        onConfirm: () => RNExitApp.exitApp()
                    });
                    return;
                }

                setBaseURL(app_JSON.address_1);
                setMediaURL(app_JSON.address_4);

                setTimeout(() => {

                    this.loginUser().done();

                }, 2000);

            } catch (e) {

            }

        }, 1500);

    }

    async loginUser() {

        const Token = await AsyncStorage.getItem("Token");

        if (Token === null) {
            Actions.reset("auth");
            return;
        }

        if (Token !== null) {

            const Params = JSON.stringify({
                Token,
                Build    : getBuildNumber(),
                MarketId : getAppFlavor()
            });

            FetchDataFromAPI("LoginUser", Params, (response) => {

                if (response.Success) {
                    const UserData = response.Response.UserData;
                    const HomeItems = response.Response.HomeItems;
                    const Brands    = response.Response.Brands;
                    this.props.setUser(UserData);
                    this.props.setHomeItems(HomeItems);
                    this.props.setBrands(Brands);

                    if (response.Response.ForceUpdate){
                        Actions.QuestionDialog({
                            Message : "به دلیل برخی از تغییرات لازم است نسخه جدید را دریافت نمایید",
                            onConfirm : () => this.forceUpdate(),
                            onCancel  : () => RNExitApp.exitApp(),
                            ConfirmText : "به روز رسانی",
                            CancelText  : "خروج"
                        })
                    }else
                        Actions.reset("Mains");
                }else
                    Actions.reset("auth");

            }).done();

        }

    }

    async forceUpdate(){

        if (Platform.OS === 'android') {

            const SendIntentAndroid = NativeModules.SendIntentAndroid;

            const MarketId = getAppFlavor();

            let url = `${MarketId}://details?id=${AppPackage}`;
            let PackageName = getMarketPackage();
            let Action = "VIEW";

            if (MarketId === "iranapps")
                url = `${MarketId}://app/${AppPackage}`;

            if (!await SendIntentAndroid.isAppInstalled(PackageName)) {
                Actions.ExceptionDialog({
                    Message : "خطا در به روز رسانی نرم افزار" ,
                    onConfirm : () => RNExitApp.exitApp()
                });
                return;
            }

            SendIntentAndroid.openAppWithData(PackageName, url, Action, null,
                {position: {type: "int", value: 60}} );

        }else{

            let Supported = await Linking.canOpenURL(IOS_STORE_URL);

            if (Supported)
                Linking.openURL(IOS_STORE_URL);
            else
                Actions.ExceptionDialog({
                    Message : "خطا در به روز رسانی نرم افزار" ,
                    onConfirm : () => RNExitApp.exitApp()
                });

        }

    }


    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: AccentColor
                }}>

                <StatusBar
                    backgroundColor={AccentColor}
                    barStyle={'light-content'}/>

                <View style={{justifyContent: 'center', alignItems: 'center'}}>

                    <FastImage
                        style={{width: width * .8, height: height * .135}}
                        source={require('../../assets/images/imgs/ic_mashinchi_white.png')}
                        resizeMode={'stretch'}
                    />

                </View>

                <View style={{
                    position: 'absolute',
                    width,
                    height: 100,
                    bottom: 100,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <ActivityIndicator
                        color={'white'} size={"large"}/>

                </View>

                <View style={{
                    position: 'absolute',
                    width,
                    height: 100,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <MyText
                        componentStyles={{
                            color : 'white',
                            fontSize : Small
                        }}

                        text={`نسخه ${getVersionInfo()}`}
                    />

                </View>

            </View>
        );
    }


}

const mapDispatchToProps = (dispatch) => {

    return {

        setUser: (user) => {
            dispatch(setUser(user))
        },
        setHomeItems : (homeItems) => {
            dispatch(setHomeItems(homeItems))
        },
        setBrands : (brands) => {
            dispatch(setBrands(brands))
        }

    }

};

export default connect(null, mapDispatchToProps)(Splash);
