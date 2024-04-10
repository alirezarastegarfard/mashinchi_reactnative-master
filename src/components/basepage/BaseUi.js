import React from "react";
import {SafeAreaView, StatusBar, StyleSheet, View} from "react-native";
import Animation from 'lottie-react-native';
import PropTypes from 'prop-types';
import {AccentColor, backColor, height, SecondaryTextColor, width} from "../publics/Ui";
import MyText from "../customs/MyText";
import wheel from '../../assets/lottie/loadingNew';

class BaseUi extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const {children, ViewStyle} = this.props;
        return (

            <SafeAreaView style={[Styles.InnerViewStyle, ViewStyle]}>

                <StatusBar
                    backgroundColor={backColor}
                    barStyle={"dark-content"}/>

                {children}

                {this.renderLoading()}

            </SafeAreaView>

        )

    }

    renderLoading(){

        if (!this.props.Loading)
           return null;

        return(

            <View style={{
                height: height,
                width: width,
                backgroundColor: 'rgba(0,0,0,.6)',
                justifyContent: 'center',
                alignItems: 'center',
                position : 'absolute',
                top : 0,
                left : 0,
                right : 0,
                bottom : 0
            }}>
                <View style={{
                    borderRadius:20,
                    height: height * 0.2, width: height * 0.2, backgroundColor: 'rgba(255,255,255,0.8)',
                    justifyContent: 'center'
                }}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Animation
                            style={{
                                width: height * 0.1,
                                height: height * 0.1
                            }}
                            autoPlay
                            loop={true}
                            source={wheel}
                        />
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <MyText
                            text={'لطفا منتظر بمانید'}
                            componentStyles={{
                                color: AccentColor,
                            }}
                        />
                    </View>



                </View>

            </View>

        );

    }

}

const Styles = StyleSheet.create({


    InnerViewStyle:
        {
            flex: 1, backgroundColor: 'white'
        },
});

BaseUi.propTypes = {
    Loading: PropTypes.bool,
    ViewStyle:PropTypes.object
};

BaseUi.defaultProps = {
    Loading: false,

};

export default BaseUi;