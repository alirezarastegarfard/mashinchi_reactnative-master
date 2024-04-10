import React from "react";
import BaseUi from "../../basepage/BaseUi";
import ProgramImage from "../../customs/ProgramImage";
import CodeInput from "../../customs/ConfirmationCodeInput";
import {ScrollView, TouchableOpacity, View} from "react-native";
import MyText from "../../customs/MyText";
import {AccentColor, GreyColor, height, PrimaryTextColor, SecondaryTextColor, Small} from "../../publics/Ui";
import MyButton from "../../customs/MyButton";
import {Actions} from "react-native-router-flux";
import {getNewCode, SecondToMin} from "../../publics/Function";
import {FetchDataFromAPI} from "../../publics/DataBase";
import {setUser} from "../../../redux/actions";
import {connect} from "react-redux";


 class GetCode extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            TimeText: "00:00",
            Timer: 60,
            VerifyCode: this.props.VerifyCode.toString(),
            UserCode: '',
            ConfirmCode: false,
            loading: false

        }
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

                    <ProgramImage componentHeight={.3}/>

                    <View
                        style={{
                            height: height * (40 / 100),
                            alignItems: 'center',
                        }}>

                        <CodeInput
                            keyboardType="numeric"
                            containerStyle={{flex: 0.3}}
                            selectionColor={GreyColor}
                            codeInputStyle={{borderBottomColor: GreyColor, color: PrimaryTextColor}}
                            ref="codeInputRef1"
                            className={'border-b'}
                            space={5}
                            size={30}
                            inputPosition='left'
                            compareWithCode={this.state.VerifyCode.toString()}
                            onFulfill={(isMatch, code) => this._onFulfill(isMatch, code)}
                        />

                        <MyText text={'یک کد 5 رقمی به شماره'}
                                componentStyles={{
                                    color: SecondaryTextColor,
                                    marginTop: 20
                                }}/>
                        <MyText text={this.props.phone}
                                componentStyles={{ color: SecondaryTextColor}}/>
                        <MyText text={'پیامک شد لطفا کد را وارد کنید '}
                                componentStyles={{color: SecondaryTextColor}}/>

                        <View style={{flexDirection: 'row', marginTop: 20}}>
                            <TouchableOpacity
                                onPress={() => this.SendAgain()}
                            >
                                <MyText text={'ارسال مجدد '}
                                        componentStyles={{fontSize: Small, color: AccentColor}}/>
                            </TouchableOpacity>
                            <MyText text={' ثانیه تا '} componentStyles={{color: SecondaryTextColor}}/>
                            <MyText text={this.state.TimeText} componentStyles={{color: SecondaryTextColor}}/>
                        </View>

                        <TouchableOpacity
                            style={{marginTop: 10}}
                            onPress={() => Actions.pop()}>

                            <MyText text={'شماره را اشتباه وارد کردید؟ '}
                                    componentStyles={{fontSize: Small, color: AccentColor}}/>

                        </TouchableOpacity>


                    </View>

                    <MyButton

                        buttonOnPress={() => this.Checking()}
                        viewStyle={{
                            height: 60, marginRight: '10%',
                            marginLeft: '10%',
                            marginTop: '5%'
                        }}
                        text={"تایید"}
                        activityIndicatorColor={"white"}
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

    _onFulfill(isMatch, code) {


        this.setState({ConfirmCode: isMatch, UserCode: code}, () => {

            if (!isMatch)
                Actions.ExceptionDialog({Message: "کد وارد شده نا درست است"});
            else if (this.props.Type === "Registration")
                Actions.Registration({Mobile: this.props.phone});
            else if (this.props.Type === "ForgetPass")
                Actions.ResetPassword({Type:this.props.Type,Mobile: this.props.phone});
            else if (this.props.Type === "ChangeNumber")
                this.ChangeNumber();
        });
    }

    Checking() {

        if (this.state.Timer == 0) {
            Actions.ExceptionDialog({Message: `زمان  به پایان رسیده است`});
            return;
        }

        if (this.state.ConfirmCode) {

            if (this.props.Type === "Registration")
                Actions.Registration({Mobile: this.props.phone});
            else if (this.props.Type === "ForgetPass")
                Actions.ResetPassword({Type:this.props.Type,Mobile: this.props.phone});
            else if (this.props.Type === "ChangeNumber")
                this.ChangeNumber();

            return;
        }

        Actions.ExceptionDialog({Message: "کد وارد شده نا درست است"});
    }

    ChangeNumber() {



        const NewCode = getNewCode();

        this.setState({VerifyCode: NewCode,loading:true});

        const Params = JSON.stringify({
            Phone: this.props.phone,
            UserID: this.props.UserId,
        });


        FetchDataFromAPI("ChangeMobile", Params, (response) => {

            if (!response.Success)
                Actions.ExceptionDialog({Message: response.Message});
            if (response.Success) {



                let User = this.props.User;
                User.Mobile = this.props.phone.toString();
                this.props.setUser(User);
                this.props.updateData();
                Actions.ConfirmDialog({Message: response.Message, onConfirm: () => Actions.popTo(this.props.Page)});
            }

        }).done(() => this.setState({loading: false}));


    }

    SendAgain() {

        if (this.state.Timer !== 0) {
            Actions.ExceptionDialog({Message: `زمان ارسال مجدد به پایان نرسیده است`});
            return;
        }

        const NewCode = getNewCode();

        this.setState({VerifyCode: NewCode});

        const Params = JSON.stringify({
            phone: this.props.phone,
            code: NewCode,
            Type:this.props.Type
        });


        FetchDataFromAPI("VerifySMS", Params, (response) => {

            if (!response.Success)
                Actions.ExceptionDialog({Message: response.Message});
            else if (response.Success) {
                this.timers();
                Actions.ConfirmDialog({Message: response.Message});
            }

        }).done(() => this.setState({loading: false}));


    }
}

const mapDispatchToProps = (dispatch) => {

    return {

        setUser : (user) => {
            dispatch(setUser(user))
        }

    }

};
const mapStateToProps = (states) => {

    return {User: states.User}

};


export default connect(mapStateToProps,mapDispatchToProps)(GetCode);
