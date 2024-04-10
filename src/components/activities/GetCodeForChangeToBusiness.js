import React, {Component} from 'react';
import BaseUi from "../basepage/BaseUi";
import {AccentColor, GreyColor, PrimaryTextColor, SecondaryTextColor, Small} from "../publics/Ui";
import {ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import ProgramImage from "../customs/ProgramImage";
import MyText from "../customs/MyText";
import MyButton from "../customs/MyButton";
import CodeInput from "../customs/ConfirmationCodeInput";
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import {getNewCode, SecondToMin} from "../publics/Function";
import {FetchDataFromAPI} from "../publics/DataBase";
import {CONVERT_BUSINESS_TYPE} from "../publics/Constant";

export default class GetCodeForChangeToBusiness extends Component {

    constructor(props){
        super(props);

        this.state = {
            PhoneNo : this.props.PhoneNo,
            Code    : this.props.Code,
            Timer   : 60,
            TimeText: "00:00",
            ConfirmCode : false,
            loading : false
        };

    }

    componentWillMount() {
        this.timers();
    }

    render() {

        return (
            <BaseUi
                Loading={this.state.loading}
                ViewStyle={{justifyContent: 'center'}}>
                <ScrollView>

                    <ProgramImage componentHeight={.4}/>


                    {/*all text are here */}
                    <View style={GetCodeForChangeToBusiness_Style.MainTextView}>

                        <CodeInput
                            keyboardType="numeric"
                            containerStyle={{flex: 0.3}}
                            selectionColor={GreyColor}
                            codeInputStyle={GetCodeForChangeToBusiness_Style.InputStyle}
                            ref="codeInputRef1"
                            className={'border-b'}
                            space={5}
                            size={30}
                            inputPosition='left'
                            compareWithCode={this.state.Code.toString()}
                            onFulfill={(isMatch) => this._onFulfill(isMatch)}
                        />


                        <MyText text={'یک کد 5 رقمی به شماره'}
                                componentStyles={GetCodeForChangeToBusiness_Style.FirstTextStyle}/>

                        <MyText text={this.props.PhoneNo}
                                componentStyles={GetCodeForChangeToBusiness_Style.TextStyle}/>

                        <MyText text={'پیامک شد لطفا کد را وارد کنید '}
                                componentStyles={GetCodeForChangeToBusiness_Style.TextStyle}/>



                        <View style={GetCodeForChangeToBusiness_Style.innerMainTextView}>

                            <TouchableOpacity
                                onPress={() => this.SendAgain()}>
                                <MyText text={'ارسال مجدد '}
                                        componentStyles={GetCodeForChangeToBusiness_Style.AccentColorTextStyle}/>
                            </TouchableOpacity>


                            <MyText text={' ثانیه تا '} componentStyles={GetCodeForChangeToBusiness_Style.TextStyle}/>
                            <MyText text={this.state.TimeText} componentStyles={GetCodeForChangeToBusiness_Style.TextStyle}/>

                        </View>


                        <TouchableOpacity
                            style={{marginTop: 10}}
                            onPress={ () => Actions.pop() }>
                            <MyText
                                text={'شماره را اشتباه وارد کردید؟ '}
                                componentStyles={GetCodeForChangeToBusiness_Style.AccentColorTextStyle}/>

                        </TouchableOpacity>


                    </View>


                    <MyButton
                        viewStyle={GetCodeForChangeToBusiness_Style.ButtonStyle}
                        text={"تایید"}
                        activityIndicatorColor={"white"}
                        buttonOnPress={() => this.Checking()}
                    />


                </ScrollView>
            </BaseUi>
        )
    }

    timers() {

        this.setState({Timer: 60}, () => {
            this.Interval = setInterval(() => {
                let Time = Number.parseInt(this.state.Timer);
                Time = Time - 1;
                this.setState({Timer: Time, TimeText: SecondToMin(Time)});
                if (Time <= 0) {
                    clearInterval(this.Interval);
                }

            }, 1000);

        });


    }

    _onFulfill(isMatch) {

        if (this.state.Timer == 0) {
            Actions.ExceptionDialog({Message: `زمان  به پایان رسیده است`});
            return;
        }

        this.setState({ConfirmCode: isMatch}, () => {

            if (!isMatch)
                Actions.ExceptionDialog({Message: "کد وارد شده نا درست است"});
            else
                this.ConvertBusinessProfile();
        });
    }

    Checking() {

        if (this.state.Timer == 0) {
            Actions.ExceptionDialog({Message: `زمان  به پایان رسیده است`});
            return;
        }

        if (this.state.ConfirmCode) {
            this.ConvertBusinessProfile()
            return;
        }

        Actions.ExceptionDialog({Message: "کد وارد شده نا درست است"});
    }

    SendAgain() {

        if (this.state.Timer !== 0) {
            Actions.ExceptionDialog({Message: `زمان ارسال مجدد به پایان نرسیده است`});
            return;
        }

        const NewCode = getNewCode();

        this.setState({Code: NewCode});

        const Params = JSON.stringify({
            phone: this.props.PhoneNo,
            code : NewCode,
            Type : CONVERT_BUSINESS_TYPE
        });

        this.setState({loading: true});

        FetchDataFromAPI("VerifySMS", Params, (response) => {

            if (!response.Success)
                Actions.ExceptionDialog({Message: response.Message});
            else if (response.Success) {
                this.timers();
                Actions.ConfirmDialog({Message: response.Message});
            }

        }).done(() => this.setState({loading: false}));


    }

    ConvertBusinessProfile() {

        this.setState({loading: true});

        const Parameter = JSON.stringify({

            TypeId    : this.props.TypeId,
            UserId    : this.props.UserId,
            PhoneNo   : this.state.PhoneNo,
            Telephone : this.props.Telephone,
            PermissionFullName : this.props.PermissionFullName,
            JobTitle  : this.props.JobTitle

        });

        FetchDataFromAPI('convertBusinessAccount',Parameter,(response) =>{

            if (response.Success)
                Actions.Result();
            else
                Actions.ExceptionDialog({ Message : response.Message });

        }).done(() => this.setState({loading: false}));

    }
}

const GetCodeForChangeToBusiness_Style = StyleSheet.create({
    MainTextView: {height: 250, alignItems: 'center'},
    InputStyle: {borderBottomColor: GreyColor, color: PrimaryTextColor},
    FirstTextStyle: {color: SecondaryTextColor, marginTop: 20},
    TextStyle: {color: SecondaryTextColor},
    innerMainTextView: {flexDirection: 'row', marginTop: 20},
    AccentColorTextStyle: {fontSize: Small, color: AccentColor},
    ButtonStyle: {height: 50, marginRight: 30, marginLeft: 30, marginTop: 20}
});

GetCodeForChangeToBusiness.propTypes = {

    PhoneNo   : PropTypes.string,
    Code      : PropTypes.string,
    UserId    : PropTypes.string,
    TypeId    : PropTypes.string,
    Telephone : PropTypes.string,
    PermissionFullName : PropTypes.string,
    JobTitle  : PropTypes.string

};

GetCodeForChangeToBusiness.defaultProps = {
    Telephone : '',
    PermissionFullName : '',
    JobTitle : ''
};