import {height, SecondaryTextColor} from "../publics/Ui";
import React from "react";
import BaseUi from "../basepage/BaseUi";
import {View, ScrollView} from "react-native";
import ProgramImage from "../customs/ProgramImage";
import MyInput from "../customs/MyInput";
import MyButton from "../customs/MyButton";
import {Actions} from "react-native-router-flux";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import {MINIMUM_TEXT_PASSWORD} from "../publics/Constant";

class ChangePassword extends React.Component {

    constructor(props){
        super(props);

        this.state = {

            OldPassword : '',
            NewPassword : '',
            RePassword  : '',
            Loading : false

        };

    }

    render() {
        return (
            <BaseUi
                Loading={this.state.Loading}
                ViewStyle={{justifyContent: 'center'}}>

                <ScrollView style={{height: height * .9}}>

                    <ProgramImage componentHeight={.45}/>

                    <View style={{marginTop: '2%'}}>

                        <MyInput
                            placeholder={"رمز فعلی"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={{height: 50}}
                            value={this.state.OldPassword}
                            onChangeText={(OldPassword) => this.setState({OldPassword})}
                            secureTextEntry
                        />
                    </View>

                    <View style={{marginTop: '2%'}}>

                        <MyInput
                            placeholder={'رمز جدید'}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={{height: 50}}
                            value={this.state.NewPassword}
                            onChangeText={(NewPassword) => this.setState({NewPassword})}
                            secureTextEntry
                        />
                    </View>

                    <View style={{marginTop: '2%'}}>

                        <MyInput
                            placeholder={"تکرار رمز جدید"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={{height: 50}}
                            value={this.state.RePassword}
                            onChangeText={(RePassword) => this.setState({RePassword})}
                            secureTextEntry
                        />
                    </View>

                    <MyButton
                        buttonOnPress={() => this.changePassword()}
                        loading={this.state.loading}
                        viewStyle={{
                            height: 60, marginRight: '10%',
                            marginLeft: '10%',
                            marginTop: '5%'
                        }}
                        text={"تغییر رمز عبور"}
                        activityIndicatorColor={"white"}
                    />

                </ScrollView>


            </BaseUi>
        )

    }

    changePassword() {

        if (this.state.OldPassword.trim() === ''){
            Actions.ExceptionDialog({ Message : "رمز عبور فعلی را وارد کنید" });
            return;
        }


        if (this.state.NewPassword.trim() === ''){
            Actions.ExceptionDialog({ Message : "رمز عبور جدید را وارد کنید" });
            return;
        }

        if (this.state.NewPassword.length < MINIMUM_TEXT_PASSWORD) {
            Actions.ExceptionDialog({Message: `حداقل ${MINIMUM_TEXT_PASSWORD} کارکتر برای رمز عبور الزامی است`});
            return false;
        }

        if (this.state.RePassword.trim() === ''){
            Actions.ExceptionDialog({ Message : "تکرار رمز عبور جدید را وارد کنید" });
            return;
        }

        if (this.state.NewPassword !== this.state.RePassword){
            Actions.ExceptionDialog({ Message : "تکرار رمز عبور جدید صحیح نمی باشد" });
            return;
        }

        this.setState({ Loading : true });

        const Parameter = JSON.stringify({
            UserId      : this.props.User.ID,
            OldPassword : this.state.OldPassword,
            NewPassword : this.state.NewPassword
        });

        FetchDataFromAPI('changePassword',Parameter,(response) => {

            if (response.Success) {
                Actions.pop();
                Actions.ConfirmDialog({Message: response.Message});
            }else
                Actions.ExceptionDialog({ Message : response.Message });

        }).done( () => this.setState({ Loading : false }) );

    }

}

const mapStateToProps = (states) => {
    return {User : states.User}
};

export default connect(mapStateToProps)(ChangePassword);