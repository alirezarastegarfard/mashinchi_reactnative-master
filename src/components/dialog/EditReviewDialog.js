import React from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import MyText from "../customs/MyText";
import BaseLightbox from "../basepage/BaseLightbox";
import { Small} from "../publics/Ui";

export default class EditReviewDialog extends React.Component{

    render(){

        const { Context = null } = this.props;

        return(
            <BaseLightbox
                verticalPercent={.9}
                horizontalPercent={.17}
                jContent={'center'}
                aItems={'stretch'}>



                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Actions.pop();
                            Context.onEditClick();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"ویرایش نقد و بررسی..."}
                        />
                    </TouchableOpacity>






                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Actions.pop();
                            Context.RemoveClick();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"حذف نقد و بررسی"}
                        />
                    </TouchableOpacity>





            </BaseLightbox>
        );
    }

}

const MenuStyle = StyleSheet.create({

    Container : {
        alignItems: 'center',

    },
    ItemStyle : {
        padding : '5%',
        height: '50%',
        width : '100%',
        justifyContent: 'center',

    },
    TextStyle : {
        height: '100%', fontSize :Small,

    }

});