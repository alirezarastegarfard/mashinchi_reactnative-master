import React from "react";
import MyInput from "../../customs/MyInput";
import MyButton from "../../customs/MyButton";
import ProgramImage from "../../customs/ProgramImage";
import {View, ScrollView} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import BaseUi from "../../basepage/BaseUi";
import {SecondaryTextColor} from "../../publics/Ui";
import {FetchDataFromAPI} from "../../publics/DataBase";
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import {CheckEmail} from "../../publics/Function";
import {setBrands, setHomeItems, setUser} from "../../../redux/actions";
import Pushe from "react-native-pushe";
import {MINIMUM_TEXT_PASSWORD} from "../../publics/Constant";


class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            UserName: '',
            FullName: '',
            Pass: '',
            Repass: '',
            Email: '',
            loading: false,
            pid: ''

        }
    }

    componentDidMount(): void {

        Pushe.getPusheId((pid) => this.setState({pid}));

    }

    render() {

        return (
            <BaseUi>
                <ScrollView>
                    <View style={{justifyContent: 'center'}}>
                        <ProgramImage componentHeight={.35}/>
                        <View style={{marginTop: '2%'}}>
                            <MyInput
                                value={this.state.UserName}
                                onChangeText={(UserName) => this.setState({UserName: UserName})}
                                placeholder={"نام کاربری"}
                                placeholderTextColor={SecondaryTextColor}
                                viewStyle={{height: 50}}
                            />
                        </View>
                        <View style={{marginTop: '2%'}}>
                            <MyInput
                                value={this.state.FullName}
                                onChangeText={(FullName) => this.setState({FullName: FullName})}
                                placeholder={"نام نام خانوادگی"}
                                placeholderTextColor={SecondaryTextColor}
                                viewStyle={{height: 50}}
                            />
                        </View>
                        <View style={{marginTop: '2%'}}>
                            <MyInput
                                secureTextEntry
                                value={this.state.Pass}
                                onChangeText={(Pass) => this.setState({Pass: Pass})}
                                placeholder={" رمز عبور "}
                                placeholderTextColor={SecondaryTextColor}
                                viewStyle={{height: 50}}
                            />
                        </View>
                        <View style={{marginTop: '2%'}}>
                            <MyInput
                                secureTextEntry
                                value={this.state.Repass}
                                onChangeText={(Repass) => this.setState({Repass: Repass})}
                                placeholder={" تکرار رمز "}
                                placeholderTextColor={SecondaryTextColor}
                                viewStyle={{height: 50}}
                            />
                        </View>
                        <View style={{marginTop: '2%'}}>
                            <MyInput
                                value={this.state.Email}
                                onChangeText={(Email) => this.setState({Email: Email})}
                                placeholder={" ایمیل (اختیاری) "}
                                placeholderTextColor={SecondaryTextColor}
                                viewStyle={{height: 50}}
                            />
                        </View>
                        <MyButton
                            buttonOnPress={() => this.registerUser()}
                            loading={this.state.loading}
                            viewStyle={{
                                height: 65, marginRight: '10%',
                                marginLeft: '10%',
                                marginTop: '5%'
                            }}
                            text={"تایید"}
                            activityIndicatorColor={"white"}
                        />
                    </View>
                </ScrollView>
            </BaseUi>
        )


    }


    registerUser() {

        if (!this.checkInput()) {
            return;
        }

        const Params = JSON.stringify({
            UserName: this.state.UserName,
            FullName: this.state.FullName,
            Pass: this.state.Pass,
            Email: this.state.Email,
            Mobile: this.props.Mobile,
            Pid: this.state.pid
        });

        this.setState({loading: true});


        FetchDataFromAPI("RegisterUser", Params, (response) => {

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
            Actions.ExceptionDialog({Message: "نام کاربری الزامی است"});
            return false;
        }

        if (!Number.isNaN(Number.parseInt(state.UserName.charAt(0)))) {
            Actions.ExceptionDialog({Message: "اولین کاراکتر نام کاربری نمی تواند عدد باشد"});
            return false;
        }

        if (state.UserName.trim().length < 3) {
            Actions.ExceptionDialog({Message: "حداقل 3 کارکتر برای نام کاربری الزامی است"});
            return false;
        }

        if (state.Pass.trim() === "") {
            Actions.ExceptionDialog({Message: "رمز عبور الزامی است"});
            return false;
        }

        if (state.Repass.trim() === "") {
            Actions.ExceptionDialog({Message: "تکرار رمز عبور الزامی است"});
            return false;
        }

        if (state.Pass.trim() !== state.Repass.trim()) {
            Actions.ExceptionDialog({Message: "تکرار رمز عبور نادرست است"});
            return false;
        }

        if (state.Pass.trim().length < MINIMUM_TEXT_PASSWORD) {
            Actions.ExceptionDialog({Message: `حداقل ${MINIMUM_TEXT_PASSWORD} کارکتر برای رمز عبور الزامی است`});
            return false;
        }

        if (state.Email.trim() !== "" && (CheckEmail(state.Email) === null
            || !Number.isNaN(Number.parseInt(state.Email.charAt(0))))) {
            Actions.ExceptionDialog({Message: "ایمیل وارد شده معتبر نمی باشد"});
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

export default connect(null, mapDispatchToProps)(Registration);