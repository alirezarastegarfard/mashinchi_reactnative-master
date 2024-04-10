import React from 'react';
import propTypes from 'prop-types';
import BaseLightbox from "../basepage/BaseLightbox";
import {height, Medium, PrimaryColor, PrimaryTextColor, SecondaryTextColor, Small, VerySmall} from "../publics/Ui";
import {View} from "react-native";
import Rate from "../customs/Rate";
import MyText from "../customs/MyText";
import {Actions} from "react-native-router-flux";
import MyButton from "../customs/MyButton";
import {FetchDataFromAPI} from "../publics/DataBase";


export default class RatingDialog extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            Rate: this.props.Rate
        }

    }

    render() {

        return (

            <BaseLightbox
                verticalPercent={0.94}
                horizontalPercent={0.45}
                cancelOutTouchSide={true}
                jContent={'flex-start'}>

                <View style={{borderRadius: 10, backgroundColor: 'white', width: '100%', height: '100%'}}>
                    <View
                        style={{height: 160, justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{height: 150, justifyContent: 'space-around', alignItems: 'center'}}>
                            <MyText text={'چه امتیازی به این نمایندگی می دهید ؟'}
                                    componentStyles={{color: PrimaryColor,fontSize:Medium}}

                            />
                            <MyText
                                text={'با ارائه نظر خود به ما کمک کنید تا' + '\n' + ' پیشنهادهای بهتری را به شما ارائه کنیم'}
                                componentStyles={{color: SecondaryTextColor, textAlign: 'center',fontSize:VerySmall}}


                            />
                        </View>
                    </View>
                    <View>
                        <Rate
                            onChangeRate={(Rate) => this.setState({Rate})}
                            Rate={this.state.Rate}
                        />
                    </View>


                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
                        <MyButton
                            viewStyle={{
                                width: '30%',
                                height: 40, marginRight: '0%',
                                marginLeft: '0%',
                                marginTop: '0%'
                            }}
                            loading={this.state.loading}
                            buttonOnPress={() => this.setBusinessRate()}
                            text={"ثبت امتیاز"}
                            activityIndicatorColor={"white"}
                        />

                    </View>
                </View>

            </BaseLightbox>

        );

    }

    setBusinessRate() {

        const Params = JSON.stringify({

            UserId: this.props.UserId,
            BusinessUserId: this.props.BusinessUserId,
            Rate: this.state.Rate

        });

        this.setState({loading: true});

        FetchDataFromAPI("setRating", Params, (response) => {

            Actions.pop();

            if (response.Success)
                Actions.ConfirmDialog({Message: response.Message});
            else
                Actions.ExceptionDialog({Message: response.Message});

        }).done();

    }

}

RatingDialog.propType = {
    UserId: propTypes.string,
    BusinessUserId: propTypes.string,
    BusinessFullName: propTypes.string,
    Rate: propTypes.number
};