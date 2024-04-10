import React from "react";
import MyHeader from "../customs/MyHeader";
import BaseUi from "../basepage/BaseUi";
import {
    AccentColor,

    Medium,

    PrimaryTextColor,
    SecondaryTextColor,

} from "../publics/Ui";
import {Image, StyleSheet, View, ScrollView} from "react-native";
import MyText from "../customs/MyText";
import MyInput from "../customs/MyInput";
import MyCheckBox from "../customs/MyCheckBox";
import MyButton from "../customs/MyButton";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import ForumSortingPage from "./ForumSortingPage";
import propTypes from "prop-types";
import {Actions} from "react-native-router-flux";


class CreateQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Subject: '',
            Question: '',
            HasNotification: true,
            Loading: false
        }
    }


    render() {
        return (
            <BaseUi>
                <MyHeader
                    text={'انجمن'}
                    showText={true}
                />
                <ScrollView>
                    <View style={FormStyle.FormTitle}>
                        <MyText
                            text={ ' انجمن ' + this.props.GroupName}
                            componentStyles={{fontSize:  Medium, color: PrimaryTextColor}}
                        />
                    </View>
                    <View style={{paddingRight: 20}}>

                        <View style={FormStyle.Subject}>
                            <MyText
                                text={'موضوع'}
                                componentStyles={{fontSize:  Medium, color: PrimaryTextColor}}
                            />

                        </View>

                        <View style={{marginTop: 10}}>
                            <MyInput

                                value={this.state.Subject}
                                onChangeText={(Subject) => this.setState({Subject: Subject})}
                                placeholder={"موضوع"}
                                viewStyle={{marginRight: 0, marginLeft: 20, height: 60}}
                            />
                        </View>


                        <View style={FormStyle.Question}>
                            <MyText

                                text={'متن سوال'}
                                componentStyles={{fontSize: Medium, color: PrimaryTextColor}}
                            />

                        </View>

                        <View style={{marginTop: 10}}>
                            <MyInput

                                value={this.state.Question}
                                onChangeText={(Question) => this.setState({Question: Question})}
                                textAlignVertical='top'
                                placeholder={"متن سوال"}
                                multiline={true}
                                viewStyle={{marginRight: 0, marginLeft: 20, height: 320}}

                            />
                        </View>

                        <View style={FormStyle.Info}>
                            <MyText
                                text={' در صورت ثبت پاسخ به من اطلاع بده '}
                                componentStyles={{color: SecondaryTextColor}}
                            />

                            <MyCheckBox
                                componentStyles={{marginLeft: '2%', marginTop: '.5%'}}
                                Checked={this.state.HasNotification}
                                GetCondition={(Condition) => {
                                    this.setState({HasNotification: !Condition});
                                }}
                            />


                        </View>
                        <View style={{justifyContent: 'center', alignItems: 'center', marginTop: '4%'}}>
                            <MyText
                                text={' قوانین و مقررات انجمن را خوانده ام و قبول دارم '}
                                componentStyles={{ color: AccentColor}}
                            />
                        </View>


                    </View>
                    <MyButton
                        loading={this.state.Loading}
                        buttonOnPress={() => this.SendQuestionData()}
                        text={'ثبت سوال'}

                        viewStyle={{
                            marginRight: '6%',
                            marginLeft: '6%',
                            marginBottom: 3,
                            marginTop: '2%', height: 55,
                        }}/>

                </ScrollView>


            </BaseUi>
        )
    }

    checkInput() {

        const state = this.state;


        if (state.Subject.trim() === "") {
            Actions.ExceptionDialog({Message: "موضوع الزامی است"});
            return false;
        }

        if (state.Question.trim() === "") {
            Actions.ExceptionDialog({Message: "متن سوال الزامی است "});
            return false;
        }


        if (state.Subject.length > 100) {
            Actions.ExceptionDialog({Message: " حداکثر تعداد کاراکتر برای موضوع 100 می باشد"});
            return false;
        }

        return true;
    }

    SendQuestionData() {


        if (!this.checkInput()) {
            return;
        }
        this.setState({Loading: true});

        let Parameter = JSON.stringify({
            Description: this.state.Question,
            Subject: this.state.Subject,
            UserID_FK: this.props.User.ID,
            ConnectionID_FK: this.props.connectionID,
            HasNotifications: this.state.HasNotification,
        });



        FetchDataFromAPI("InsertQuestion", Parameter, (response) => {

            if (!response.Success) {
                Actions.ExceptionDialog({Message: response.Message});
                return;
            }

            if (response.Success) {
                Actions.ConfirmDialog({
                    Message: response.Message, onConfirm: () => {
                        Actions.pop();
                        this.props.CallBack(response.Response[0]);
                    }
                });
            }

        }).done(() => this.setState({Loading: false}))

    }

}

ForumSortingPage.propTypes = {
    connectionID : propTypes.string,
    GroupName    : propTypes.string,
    CallBack     : propTypes.func,

};
const FormStyle = StyleSheet.create({
    FormTitle: {justifyContent: 'center', alignItems: 'center', marginTop: 4},
    Subject: {justifyContent: 'center', alignItems: 'flex-end', marginTop: 10},
    Question: {justifyContent: 'center', alignItems: 'flex-end', marginTop: 10},
    Info: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 7}
});

const mapStateToProps = (states) => {
    return {
        User: states.User,
    };
};

export default connect(mapStateToProps)(CreateQuestion);