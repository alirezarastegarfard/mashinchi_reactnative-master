import React from 'react';
import {Platform,TouchableOpacity,Image} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import propTypes from "prop-types";
import BaseUi from "../basepage/BaseUi";
import {AccentColor, backColor, SecondaryTextColor} from "../publics/Ui";
import MyHeader from "../customs/MyHeader";
import {getCurrentLocation, ScreenHeight, ScreenWidth} from "../publics/Function";
import MyButton from "../customs/MyButton";
import {Actions} from 'react-native-router-flux';
import FastImage from "react-native-fast-image";

let CameraProps = null;
let Region = null;

export default class ChooseLocation extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            Latitudes: this.props.Latitudes,
            Longitudes: this.props.Longitudes,
            loading : false
        };

    }

    async gotoMyLocation(): void {

        try {

            this.setState({loading : true});

            const Location = await getCurrentLocation();

            Region = {

                region : {
                    latitude: Number.parseFloat(Location.latitude),
                    longitude: Number.parseFloat(Location.longitude),
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }

            };

            this.setState({Latitudes: Location.latitude, Longitudes: Location.longitude , loading : false});
        }catch (e) {

            Region = {

                region : {
                    latitude: Number.parseFloat("35.6892"),
                    longitude: Number.parseFloat("51.3890"),
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }

            };

            this.setState({Latitudes: "35.6892", Longitudes: "51.3890" , loading : false});
        }

    }

    render() {

        if (Platform.OS === 'android') {

            CameraProps = {

                initialCamera: {
                    altitude: 0,
                    heading: 0,
                    pitch: 0,
                    zoom: 15,
                    center: {
                        latitude: Number.parseFloat(this.state.Latitudes),
                        longitude: Number.parseFloat(this.state.Longitudes),
                    }
                }
            };

        }

        return(

            <BaseUi
                Loading={this.state.loading}
                ViewStyle={{ flex : 1, backgroundColor : backColor }}
                {...this.props}>

                <MyHeader
                    buttonLeftShowing={false}
                    showText={true}
                    text={'انتخاب موقعیت'}
                />

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{
                        width : '100%',
                        height : ScreenHeight * .8,
                    }}
                    initialRegion={{
                        latitude: Number.parseFloat(this.props.Latitudes),
                        longitude: Number.parseFloat(this.props.Longitudes),
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121
                    }}
                    {...CameraProps}
                    {...Region}
                    scrollEnabled={true}
                    cacheEnabled
                    onPress={ (e) => {

                        Region = null;

                        this.setState({
                            Latitudes : e.nativeEvent.coordinate.latitude ,
                            Longitudes : e.nativeEvent.coordinate.longitude });

                    }}>

                    <Marker
                        coordinate={{
                            latitude: Number.parseFloat(this.state.Latitudes),
                            longitude: Number.parseFloat(this.state.Longitudes)
                        }}
                        title={"موقعیت شما"}
                    />

                </MapView>

                <MyButton
                    text={'انتخاب موقعیت'}
                    viewStyle={{
                        marginLeft : 0,
                        marginRight : 0,
                        marginTop:0,
                        marginBottom : 0,
                        bottom : 0,
                        width : ScreenWidth,
                        left : 0,
                        right : 0,
                        height : ScreenHeight * .1
                    }}
                    buttonOnPress={ () => {

                        if (this.props.callBack !== null)
                            this.props.callBack(this.state.Latitudes , this.state.Longitudes);

                        Actions.pop();
                    }}
                />

                <TouchableOpacity
                    style={{
                        width : 60,
                        height : 60,
                        borderRadius : 30,
                        borderWidth : .5,
                        borderColor : SecondaryTextColor,
                        justifyContent : 'center',
                        alignItems : 'center',
                        position : 'absolute',
                        bottom : '12%',
                        right : 15,
                        backgroundColor : backColor
                    }}
                    activeOpacity={.6}
                    onPress={ () => this.gotoMyLocation() }>

                    <Image
                        source={require('../../assets/images/icons/gps-indicator.png')}
                        style={{ width : 25 , height : 25 , tintColor : AccentColor }}
                        resizeMode={'contain'}
                    />


                </TouchableOpacity>

            </BaseUi>


        );
    }

}

ChooseLocation.propTypes = {

    Latitudes  : propTypes.string,
    Longitudes : propTypes.string,
    callBack   : propTypes.func
};

ChooseLocation.defaultProps = {
    Latitudes : "35.6892",
    Longitudes :"51.3890",
    callBack   : null
};