import React from 'react';
import {View,Platform} from 'react-native';
import propTypes from 'prop-types';
import MapView  , { PROVIDER_GOOGLE , Marker } from "react-native-maps";

let CameraProps = null;

export default class MyMapView extends React.PureComponent{

    constructor(props){
        super(props);
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
                        latitude: Number.parseFloat(this.props.Latitudes),
                        longitude: Number.parseFloat(this.props.Longitudes),
                    }
                }
            };

        }


        return (

            <View
                {...this.props}>

                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{
                        width : '100%',
                        height : '100%',
                    }}
                    region={{
                        latitude: Number.parseFloat(this.props.Latitudes),
                        longitude: Number.parseFloat(this.props.Longitudes),
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    {...CameraProps}
                    scrollEnabled={false}
                    cacheEnabled>

                    <Marker
                        coordinate={{
                            latitude: Number.parseFloat(this.props.Latitudes),
                            longitude: Number.parseFloat(this.props.Longitudes)
                        }}
                        title={this.props.MarkerTitle}
                        description={this.props.MarkerDescription}
                    />

                </MapView>

            </View>
        );
    }

}

MyMapView.propTypes = {

    Latitudes : propTypes.string,
    Longitudes : propTypes.string,
    MarkerTitle : propTypes.string,
    MarkerDescription : propTypes.string

};

MyMapView.defaultProps = {
    Latitudes : "35.6892",
    Longitudes : "51.3890",
    MarkerTitle : '',
    MarkerDescription : ''

};
