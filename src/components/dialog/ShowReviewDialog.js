import React from 'react';
import BaseLightbox from "../basepage/BaseLightbox";
import propTypes from 'prop-types';
import MyText from "../customs/MyText";
import {AppFont, backColor, BorderColor, height} from "../publics/Ui";
import {ScrollView, View , Text} from "react-native";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from 'react-redux';
import MyButton from "../customs/MyButton";
import {Actions} from "react-native-router-flux";

class ShowReviewDialog extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data : [],
            loading : false
        }

    };

    render(){

        return(

            <BaseLightbox
                verticalPercent={0.9}
                horizontalPercent={0.6}
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

                    <MyText
                        text={this.props.ReviewerName}

                    />

                </View>

                <ScrollView style={{
                    width: '93%',
                    backgroundColor: backColor,
                    marginBottom: '5%',
                    borderColor:BorderColor,
                    borderWidth:2,
                    borderRadius:6
                }}>

                    <Text
                        underlineColorAndroid='transparent'
                        style={{
                            fontFamily: AppFont,
                            paddingLeft: 20,
                            paddingRight: 20,
                            textAlign: 'right',
                            textAlignVertical : 'top'
                        }}>
                        {this.props.ReviewDescription}
                    </Text>

                </ScrollView>

                <View style={{width: '100%', alignItems: 'center',justifyContent : 'center' ,marginBottom : 20}}>
                    <MyButton
                        viewStyle={{
                            width: '93%',
                            height: 40,
                            marginRight: '0%',
                            marginLeft: '0%',
                            marginTop: '0%'
                        }}
                        loading={this.state.loading}
                        buttonOnPress={() => this.ReportData()}
                        text={"گزارش تخلف"}
                        activityIndicatorColor={"white"}
                    />

                </View>

            </BaseLightbox>

        );

    }

    ReportData() {


        const Report = () => {

            this.setState({loading: true});

            const Parameter = JSON.stringify({

                ReviewId: this.props.ReviewId

            });

            FetchDataFromAPI("ReportReview", Parameter, (response) => {

                if (response.Success)
                    Actions.ConfirmDialog({Message: response.Message});
                else
                    Actions.ExecptionDialog({Message: response.Message});

            }).done(() => this.setState({loading: false}));

        };

        Actions.QuestionDialog({
            Message: "آیا برای گزارش این نقد و بررسی اطمینان دارید؟",
            onConfirm: () => Report()
        });

    }

}

ShowReviewDialog.propType = {
    ReviewId : propTypes.string.isRequired,
    ReviewDescription : propTypes.string.isRequired,
    ReviewerName : propTypes.string.isRequired
};

const mapStateToProps = (States) => {
    return { User : States.User }
};

export default connect(mapStateToProps)(ShowReviewDialog);