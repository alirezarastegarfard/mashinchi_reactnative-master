import React from 'react';
import BaseLightbox from "../basepage/BaseLightbox";
import {TouchableOpacity, View,StyleSheet} from "react-native";
import MyText from "../customs/MyText";
import { Small} from "../publics/Ui";
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

class PostOptionDialog extends React.Component{

    constructor(props){
        super(props);
    }

    render(){

        const { Banner = null , ShowInstagram = true } = this.props;

        return(

            <BaseLightbox
                verticalPercent={.9}
                horizontalPercent={ShowInstagram ? .26 : .20}
                jContent={'center'}
                aItems={'stretch'}>

                <View style={MenuStyle.Container}>

                    <TouchableOpacity
                        style={[
                            MenuStyle.ItemStyle,
                            {display : ShowInstagram ? 'flex' : 'none'}
                        ]}
                        onPress={() => {
                            Banner.openPostonInstagram();
                            Actions.pop();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"نمایش در اینستاگرام..."}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Banner._sharePost();
                            Actions.pop();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"اشتراک گزاری..."}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={MenuStyle.ItemStyle}
                        onPress={() => {
                            Banner.savePostOnDevice();
                            Actions.pop();
                        }}>
                        <MyText
                            componentStyles={MenuStyle.TextStyle}
                            text={"ذخیره در گالری"}
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

const mapStateToProps = (states) => {

    return {
        User: states.User
    };

};

export default connect(mapStateToProps)(PostOptionDialog);