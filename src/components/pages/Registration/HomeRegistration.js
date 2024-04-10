import React from "react";
import BaseUi from "../../basepage/BaseUi";
import {View} from "react-native";
import MyText from "../../customs/MyText";
import {AccentColor, ButtonColor, SecondaryTextColor} from "../../publics/Ui";
import ProgramImage from "../../customs/ProgramImage";
import MyButton from "../../customs/MyButton";
import {Actions} from 'react-native-router-flux';


export default class HomeRegistration extends React.Component {
    render() {

        return (
            <BaseUi>

                <ProgramImage componentHeight={.42}/>

                <MyButton
                    buttonOnPress={()=>Actions.InsertMobile({Type:"Registration"})}
                    viewStyle={{height: 71}}
                    text={"ثبت نام در ماشینچی"}
                    activityIndicatorColor={"white"}
                />

                <View style={{
                    marginRight: '7%',
                    marginTop: '5%',
                    marginLeft: '7%',
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',

                }}>
                    <View style={{height: '5%', width: '45%', backgroundColor: SecondaryTextColor}}/>

                    <MyText text={'   یا   '}/>

                    <View style={{height: '5%', width: '45%', backgroundColor: SecondaryTextColor}}/>

                </View>
                <View style={{
                    marginTop: '5%',
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',

                }}>

                    <MyText text={"در ماشینچی ثبت نام کرده اید؟"}
                            componentStyles={{color: SecondaryTextColor}}
                    />
                </View>


                <MyButton
                    buttonOnPress={()=>Actions.Login()}
                    textStyle={{color: AccentColor}}
                    touchableOpacityStyle={{backgroundColor: ButtonColor}}
                    viewStyle={{height: 45, marginTop: 0, borderWidth: 1, borderColor: AccentColor}}
                    text={"ورود"}
                    activityIndicatorColor={AccentColor}
                />
            </BaseUi>
        )
    }

}
