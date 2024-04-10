import React, {PureComponent} from "react";
import {Image, Linking, View} from "react-native";
import {
    badgeColor,
    height, Medium,
    PrimaryTextColor,
    SecondaryTextColor, Small, VerySmall, width
} from "../../../../publics/Ui";
import MyText       from "../../../../customs/MyText";
import MyButton     from "../../../../customs/MyButton";
import IconTextList from "../../../../customs/List/IconTextList";
import ColumnIconTextList from "../../../../customs/List/ColumnIconTextList";
import MyMapView from "../../../../customs/MyMapView";
import MyCard from "../../../../customs/MyCard";
import FastImage from "react-native-fast-image";
import {showDirectionOnGoogleMap} from "../../../../publics/Function";


export default class Information extends PureComponent {

    constructor(props){
        super(props);

        this.state = {
            ProfileData : this.props.profileData,
            ContactData : this.props.profileData.ContactData,
            Services    : this.props.profileData.Services,
            VIPServices : this.props.profileData.VIPServices,
            Cars        : this.props.profileData.Cars
        };

    }

    render() {

        return (
                <View
                    style={{
                        marginBottom: height * 0.02
                    }}>
                    <MyCard  >
                        <View style={{
                            height: height * 0.05,
                            width: '100%', alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                            <View
                                style={{
                                    height: 30,
                                    width: 70,
                                    backgroundColor: badgeColor,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 7
                                }}>

                                <FastImage
                                    resizeMode='contain'
                                    style={{height: '70%', width: '50%', borderRadius: 12, marginRight: 4}}
                                    source={require('../../../../../assets/images/icons/star_empty.png')}

                                />

                                <MyText text={this.state.ProfileData.Rate}
                                        componentStyles={{color: 'white', fontSize: VerySmall}}/>
                            </View>
                            <View
                                style={{
                                    width:width-100,marginRight:10
                                }}>
                                <MyText text={this.state.ProfileData.FullName}
                                        componentStyles={{color: PrimaryTextColor, fontSize: Medium}}/>

                            </View>
                        </View>
                        <View style={{marginTop: height * 0.01}}>

                            <MyText
                                text={this.state.ProfileData.Status}
                                componentStyles={{color: SecondaryTextColor, fontSize:Small}}/>
                        </View>
                    </MyCard>
                    <MyCard>
                        <View style={{
                            height: 35, flexDirection: 'row',
                            justifyContent: 'flex-end', alignItems: 'center',
                            marginBottom: height * 0.01,

                        }}>

                            <MyText text={'اطلاعات تماس'}
                                    componentStyles={{color: SecondaryTextColor, fontSize: Medium}}/>
                            <FastImage
                                resizeMode='contain'
                                style={{height: '80%', width: '8%', marginLeft: '2%'}}
                                source={require('../../../../../assets/images/icons/id.png')}
                            />
                        </View>
                        <IconTextList
                            key={"ICON"}
                            Contacts={this.state.ContactData} />
                    </MyCard>
                    <MyCard>

                            <View style={{
                                height: height * 0.04,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'flex-end'
                            }}>
                                <MyText text={'آدرس'}
                                        componentStyles={{color: SecondaryTextColor, fontSize: Medium}}/>
                                <FastImage
                                    resizeMode='contain'
                                    style={{height: 30, width:30, marginLeft: '1%'}}
                                    source={require('../../../../../assets/images/icons/Location.png')}
                                />
                            </View>

                            <View style={{

                                paddingRight: '5%',
                                paddingLeft : '5%',
                                paddingTop: 5
                            }}>

                                <MyText text={this.state.ProfileData.Address}
                                        componentStyles={{color: SecondaryTextColor, fontSize: Small}}/>

                                <View
                                    style={{
                                        width: '100%',
                                        height: height * 0.3,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        marginTop: height * 0.02,
                                        marginBottom: height * 0.02
                                    }}>

                                    <View style={{width: '100%', height: height * 0.25}}>

                                        <MyMapView
                                            style={{ width : '100%' , height:'100%' }}
                                            Latitudes={this.state.ProfileData.Latitudes}
                                            Longitudes={this.state.ProfileData.Longitudes}
                                        />

                                    </View>
                                    <MyButton
                                        viewStyle={{
                                            height: 40, width: '100%', marginRight: 0, marginTop: 2
                                        }}
                                        buttonOnPress={() => this.Direction()}
                                        text={"مسیر یابی تا این مکان"}
                                        activityIndicatorColor={"white"}
                                    />
                                </View>
                            </View>

                    </MyCard>
                    <MyCard>
                        <View style={{
                            height: height * 0.04,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginBottom: height * 0.01
                        }}>
                            <MyText text={'خدمات ویژه'}
                                    componentStyles={{color: SecondaryTextColor, fontSize: Medium}}/>
                            <FastImage
                                resizeMode='contain'
                                style={{height: 26, width: 26, marginLeft: '1%'}}
                                source={require('../../../../../assets/images/icons/vip.png')}
                            />

                        </View>
                        <ColumnIconTextList
                            listKey={"VIP"}
                            Data={this.state.VIPServices}
                            Icon={require('../../../../../assets/images/icons/badge_vip.png')}/>
                    </MyCard>
                    <MyCard>
                        <View style={{
                            height: height * 0.04,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginBottom: height * 0.01
                        }}>
                            <MyText text={'امکانات'}
                                    componentStyles={{marginTop:2,color: SecondaryTextColor, fontSize:Medium}}/>
                            <FastImage
                                resizeMode='contain'
                                style={{height: 25, width: 25, marginLeft: '1%'}}
                                source={require('../../../../../assets/images/icons/repair.png')}
                            />


                        </View>
                        <ColumnIconTextList
                            listKey={"SERVICE"}
                            Data={this.state.Services}
                            Icon={require('../../../../../assets/images/icons/badge_normal.png')}/>
                    </MyCard>

                    <MyCard>
                        <View style={{
                            height: height * 0.04,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            marginBottom: height * 0.01
                        }}>
                            <MyText text={'خودروهای تحت پوشش'}
                                    componentStyles={{marginTop:2,color: SecondaryTextColor, fontSize: Medium}}/>
                            <FastImage
                                resizeMode='contain'
                                style={{height: 25, width: 25, marginLeft: '1%'}}
                                source={require('../../../../../assets/images/icons/cars.png')}
                            />
                        </View>

                       <ColumnIconTextList
                            listKey={"CARS"}
                            Data={this.state.Cars}
                            ShowIcon={true}
                            Icon={require('../../../../../assets/images/icons/badge_normal.png')}/>

                    </MyCard>


                </View>
        )
    }

    Direction() {
        showDirectionOnGoogleMap(this.state.ProfileData.Latitudes,this.state.ProfileData.Longitudes).done();
    }
}
