import React from "react";
import BaseUi from "../../basepage/BaseUi";
import {SecondaryTextColor} from "../../publics/Ui";
import ProgramImage from "../../customs/ProgramImage";
import {View} from "react-native";
import MyInput from "../../customs/MyInput";
import MyButton from "../../customs/MyButton";
import {FetchDataFromAPI} from "../../publics/DataBase";
import {Actions} from "react-native-router-flux";


export default class ResetPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Pass: '',
            Repass: '',
            loading: false

        }
    }


    render() {

        return (
            <BaseUi ViewStyle={{justifyContent: 'center'}}>

                <ProgramImage componentHeight={.35}/>

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

                <View style={{marginTop: '2%'}}>
                    <MyInput
                        secureTextEntry
                        value={this.state.Repass}
                        onChangeText={(Pass) => this.setState({Repass: Pass})}
                        placeholder={" تکرار رمز عبور "}
                        placeholderTextColor={SecondaryTextColor}
                        viewStyle={{height: 50}}
                    />
                </View>

                <MyButton
                    buttonOnPress={() => this.sendData()}
                    loading={this.state.loading}
                    viewStyle={{
                        height: 50, marginRight: 40,
                        marginLeft: 40,
                        marginTop: 10
                    }}
                    text={"تایید"}
                    activityIndicatorColor={"white"}
                />


            </BaseUi>

        )
    }


    CheckUserLoginData(): boolean {

        const state = this.state;

        if (state.Pass.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود رمز عبور الزامی می باشد"});
            return false;
        }

        if (state.Repass.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود تکرار رمز عبور الزامی می باشد"});

            return false;
        }

        if (state.Repass.trim() !== state.Pass.trim()) {
            Actions.ExceptionDialog({Message: "تکرار رمز عبور و رمز عبور هم خوانی ندارند"});

            return false;
        }

        if (state.Pass.trim().length < 6) {
            Actions.ExceptionDialog({Message: "حداقل 6 کارکتر برای رمز عبور الزامی است "});
            return false;
        }

        return true;

    }


    sendData() {

        if (!this.CheckUserLoginData()) {
            return;
        }

        const state = this.state;

        this.setState({loading: true});

        let Parameter = JSON.stringify({
            Mobile: this.props.Mobile,
            Pass: state.Pass,
        });

        FetchDataFromAPI("ResetPassword", Parameter, response => {

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }
            if (response.Success) {

                    Actions.ConfirmDialog({Message: response.Message, onConfirm: () => Actions.Login()});


            }

        }).done(() => this.setState({loading: false}));


    }


}