import React from 'react';
import {TextInput, View} from 'react-native';
import BaseLightbox from "../basepage/BaseLightbox";
import {
    AppFont,
    backColor, BorderColor,
    height,
    SecondaryTextColor, VerySmall
} from "../publics/Ui";
import MyText from "../customs/MyText";
import {Actions} from "react-native-router-flux";
import MyButton from "../customs/MyButton";
import propTypes from "prop-types";
import {FetchDataFromAPI} from "../publics/DataBase";

export default class CriticizeDialog extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            Review : this.props.LastReview,
            ReviewId : this.props.LastReviewId
        }

    }

    render() {

        return (

            <BaseLightbox
                verticalPercent={0.9}
                horizontalPercent={0.56}
                cancelOutTouchSide={true}
                jContent={'flex-start'}>

                <View style={{
                    width: '100%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:'white',
                    borderRadius:10
                }}>

                    <MyText text={this.props.BusinessFullName}
                          />
                </View>

                <View style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight: 20,
                    marginBottom: 10,
                    backgroundColor:'white'
                }}>



                    <View style={{
                        height: height * .38,
                        width: '93%',
                        backgroundColor: backColor,
                        marginBottom: '5%',
                        borderColor:BorderColor,
                        borderWidth:2,
                        borderRadius:6
                    }}>

                        <TextInput
                            underlineColorAndroid='transparent'
                            multiline={true}
                            placeholder={"نقد و بررسی خود را بنوسید ..."}
                            placeholderTextColor={SecondaryTextColor}
                            style={{
                                fontSize: VerySmall,
                                fontFamily: AppFont,
                                flex: 1,
                                paddingLeft: 20,
                                paddingRight: 20,
                                textAlign: 'right',
                                minHeight: 30,
                                textAlignVertical : 'top',
                            }}
                            value={this.state.Review}
                            onChangeText={( Review ) => this.setState({Review})}
                        />
                    </View>

                    <View style={{width: '100%', alignItems: 'flex-end'}}>
                        <MyButton
                            viewStyle={{
                                width: '93%',
                                height: 40,
                                marginRight: '0%',
                                marginLeft: '0%',
                                marginTop: '0%'
                            }}
                            loading={this.state.loading}
                            buttonOnPress={() => this.setReview()}
                            text={"ثبت نقد و بررسی"}
                            activityIndicatorColor={"white"}
                        />

                    </View>


                </View>


            </BaseLightbox>

        );

    }

    setReview(){

        const Params = JSON.stringify({

            ReviewId     : this.props.LastReviewId,
            ReviewerId   : this.props.UserId,
            CriticizedId : this.props.BusinessUserId,
            Review       : this.state.Review

        });

        this.setState({ loading : true });

        const WebServiceName = this.props.LastReviewId === null ? "setProfileReview" : "EditProfileReview";

        FetchDataFromAPI(WebServiceName , Params , (response) => {

            Actions.pop();

            if (response.Success) {

                if (this.props.onReviewSave !== null)
                    this.props.onReviewSave(response.Response);

                Actions.ConfirmDialog({Message: response.Message});
            }else
                Actions.ExceptionDialog({ Message : response.Message });

        }).done();

    }

}

CriticizeDialog.propType = {
    ReviewId         : propTypes.string,
    UserId           : propTypes.string,
    BusinessUserId   : propTypes.string,
    BusinessFullName : propTypes.string,
    onReviewSave     : propTypes.func,
    LastReviewId     : propTypes.string
};

CriticizeDialog.defaultProps = {
    LastReviewId : null,
    LastReview   : '',
    onReviewSave : null
};