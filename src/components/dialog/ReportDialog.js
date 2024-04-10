import React from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import MyText from "../customs/MyText";
import BaseLightbox from "../basepage/BaseLightbox";
import { Small} from "../publics/Ui";

export default class ReportDialog extends React.Component{

    render(){

        const { Context = null } = this.props;

        return(
            <BaseLightbox
                verticalPercent={.9}
                horizontalPercent={.12}
                jContent={'center'}
                aItems={'stretch'}>

                <View style={MenuStyle.Container}>

                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Context();
                            Actions.pop();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"گزارش تخلف"}
                        />
                    </TouchableOpacity>
                </View>


            </BaseLightbox>
        );
    }

}

const MenuStyle = StyleSheet.create({

    Container : {
        flex : 1,
        alignItems: 'center',
    },
    ItemStyle : {
        padding : '5%',
        height: 50,
        width : '100%',
        justifyContent: 'center'
    },
    TextStyle : {
        fontSize : Small
    }

});