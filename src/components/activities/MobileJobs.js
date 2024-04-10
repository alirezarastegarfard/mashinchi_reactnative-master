import React, {Component} from 'react';
import BaseUi from "../basepage/BaseUi";
import {Image, View, StyleSheet, ScrollView} from "react-native";
import MyHeader from "../customs/MyHeader";
import MyInput from "../customs/MyInput";
import {SecondaryTextColor} from "../publics/Ui";
import MyButton from "../customs/MyButton";
import {BaseURL, FetchDataFromAPI, ImagesAddress} from "../publics/DataBase";
import {connect} from "react-redux";
import {CheckPhoneNo, getNewCode, PersianNumToEnglish} from "../publics/Function";
import {Actions} from "react-native-router-flux";
import {CONVERT_BUSINESS_TYPE} from "../publics/Constant";
import PropTypes from "prop-types";
import FastImage from "react-native-fast-image";

class MobileJobs extends Component {

    constructor(props){
        super(props);

        this.state = {
            FullName : this.props.User.FullName,
            PhoneNo  : this.props.User.Mobile,
            loading  : false
        };

    }

    render() {

        return (
            <BaseUi
                Loading={this.state.loading}
                ViewStyle={{backgroundColor: 'white'}}>

                <MyHeader showText={true} text={'مشاغل سیار'}/>


                <ScrollView>
                    <View style={MobileJobs_Style.MainViewStyle}>

                        <FastImage
                            style={MobileJobs_Style.ImageViewStyle}
                            source={{uri: BaseURL + ImagesAddress + this.props.ImageFileName}}
                        />

                        <MyInput
                            placeholder={"نام و نام خانوادگی"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={MobileJobs_Style.InputStyle}
                            onChangeText={(FullName) => this.setState({ FullName })}
                            value={this.state.FullName}
                        />


                        <MyInput
                            placeholder={"شماره تلفن همراه"}
                            placeholderTextColor={SecondaryTextColor}
                            viewStyle={MobileJobs_Style.InputStyle}
                            onChangeText={(PhoneNo) => this.setState({ PhoneNo })}
                            value={this.state.PhoneNo}
                            keyboardType={'phone-pad'}
                            maxLength={11}
                        />


                        <MyButton
                            viewStyle={MobileJobs_Style.ButtonStyle}
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

        if (state.FullName.trim() === "") {
            Actions.ExceptionDialog({Message: "ورود نام و نام خانوادگی الزامی است"});
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
                    Code    : VerifyCode,
                    PhoneNo : PersianNumToEnglish(this.state.PhoneNo),
                    UserId  : this.props.User.ID,
                    TypeId  : this.props.TypeId
                });
            }else if (!response.Success) {
                Actions.ExceptionDialog({
                    Message: response.Message
                });
            }

        }).done(() => this.setState({loading: false}));
    }
}

const MobileJobs_Style = StyleSheet.create({
    MainViewStyle: {justifyContent: 'center', alignItems: 'center', margin: 30},
    ImageViewStyle:{width: 250, height: 250, marginTop: 25},
    InputStyle:{height: 50, width: '100%', marginTop: 25},
    ButtonStyle:{height: 50, width: '100%', marginTop: 25},
});

MobileJobs.propTypes ={
    ImageFileName: PropTypes.string,
    TypeId       : PropTypes.string
};

const mapStateToProps = (state) =>{

    return { User : state.User }

};

export default connect(mapStateToProps)(MobileJobs);