import React from "react";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {ScrollView, View, Image, TouchableOpacity} from "react-native";
import MyText from "../customs/MyText";
import {
    AccentColor,
    BorderColor, DarkPrimaryColor,
    getTagRender,
    height, Medium, Small,
} from "../publics/Ui";
import Input from "../customs/Input";
import MyButton from "../customs/MyButton";
import HalfInput from "../customs/HalfInput";
import MyMapView from "../customs/MyMapView";
import MyCard from "../customs/MyCard";
import {setUser} from "../../redux/actions";
import {connect} from "react-redux";
import {
    CONTACT_TYPE_INSTAGRAM,
    CONTACT_TYPE_PHONE,
    CONTACT_TYPE_TEL1,
    CONTACT_TYPE_TEL2,
    CONTACT_TYPE_TEL3,
    CONTACT_TYPE_TELEGRAM, TAG_TYPE_CARS, TAG_TYPE_SERVICE, TAG_TYPE_VIP_SERVICE
} from "../publics/Constant";
import {Actions} from "react-native-router-flux";
import {FetchDataFromAPI} from "../publics/DataBase";
import FastImage from "react-native-fast-image";
import {CheckEmail, getCurrentLocation} from "../publics/Function";

class BusinessEditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserName: this.props.User.UserName,
            CityId: this.props.User.CityId,
            CityName: this.props.User.CityName,
            AreaId: this.props.User.AreaId,
            AreaName: this.props.User.AreaName,
            Status: this.props.User.Status,
            Email: this.props.User.Email,
            Address: this.props.User.Address,
            VIPServices: this.props.User.VIPServices,
            Services: this.props.User.Services,
            Cars: this.props.User.Cars,
            Latitudes: this.props.User.Latitudes,
            Longitudes: this.props.User.Longitudes,
            Tel1: "",
            Tel2: "",
            Tel3: "",
            Phone: "",
            InstagramId: "",
            TelegramId: "",
            loading: false,
            uiLoading : false
        };

    }

    componentWillMount(): void {


        if (this.props.User.ContactData === null)
            return;

        let Tel1 = "";
        let Tel2 = "";
        let Tel3 = "";
        let Phone = "";
        let InstagramId = "";
        let TelegramId = "";

        this.props.User.ContactData.forEach(item => {

            switch (item.ContactTypeId) {
                case CONTACT_TYPE_PHONE     :
                    Phone = item.ContactValue;
                    break;
                case CONTACT_TYPE_TEL1      :
                    Tel1 = item.ContactValue;
                    break;
                case CONTACT_TYPE_TEL2      :
                    Tel2 = item.ContactValue;
                    break;
                case CONTACT_TYPE_TEL3      :
                    Tel3 = item.ContactValue;
                    break;
                case CONTACT_TYPE_INSTAGRAM :
                    InstagramId = item.ContactValue;
                    break;
                case CONTACT_TYPE_TELEGRAM  :
                    TelegramId = item.ContactValue;
                    break;
            }

        });

        this.setState({Tel1, Tel2, Tel3, Phone, InstagramId, TelegramId});
    }


    render() {

        return (
            <BaseUi
                Loading={this.state.uiLoading}
                ViewStyle={{backgroundColor: DarkPrimaryColor}}>
                <MyHeader
                    buttonLeftShowing={false}
                    showText={true}
                    text={'ویرایش پروفایل'}
                />
                <ScrollView style={{marginBottom: height * 0.001}}>

                    <View style={{height: height * 0.17, justifyContent: 'center', alignItems: 'center'}}>
                        <MyText text={'لطفا اطلاعات کاربری خود را تکمیل کنید'}

                        />
                    </View>


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

                                />
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    Actions.CityDialog({
                                        Type: 1, callBack: (CityName, CityId) => {
                                            this.setState({CityName, CityId, AreaId: null, AreaName: ''});
                                        }
                                    })
                                }}
                                style={{
                                    height: 52,
                                    borderBottomWidth: 1,
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

                                    />
                                </View>

                            </TouchableOpacity>
                        </View>

                    </View>

                    <View>
                        <View style={{marginTop: height * 0.03, marginRight: 15, marginLeft: 15}}>
                            <View style={{height: 29, paddingRight: 5}}>
                                <MyText text={'محله'}/>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    Actions.CityDialog({
                                        CityId: this.state.CityId,
                                        Type: 2,
                                        callBack: (AreaName, AreaId) => this.setState({AreaName, AreaId}),
                                        onFindLocation : () => this.FindLocation().done()
                                    });
                                }}
                                style={{
                                    height: 52,
                                    borderBottomWidth: 1,
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
                            Page: "BusinessEditProfile"
                        })}>
                        <MyText text={'تغییر شماره همراه' + ' (' + this.props.User.Mobile + ') '}
                                componentStyles={{fontSize: Small, color: AccentColor}}
                        />

                    </TouchableOpacity>

                    <View style={{marginRight: '3%', marginTop: height * 0.07}}>
                        <MyText text={'اطلاعات تماس'}
                                componentStyles={{fontSize: Medium}}
                        />
                    </View>

                    <View
                        style={{flexDirection: 'row', paddingRight: '1%', paddingLeft: '1%'}}>
                        <HalfInput
                            maxLength={11}
                            ImageSource={require('../../assets/images/icons/phone.png')}
                            HeaderText={'تلفن ثابت 1'}
                            value={this.state.Tel1}
                            onChangeText={(Tel1) => this.setState({Tel1})}
                            placeholder={'تلفن ثابت 1'}
                            keyboardType={'phone-pad'}
                        />
                        <HalfInput
                            maxLength={11}
                            ImageSource={require('../../assets/images/icons/mobile.png')}
                            HeaderText={'تلفن همراه'}
                            value={this.state.Phone}
                            onChangeText={(Phone) => this.setState({Phone})}
                            placeholder={'تلفن همراه'}
                            keyboardType={'phone-pad'}
                        />
                    </View>

                    <View
                        style={{flexDirection: 'row', paddingRight: '1%', paddingLeft: '1%'}}>
                        <HalfInput
                            maxLength={11}
                            ImageSource={require('../../assets/images/icons/phone.png')}
                            HeaderText={'تلفن ثابت 3'}
                            value={this.state.Tel3}
                            onChangeText={(Tel3) => this.setState({Tel3})}
                            placeholder={'تلفن ثابت 3'}
                            keyboardType={'phone-pad'}
                        />
                        <HalfInput
                            maxLength={11}
                            ImageSource={require('../../assets/images/icons/phone.png')}
                            HeaderText={'تلفن ثابت 2'}
                            value={this.state.Tel2}
                            onChangeText={(Tel2) => this.setState({Tel2})}
                            placeholder={'تلفن ثابت 2'}
                            keyboardType={'phone-pad'}
                        />
                    </View>

                    <View
                        style={{flexDirection: 'row', paddingRight: '1%', paddingLeft: '1%'}}>
                        <HalfInput
                            ImageSource={require('../../assets/images/icons/telegram.png')}
                            HeaderText={'آیدی تلگرام'}
                            value={this.state.TelegramId}
                            onChangeText={(TelegramId) => this.setState({TelegramId})}
                            placeholder={'آیدی تلگرام'}
                        />
                        <HalfInput
                            ImageSource={require('../../assets/images/icons/instagram.png')}
                            HeaderText={'آیدی اینستاگرام'}
                            value={this.state.InstagramId}
                            onChangeText={(InstagramId) => this.setState({InstagramId})}
                            placeholder={'آیدی اینستاگرام'}
                        />

                    </View>

                    <View style={{flexDirection: 'row', paddingRight: '1%', paddingLeft: '1%'}}>
                        <HalfInput
                            multiline={true}
                            ViewStyle={{width: '100%'}}
                            ImageSource={require('../../assets/images/icons/placeholderColor.png')}
                            HeaderText={'نشانی'}
                            value={this.state.Address}
                            onChangeText={(Address) => this.setState({Address})}
                            placeholder={'نشانی'}
                        />

                    </View>

                    <View style={{
                        width: '100%',

                        height: height * 0.35,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: '5%',
                        paddingLeft: '5%'
                    }}>

                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'flex-end'
                            }}>

                            <View style={{width: '100%', height: '80%'}}>

                                <MyMapView
                                    style={{width: '100%', height: '100%'}}
                                    Latitudes={this.state.Latitudes.toString()}
                                    Longitudes={this.state.Longitudes.toString()}
                                />

                            </View>
                            <MyButton
                                viewStyle={{
                                    height: 50,
                                    width: '100%',
                                    marginRight: 0,
                                    marginTop: 2,
                                    marginBottom: 0
                                }}
                                buttonOnPress={() => Actions.ChooseLocation({
                                    Latitudes: this.state.Latitudes.toString(),
                                    Longitudes: this.state.Longitudes.toString(),
                                    callBack: (Latitudes, Longitudes) => this.setState({Latitudes, Longitudes})
                                })}
                                text={"ثبت موقعیت بر روی نقشه"}
                                activityIndicatorColor={"white"}
                            />

                        </View>


                    </View>

                    <View style={{marginRight: '3%', marginTop: '3%'}}>
                        <MyText text={'خدمات و امکانات'}
                                componentStyles={{fontSize: Medium}}
                        />
                    </View>

                    {this.cardItems('خدمات ویژه', TAG_TYPE_VIP_SERVICE, this.getRenderVIPServices.bind(this))}
                    {this.cardItems('امکانات', TAG_TYPE_SERVICE, this.getRenderServices.bind(this))}
                    {this.cardItems('خودروهای تحت پوشش', TAG_TYPE_CARS, this.getRenderCarSupport.bind(this))}

                </ScrollView>
                <MyButton
                    loading={this.state.loading}
                    text={'تایید'}
                    viewStyle={{
                        height: 50, marginRight: 10,
                        marginLeft: 10,
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                    buttonOnPress={() => this.sendDataAPI()}
                />


            </BaseUi>
        )
    }

    cardItems(Title, Type, RenderFunc) {
        return (
            <MyCard>
                <View style={{flexDirection: 'row'}}>

                    <TouchableOpacity
                        style={{
                            width: '10%',
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onPress={() => Actions.SelectTag({
                            Title,
                            Type,
                            onConfirm: (data) => this.setServiceData(Type, data)
                        })}>
                        <FastImage
                            resizeMode={'contain'}
                            style={{width: '90%', height: '75%'}}
                            source={require('../../assets/images/icons/blue-left-arrow.png')}

                        />
                    </TouchableOpacity>
                    <View style={{width: '90%'}}>
                        <MyText text={Title}

                        />
                        <View style={{
                            paddingRight: 10,
                            paddingLeft: 10,
                            marginTop: 10,
                            flexDirection: 'row-reverse',
                            flexWrap: 'wrap'
                        }}>
                            {RenderFunc()}
                        </View>
                    </View>
                </View>

            </MyCard>

        )
    }

    getRenderVIPServices() {

        if (this.state.VIPServices === null)
            return null;

        let Object = [];

        this.state.VIPServices.forEach(item => {
            Object.push(getTagRender(item.ServiceName));
        });

        return Object;
    };

    getRenderServices() {

        if (this.state.Services === null)
            return null;

        let Object = [];

        this.state.Services.forEach(item => {
            Object.push(getTagRender(item.ServiceName));
        });

        return Object;
    }

    getRenderCarSupport() {

        if (this.state.Cars === null)
            return null;

        let Object = [];

        this.state.Cars.forEach(item => {
            Object.push(getTagRender(item.CarName));
        });

        return Object;
    }

    setServiceData(Type, data) {

        switch (Type) {
            case TAG_TYPE_VIP_SERVICE :
                this.setState({VIPServices: data});
                break;
            case TAG_TYPE_SERVICE     :
                this.setState({Services: data});
                break;
            case TAG_TYPE_CARS        :
                this.setState({Cars: data});
                break;
        }

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
            Address: this.state.Address,
            Latitudes: this.state.Latitudes,
            Longitudes: this.state.Longitudes,
            Tel1: this.state.Tel1,
            Tel2: this.state.Tel2,
            Tel3: this.state.Tel3,
            Phone: this.state.Phone,
            InstagramId: this.state.InstagramId,
            TelegramId: this.state.TelegramId,
            AreaId: this.state.AreaId,

        });

        FetchDataFromAPI("UpdateBusinessProfile", Parameter, (response) => {

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

export default connect(mapStateToProps, mapDispatchToProps)(BusinessEditProfile);