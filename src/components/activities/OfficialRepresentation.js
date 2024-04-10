import React, {Component} from 'react';
import MyHeader from "../customs/MyHeader";
import BaseUi from "../basepage/BaseUi";
import {Image, ScrollView, StyleSheet, View} from "react-native";
import {SecondaryTextColor} from "../publics/Ui";
import MyInput from "../customs/MyInput";
import MyButton from "../customs/MyButton";
import PropTypes from "prop-types";
import {BaseURL, FetchDataFromAPI, ImagesAddress} from "../publics/DataBase";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import {CheckPhoneNo, getNewCode, PersianNumToEnglish} from "../publics/Function";
import {CONVERT_BUSINESS_TYPE} from "../publics/Constant";
import FastImage from "react-native-fast-image";

class OfficialRepresentation extends Component {

    constructor(props){
        super(props);

        this.state = {
            PermissionFullName : this.props.User.FullName,
            JobTitle : '',
            Telephone : '',
            PhoneNo : this.props.User.Mobile,
            loading  : false
        }

    }

    render() {

        return (
            <BaseUi
                Loading={this.state.loading}
                ViewStyle={{backgroundColor: 'white'}}>

                <MyHeader showText={true} text={'نمایندگی های رسمی'}/>

                <ScrollView>
                    <View style={OfficialRepresentation_Style.MainViewStyle}>

                        <FastImage style={OfficialRepresentation_Style.ImageViewStyle}
                               source={{uri: BaseURL + ImagesAddress + this.props.ImageFileName}}
                        />

                        <MyInput
                            placeholder={"نام و نام خانوادگی صاحب امتیاز"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={OfficialRepresentation_Style.InputStyle}
                            onChangeText={(PermissionFullName) => this.setState({PermissionFullName})}
                            value={this.state.PermissionFullName}
                        />


                        <MyInput
                            placeholder={"عنوان و برند کسب و کار "}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={OfficialRepresentation_Style.InputStyle}
                            onChangeText={(JobTitle) => this.setState({JobTitle})}
                            value={this.state.JobTitle}
                        />

                        <MyInput
                            placeholder={"شماره تلفن ثابت"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={OfficialRepresentation_Style.InputStyle}
                            onChangeText={(Telephone) => this.setState({Telephone})}
                            value={this.state.Telephone}
                            keyboardType={'phone-pad'}
                            maxLength={11}
                        />


                        <MyInput
                            placeholder={"شماره تلفن همراه "}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={OfficialRepresentation_Style.InputStyle}
                            value={this.state.PhoneNo}
                            keyboardType={'phone-pad'}
                            maxLength={11}
                        />

                        <MyButton
                            viewStyle={OfficialRepresentation_Style.ButtonStyle}
                            text={"دریافت کد فعال سازی"}
                            activityIndicatorColor={"white"}
                            buttonOnPress={ () => this.VerifyMobile() }
                        />


                    </View>
                </ScrollView>


            </BaseUi>
        )

    }

    VerifyMobile() {

        const state = this.state;

        if (state.PermissionFullName.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود نام و نام خانوادگی صاحب امتیاز الزامی است"});
            return;
        }

        if (state.JobTitle.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود عنوان و برند کسب و کار الزامی می باشد"});
            return;
        }

        if (state.Telephone.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود تلفن ثابت الزامی است"});
            return;
        }

        if (state.PhoneNo.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود موبایل الزامی است"});
            return;
        }

        if (!Number.isNaN(Number.parseInt(state.PhoneNo.charAt(0)))
            && (CheckPhoneNo(state.PhoneNo) === null
                || state.PhoneNo.length > 11 || state.PhoneNo.length < 11)) {
            Actions.ExceptionDialog({Message: "موبایل وارد شده معتبر نمی باشد"});
            return;
        }

        const VerifyCode = getNewCode();
        this.setState({loading: true});

        const Params = JSON.stringify({
            phone : PersianNumToEnglish(this.state.PhoneNo),
            code  : VerifyCode,
            Type  : CONVERT_BUSINESS_TYPE
        });


        FetchDataFromAPI("VerifySMS", Params, (response) => {

            if (response.Success) {
                Actions.GetCodeForChangeToBusiness({
                    Code      : VerifyCode,
                    PhoneNo   : PersianNumToEnglish(this.state.PhoneNo),
                    UserId    : this.props.User.ID,
                    TypeId    : this.props.TypeId,
                    Telephone : PersianNumToEnglish(this.state.Telephone),
                    PermissionFullName : this.state.PermissionFullName,
                    JobTitle  : this.state.JobTitle
                });
            }else if (!response.Success) {
                Actions.ExceptionDialog({
                    Message: response.Message
                });
            }

        }).done(() => this.setState({loading: false}));
    }

}

const OfficialRepresentation_Style = StyleSheet.create({
    MainViewStyle: {justifyContent: 'center', alignItems: 'center', margin: 30, marginTop: 10},
    ImageViewStyle: {width: 250, height: 200},
    InputStyle:{height: 50, width: '100%', marginTop: 15},
    ButtonStyle:{height: 50, width: '100%', marginTop: 15},

});

OfficialRepresentation.propTypes ={
    ImageFileName: PropTypes.string,
    TypeId       : PropTypes.string
};

const mapStateToProps = (state) =>{

    return { User : state.User }

};

export default connect(mapStateToProps)(OfficialRepresentation);