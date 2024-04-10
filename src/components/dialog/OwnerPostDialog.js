import React from 'react';
import BaseLightbox from "../basepage/BaseLightbox";
import {TouchableOpacity, View,StyleSheet} from "react-native";
import MyText from "../customs/MyText";
import { Small} from "../publics/Ui";
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {VISIBLE} from "../publics/Constant";

class OwnerPostDialog extends React.Component{

    constructor(props){
        super(props);
    }

    render(){

        const { Parent = null , Visible = VISIBLE } = this.props;

        return(

            <BaseLightbox
                verticalPercent={.9}
                horizontalPercent={.26}
                jContent={'center'}
                aItems={'stretch'}>

                <View style={MenuStyle.Container}>

                    <TouchableOpacity
                        style={[
                            MenuStyle.ItemStyle
                        ]}
                        onPress={() => {
                            Parent.setVisiblePost();
                            Actions.pop();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={Visible === VISIBLE ? "پنهان کردن" : "قابل مشاهده" }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Actions.pop();
                            Actions.EditPostDialog({ Parent });
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"ویرایش پست"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Actions.pop();
                            Parent.deletePost();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"حذف پست"}
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
        fontSize :Small
    }

});

const mapStateToProps = (states) => {

    return {
        User: states.User
    };

};

export default connect(mapStateToProps)(OwnerPostDialog);