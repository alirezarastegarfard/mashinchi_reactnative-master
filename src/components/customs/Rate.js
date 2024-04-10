import React from 'react';
import propTypes from 'prop-types';
import {height} from "../publics/Ui";
import {Image, StyleSheet, View, TouchableOpacity} from "react-native";
import FastImage from "react-native-fast-image";
const EmptyStar = require('../../assets/images/icons/rate_empry.png');
const FillStar = require('../../assets/images/icons/rate_fill.png');
export default class Rate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rateArray: [EmptyStar, EmptyStar, EmptyStar, EmptyStar, EmptyStar]
        }
    }

    componentDidMount(): void {

        this.rating(this.props.Rate);

    }

    rating(rate) {
        let rateArrayLocal;
        for (let i = 0; i < rate ; i++) {
            rateArrayLocal = this.state.rateArray;
            rateArrayLocal[i] = FillStar;
        }
        for (let i = rate; i < this.state.rateArray.length ; i++) {
            rateArrayLocal = this.state.rateArray;
            rateArrayLocal[i] = EmptyStar;
        }

        this.setState({rateArray: rateArrayLocal},() => {

            if (this.props.onChangeRate !== null)
                this.props.onChangeRate(rate)
        });


    }

    render() {


        return (

                <View style={{
                    height: 35, width: '100%', flexDirection: 'row',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => {
                        this.rating(1)

                    }}>
                        <FastImage
                            resizeMode='contain'
                            style={Styles.ImageStyle}
                            source={this.state.rateArray[0]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.rating(2)

                    }}>
                        <FastImage
                            resizeMode='contain'
                            style={Styles.ImageStyle}
                            source={this.state.rateArray[1]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.rating(3)

                    }}>
                        <FastImage
                            resizeMode='contain'
                            style={Styles.ImageStyle}
                            source={this.state.rateArray[2]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.rating(4)

                    }}>
                        <FastImage
                            resizeMode='contain'
                            style={Styles.ImageStyle}
                            source={this.state.rateArray[3]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        this.rating(5)

                    }}>
                        <FastImage
                            resizeMode='contain'
                            style={Styles.ImageStyle}
                            source={this.state.rateArray[4]}
                        />
                    </TouchableOpacity>


                </View>



        );

    }


}

const Styles = StyleSheet.create({
    ImageStyle: {
        height: 40, width: 40, margin: 2
    }
});

Rate.propTypes = {
    onChangeRate : propTypes.func,
    Rate : propTypes.number
};

