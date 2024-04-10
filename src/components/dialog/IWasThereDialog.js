import React from 'react';
import {Image, View} from 'react-native';
import BaseLightbox from "../basepage/BaseLightbox";
import {
    height, Medium, PrimaryTextColor,
    SecondaryTextColor
} from "../publics/Ui";
import MyText from "../customs/MyText";
import {Actions} from "react-native-router-flux";
import MyButton from "../customs/MyButton";
import propType from 'prop-types';
import {FetchDataFromAPI} from "../publics/DataBase";
import FastImage from "react-native-fast-image";

export default class IWasThereDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false
        }
    }
    render() {
        return (
            <BaseLightbox
                verticalPercent={0.72}
                horizontalPercent={0.34}
                cancelOutTouchSide={true}
                jContent={'flex-start'}>

                <View style={{
                    width: '100%', height: '100%',
                    alignItems: 'center',
                    justifyContent:'center',
                    backgroundColor: 'white', borderRadius: 10,
                    padding: 1,
                    paddingTop: 10
                }}>
                    <View>
                        <FastImage
                            resizeMode='contain'
                            style={{height: 50, width: 50}}
                            source={require('../../assets/images/icons/checkLocationBlue.png')}
                        />
                    </View>

                    <View style={{paddingRight:10,paddingLeft:10,alignItems: 'center',justifyContent:'center', marginTop: 10, marginBottom: 20 }}>
                        <MyText text={this.props.BusinessFullName}
                                componentStyles={{color: PrimaryTextColor, fontSize: Medium}}

                        />
                        <View style={{alignItems: 'center',justifyContent:'center', marginTop: 10}}>
                            <MyText text={this.props.BusinessAddress}
                                    componentStyles={{color: SecondaryTextColor}}

                            />
                        </View>

                    </View>

                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <MyButton
                            viewStyle={{
                                width: '80%',
                                height:35 , marginRight: 0,
                                marginLeft: 0,
                                marginTop: 0
                            }}
                            loading={this.state.loading}
                            buttonOnPress={() => this.IWasThereClick()}
                            text={"اینجا بوده ام"}
                            activityIndicatorColor={"white"}
                        />

                    </View>


                </View>


            </BaseLightbox>

        );

    }

    IWasThereClick() {

        const Params = JSON.stringify({

            UserId: this.props.UserId,
            BusinessUserId: this.props.BusinessUserId

        });

        this.setState({loading: true});

        FetchDataFromAPI("setIWasThere", Params, (response) => {

            Actions.pop();

            if (response.Success)
                Actions.ConfirmDialog({Message: response.Message});
            else
                Actions.ExceptionDialog({Message: response.Message});

        }).done();

    }

}

IWasThereDialog.propTypes = {

    UserId: propType.string,
    BusinessUserId: propType.string,
    BusinessFullName: propType.string,
    BusinessAddress: propType.string,

};

