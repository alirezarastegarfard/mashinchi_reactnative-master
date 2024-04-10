import React from 'react';
import {StyleSheet, View} from 'react-native';
import BaseLightbox from "../basepage/BaseLightbox";
import {height, Medium, SecondaryTextColor, width} from "../publics/Ui";
import MyText from "../customs/MyText";
import MyButton from "../customs/MyButton";
import MyInput from "../customs/MyInput";
import {connect} from "react-redux";
import {FetchDataFromAPI} from "../publics/DataBase";
import {Actions} from "react-native-router-flux";
import propTypes from "prop-types"

 class AnswerQuestionDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            Loading: false,
            Answer:''
        }
    }

    render() {

        return (

            <BaseLightbox
                verticalPercent={0.85}
                horizontalPercent={0.7}
                cancelOutTouchSide={true}
                jContent={'flex-start'}>
                <View style={{backgroundColor: 'white'}}>
                    <View style={FormStyle.HeaderViewStyle}>
                        <MyText
                            componentStyles={{
                                fontSize:Medium,
                            }}
                            text={' پاسخ به سوال '}/>

                    </View>
                    <View style={{alignItems: 'flex-end', marginTop: 10}}>
                        <View style={{marginBottom: 5}}>
                            <MyText
                                componentStyles={{
                                    color: SecondaryTextColor,

                                }}
                                text={'پاسخ خود را بنویسید '}/>

                        </View>
                        <View>
                            <MyInput

                                value={this.state.Answer}
                                onChangeText={(Answer) => this.setState({Answer: Answer})}
                                textAlignVertical='top'
                                placeholder={"متن پاسخ"}

                                multiline={true}
                                viewStyle={FormStyle.inputStyle}

                            />
                        </View>

                        <MyButton

                             loading={this.state.Loading}
                            buttonOnPress={()=>{this.SendData()}}
                            text={'ارسال پاسخ'}
                            viewStyle={FormStyle.btnStyle}/>
                    </View>

                </View>


            </BaseLightbox>

        );

    }

     checkInput() {

         const state = this.state;



         if (state.Answer.trim() === "") {
             Actions.ExceptionDialog({Message: "پاسخ الزامی است"});
             return false;
         }



         return true;
     }

     SendData() {

         if (!this.checkInput()) {
             return;
         }

         this.setState({Loading: true});

         let Parameter = JSON.stringify({
             QuestionID_FK: this.props.ID,
             Answer: this.state.Answer,
             UserID_Fk: this.props.User.ID,
         });



         FetchDataFromAPI("InsertReply", Parameter, (response) => {
             if (!response.Success) {
                 Actions.ExceptionDialog({Message: response.Message});
                 return;
             }
             if (response.Success) {
                 Actions.ConfirmDialog({Message: response.Message, onConfirm: () =>{Actions.pop();this.props.CallBack(response.Response[0]);} });
             }


         }).done(() => this.setState({Loading: false}))

     }

}

const FormStyle = StyleSheet.create({
    btnStyle: {
        marginRight: '0%',
        marginLeft: '0%',
        marginBottom: '0%',
        marginTop: '2%', height: 53,
        width: '100%'
    },
    inputStyle: {
        marginRight: 0,
        marginLeft: 0, height: height * 0.49, width: width * 0.8
    },
    HeaderViewStyle: {marginTop: 7, justifyContent: 'center', alignItems: 'center'}

});

AnswerQuestionDialog.propTypes = {
    ID: propTypes.string

};

const mapStateToProps = (states) => {
    return {
        User: states.User,
    };
};

export default connect(mapStateToProps)(AnswerQuestionDialog);


