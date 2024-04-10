import React from "react";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {ScrollView, View, TouchableOpacity} from "react-native";
import MyText from "../customs/MyText";
import {
    AccentColor,
    backColor,

    BorderColor,

    height, Small, VerySmall
} from "../publics/Ui";
import Input from "../customs/Input";
import MyButton from "../customs/MyButton";
import {connect} from "react-redux";
import {FetchDataFromAPI} from "../publics/DataBase";
import {setUser} from "../../redux/actions";
import {Actions} from 'react-native-router-flux';
import propType from 'prop-types';
import FastImage from "react-native-fast-image";
import {CheckEmail, getCurrentLocation} from "../publics/Function";

class EditProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            FullName: this.props.User.FullName,
            UserName: this.props.User.UserName,
            CityId: this.props.User.CityId,
            CityName: this.props.User.CityName,
            AreaName: this.props.User.AreaName,
            AreaId: this.props.User.AreaId,
            Status: this.props.User.Status,
            Email: this.props.User.Email,
            loading: false,
            uiLoading : false
        }
    }

    render() {

        return (
            <BaseUi
                Loading={this.state.uiLoading}
                ViewStyle={{backgroundColor: backColor}}>
                <MyHeader
                    buttonLeftShowing={false}
                    showText={true}
                    text={'ویرایش پروفایل'}
                />
                <ScrollView style={{marginBottom: height * 0.001}}>

                    <View style={{height: height * 0.15, justifyContent: 'center', alignItems: 'center'}}>
                        <MyText text={'لطفا اطلاعات کاربری خود را تکمیل کنید'}
                                componentStyles={{fontSize: Small}}
                        />
                    </View>

                    <Input
                        HeaderText={'نام'}
                        value={this.state.FullName}
                        onChangeText={(FullName) => this.setState({FullName})}
                        placeholder={"نام"}
                    />

                    <Input
                        HeaderText={'نام مستعار'}
                        value={this.state.UserName}
                        onChangeText={(UserName) => this.setState({UserName})}
                        placeholder={'نام مستعار'}
                    />


                    <View>
                        <View style={{marginTop: height * 0.03, marginRight: 15, marginLeft: 15}}>
                            <View style={{height: 29, paddingRight: 5}}>
                                <MyText text={'شهر'}
                                        componentStyles={{fontSize: Small}}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    Actions.CityDialog({
                                        Type: 1, callBack: (CityName, CityId) => {
                                            this.setState({CityName, CityId, AreaId: null, AreaName: ''});
                                        }
                                    });
                                }}
                                style={{
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: BorderColor,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                <View style={{
                                    width: '10%',
                                    height: '50%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <FastImage
                                        resizeMode={'contain'}
                                        source={require('../../assets/images/icons/left-arrow.png')}
                                        style={{height: '80%', width: '80%'}}
                                    />
                                </View>
                                <View style={{width: '90%', paddingRight: 4}}>
                                    <MyText text={this.state.CityName}
                                            componentStyles={{fontSize: VerySmall}}
                                    />
                                </View>


                            </TouchableOpacity>
                        </View>

                    </View>


                    <View>
                        <View style={{marginTop: height * 0.03, marginRight: 15, marginLeft: 15}}>
                            <View style={{height: 29, paddingRight: 5}}>
                                <MyText text={'محله'}
                                        componentStyles={{fontSize: Small}}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => Actions.CityDialog({
                                    CityId: this.state.CityId,
                                    Type: 2,
                                    callBack: (AreaName, AreaId) => this.setState({AreaName, AreaId}),
                                    onFindLocation : () => this.FindLocation().done()
                                })}
                                style={{
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: BorderColor,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    backgroundColor: 'white',
                                    borderRadius: 10
                                }}>
                                <View style={{
                                    width: '10%',
                                    height: '50%',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <FastImage
                                        resizeMode={'contain'}
                                        source={require('../../assets/images/icons/left-arrow.png')}
                                        style={{height: '80%', width: '80%'}}
                                    />
                                </View>
                                <View style={{width: '90%', paddingRight: 4}}>
                                    <MyText text={this.state.AreaName}
                                            componentStyles={{fontSize: VerySmall}}
                                    />
                                </View>

                            </TouchableOpacity>
                        </View>

                    </View>

                    <Input
                        HeaderText={'درباره من'}
                        value={this.state.Status}
                        onChangeText={(Status) => this.setState({Status})}
                        placeholder={'درباره من'}
                    />

                    <Input
                        HeaderText={'ایمیل (اختیاری)'}
                        value={this.state.Email}
                        onChangeText={(Email) => this.setState({Email})}
                        placeholder={'ایمیل (اختیاری)'}
                    />


                    <TouchableOpacity
                        style={{marginTop: 0.07 * height, marginRight: '6%'}}
                        onPress={() => Actions.SwitchToBusiness()}>
                        <MyText text={'تبدیل به کسب و کار'}
                                componentStyles={{fontSize: Small, color: AccentColor}}
                        />
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={{marginTop: 0.04 * height, marginRight: '6%'}}
                        onPress={() => Actions.ChangePassword()}>
                        <MyText text={'تغییر رمز عبور'}
                                componentStyles={{fontSize: Small, color: AccentColor}}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{marginTop: 0.04 * height, marginRight: '6%'}}
                        onPress={() => Actions.InsertMobile({
                            updateData:  ()=>this.updateData(),
                            Type: 'ChangeNumber',
                            UserId: this.props.User.ID,
                            Page: "EditProfile"
                        })}>
                        <MyText text={'تغییر شماره همراه' + ' (' + this.props.User.Mobile + ') '}
                                componentStyles={{fontSize: Small, color: AccentColor}}
                        />

                    </TouchableOpacity>

                </ScrollView>

                <MyButton
                    loading={this.state.loading}
                    text={'تایید'}
                    viewStyle={{
                        height: 50,
                        marginRight: height * 0.02,
                        marginLeft: height * 0.02,
                        marginTop: height * 0.02,
                        marginBottom: height * 0.01,

                    }}
                    buttonOnPress={() => this.sendDataAPI()}
                />


            </BaseUi>
        )
    }

    sendDataAPI() {

        if (this.state.UserName.trim() === ""){
            Actions.ExceptionDialog({ Message : 'ورود نام مستعار الزامی می باشد' });
            return;
        }

        if (this.state.Email.trim() !== "" && (CheckEmail(this.state.Email) === null || !Number.isNaN(Number.parseInt(this.state.Email.charAt(0))))) {
            Actions.ExceptionDialog({Message: "ایمیل وارد شده معتبر نمی باشد"});
            return;
        }

        this.setState({loading: true});

        const Parameter = JSON.stringify({

            UserId: this.props.User.ID,
            FullName: this.state.FullName,
            UserName: this.state.UserName,
            CityId: this.state.CityId,
            Status: this.state.Status,
            Email: this.state.Email,
            AreaId: this.state.AreaId,

        });

        FetchDataFromAPI("UpdateProfile", Parameter, (response) => {

            if (response.Success) {
                this.props.setUser(response.Response);
                Actions.ConfirmDialog({
                    Message: response.Message,
                    onConfirm: () => {

                        Actions.pop();

                        if (this.props.callBack !== null)
                            this.props.callBack(response.Response);

                    }
                });
            } else
                Actions.ExceptionDialog({Message: response.Message});

        }).done(() => this.setState({loading: false}));

    }

    updateData() {
        this.setState({update: true})
    }

    async FindLocation() {

        this.setState({ uiLoading : true });

        const CurrLocation = await getCurrentLocation();

        const Parameter = JSON.stringify({

            Latitude: CurrLocation.latitude,
            Longitude: CurrLocation.longitude

        });

        FetchDataFromAPI("getAreaFromLocation", Parameter, (response) => {

            this.setState({
                AreaId: response.Response.AreaId,
                AreaName : response.Response.AreaName
            });

        }).done( () =>  this.setState({ uiLoading : false }) );

    }

}

EditProfile.propTypes = {
    callBack: propType.func
};

EditProfile.defaultProps = {
    callBack: null
};

const mapDispatchToProps = (Dispatch) => {

    return {
        setUser: (user) => {
            Dispatch(setUser(user))
        }
    }

};

const mapStateToProps = (states) => {
    return {User: states.User}
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);