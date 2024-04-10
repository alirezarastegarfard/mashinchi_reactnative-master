import React from 'react';
import {View, StyleSheet} from "react-native";
import {height, width} from "../publics/Ui";
import propTypes from 'prop-types';

export default class MyCard extends React.Component {
    render() {

        return (
            <View style={[Styles.CardStyle,this.props.MyCardStyle]}>
                {this.props.children}

            </View>
        );

    }

}

const Styles = StyleSheet.create({
    CardStyle: {
        backgroundColor: 'white',
        borderRadius: 3,
        marginRight: width * 0.02,
        marginLeft: width * 0.02,
        marginTop: height * 0.01,
        marginBottom: height * 0.01,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
        padding: 7
    }
});

MyCard.propTypes = {

    MyCardStyle : propTypes.object

};

