import React from "react";
import {AccentColor, DarkPrimaryColor, height, SecondaryTextColor} from "../../publics/Ui";
import BaseUi from "../../basepage/BaseUi";
import {TouchableOpacity, View} from "react-native";
import MyButton from "../../customs/MyButton";
import ProgramImage from "../../customs/ProgramImage";
import MyInput from "../../customs/MyInput";
import MyText from "../../customs/MyText";
import {Actions} from "react-native-router-flux";
import {FetchDataFromAPI} from "../../publics/DataBase";
import {CheckPhoneNo, getNewCode, PersianNumToEnglish} from "../../publics/Function";

export default class InsertMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: "",
            loading: false
        }
    }

    render() {
        return (
            <BaseUi ViewStyle={{justifyContent: 'center'}}>

                <View style={{height: height * .9}}>

                    <ProgramImage componentHeight={.5}/>

                    <View style={{marginTop: '2%'}}>

                        <MyInput
                            keyboardType={'phone-pad'}
                            value={this.state.phone}
                            onChangeText={(phone) => this.setState({phone: phone})}
                            placeholder={"لطفا شماره موبایل خود را وارد کنید"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={{height: 50}}
                        />
                    </View>

                    <MyButton
                        buttonOnPress={() => this.VerifyMobile()}
                        loading={this.state.loading}
                        viewStyle={{
                            height: 60, marginRight: '10%',
                            marginLeft: '10%',
                            marginTop: '5%'
                        }}
                        text={"دریافت کد"}
                        activityIndicatorColor={"white"}
                    />

                </View>


                <View
                    style={{
                        flexDirection: 'row',
                        height: height * .08,
                        justifyContent: 'center', alignItems: 'center',
                        borderColor: DarkPrimaryColor, borderWidth: 1,
                        display:this.props.Type!=='ChangeNumber'?'flex':'none'
                    }}>
                    <TouchableOpacity
                        onPress={() => Actions.Login()}
                    >
                        <MyText text={' وارد شوید '}
                                componentStyles={{color: AccentColor}}/>
                    </TouchableOpacity>
                    <MyText text={' در ماشینچی ثبت نام کرده اید؟ '} componentStyles={{color: SecondaryTextColor}}/>
                </View>


            </BaseUi>
        )

    }

    VerifyMobile() {
        const state = this.state;
        if (state.phone.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود موبایل الزامی است"});
            return;
        }
        if (!Number.isNaN(Number.parseInt(state.phone.charAt(0)))
            && (CheckPhoneNo(state.phone) === null
                || state.phone.length > 11 || state.phone.length < 11)) {
            Actions.ExceptionDialog({Message: "موبایل وارد شده معتبر نمی باشد"});
            return;
        }
        let VerifyCode = getNewCode();
        this.setState({loading: true});

        const Params = JSON.stringify({
            phone: PersianNumToEnglish(this.state.phone),
            code: VerifyCode,
            Type: this.props.Type
        });



        FetchDataFromAPI("VerifySMS", Params, (response) => {

            if (response.Success) {
                Actions.GetCode({
                    VerifyCode: VerifyCode,
                    phone: PersianNumToEnglish(this.state.phone),
                    Type: this.props.Type,
                    UserId:this.props.UserId,
                    Page:this.props.Page,
                    updateData:this.props.updateData
                });
            }
            if (!response.Success) {
                Actions.ExceptionDialog({
                    Message: response.Message
                });
            }

        }).done(() => this.setState({loading: false}));
    }


}