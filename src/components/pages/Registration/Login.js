import React from "react";
import BaseUi from "../../basepage/BaseUi";
import ProgramImage from "../../customs/ProgramImage";
import MyInput from "../../customs/MyInput";
import {AccentColor, DarkPrimaryColor, height, SecondaryTextColor} from "../../publics/Ui";
import MyButton from "../../customs/MyButton";
import {TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import MyText from "../../customs/MyText";
import {Actions} from "react-native-router-flux";
import {FetchDataFromAPI} from "../../publics/DataBase";
import {CheckPhoneNo, PersianNumToEnglish} from "../../publics/Function";
import {connect} from "react-redux";
import {setBrands, setHomeItems, setUser} from "../../../redux/actions";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: "",
            Pass: "",
            loading: false,
        }
    }

    render() {
        return (
            <BaseUi ViewStyle={{justifyContent: 'center'}}>

                <View style={{height: height * .9}}>

                    <ProgramImage componentHeight={.4}/>

                    <View style={{marginTop: '2%'}}>

                        <MyInput
                            value={this.state.UserName}
                            onChangeText={(UserName) => this.setState({UserName: UserName})}
                            placeholder={"نام کاربری یا شماره موبایل"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={{height: 50}}

                        />
                    </View>

                    <View style={{marginTop: '2%'}}>
                        <MyInput
                            secureTextEntry
                            value={this.state.Pass}
                            onChangeText={(Pass) => this.setState({Pass: Pass})}
                            placeholder={"رمز عبور"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={{height: 50}}

                        />
                    </View>

                    <MyButton
                        loading={this.state.loading}
                        buttonOnPress={() => {
                            this.registerUser()
                        }}
                        viewStyle={{
                            height: 60, marginRight: '10%',
                            marginLeft: '10%',
                            marginTop: '5%'
                        }}
                        text={"ورود"}
                        activityIndicatorColor={"white"}
                    />


                    <View style={{flexDirection: 'row', height: 20, justifyContent: 'center'}}>
                        <TouchableOpacity
                            onPress={() => Actions.InsertMobile({Type: "ForgetPass"})}
                        >
                            <MyText text={' فراموشی رمز عبور '}
                                    componentStyles={{ color: AccentColor}}/>
                        </TouchableOpacity>
                        <MyText text={' اطلاعات خود را فراموش کرده اید؟ '}
                                componentStyles={{color: SecondaryTextColor}}/>
                    </View>


                </View>


                <View
                    style={{
                        flexDirection: 'row',
                        height: height * .08,
                        justifyContent: 'center', alignItems: 'center',
                        borderColor: DarkPrimaryColor, borderWidth: 1
                    }}>
                    <TouchableOpacity
                        onPress={() => Actions.InsertMobile({Type:"Registration"})}
                    >
                        <MyText text={' ثبت نام کنید '}
                                componentStyles={{ color: AccentColor}}/>
                    </TouchableOpacity>
                    <MyText text={' ثبت نام نکرده اید؟ '} componentStyles={{color: SecondaryTextColor}}/>
                </View>


            </BaseUi>
        )
    }


    registerUser() {

        if (!this.checkInput()) {
            return;
        }

        let IsMobile=!Number.isNaN(Number.parseInt(this.state.UserName.charAt(0)));
        let username=this.state.UserName;


       //Persian number of mobile
        if (this.state.UserName.charCodeAt(0)===1776){
            username=PersianNumToEnglish(this.state.UserName);
            IsMobile=true;
        }


        const Params = JSON.stringify({
            TypeInput: IsMobile ? "Mobile" : "UserName",
            UniqueData: username,
            Password: this.state.Pass,
        });


        this.setState({loading: true});

        FetchDataFromAPI("LoginUser", Params, (response) => {

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            if (response.Success) {
                const UserData = response.Response.UserData;
                const HomeItems = response.Response.HomeItems;
                const Brands    = response.Response.Brands;
                this.props.setUser(UserData);
                this.props.setHomeItems(HomeItems);
                this.props.setBrands(Brands);
                AsyncStorage.setItem("Token", UserData.Token);
                Actions.reset("Mains");
            }

        }).done(() => this.setState({loading: false}));

    }

    checkInput() {

        const state = this.state;


        if (state.UserName.trim() === "") {
            Actions.ExceptionDialog({Message: "نام کاربری یا شماره موبایل الزامی است"});
            return false;
        }

        if (!Number.isNaN(Number.parseInt(state.UserName.charAt(0))) && (CheckPhoneNo(state.UserName) === null
            || state.UserName.length > 11 || state.UserName.length < 11)) {
            Actions.ExceptionDialog({Message: "موبایل وارد شده معتبر نمی باشد"});
            return false;
        }

        if (state.Pass.trim() === "") {
            Actions.ExceptionDialog({Message: "رمز عبور الزامی است"});
            return false;
        }


        return true;
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

export default connect(null, mapDispatchToProps)(Login);