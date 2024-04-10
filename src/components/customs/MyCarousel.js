import React from "react";
import Carousel from 'react-native-snap-carousel';
import {View} from "react-native";
import SliderEntry from "./SliderEntry";
import {width} from "../publics/Ui";
import propTypes from 'prop-types';

const SLIDER_1_FIRST_ITEM = 1;

export default class MyCarousel extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        }

    }



    render() {

        return (
            <View style={{backgroundColor:'transparent', marginBottom: 16,marginTop: 16}}>
                <Carousel
                    data={this.props.data}
                    renderItem={ (item , index) => this._renderItemWithParallax(item , index)}
                    sliderWidth={width*1}
                    itemWidth={width*0.8}
                    hasParallaxImages={true}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={0.94}
                    inactiveSlideOpacity={0.7}
                    loop={true}
                    loopClonesPerSide={2}
                    autoplay={true}
                    autoplayDelay={500}
                    autoplayInterval={3000}
                    onSnapToItem={(index) => this.setState({slider1ActiveSlide: index})}
                />
            </View>
        )
    }

     _renderItemWithParallax({item, index}, parallaxProps) {
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
                onPress={ (callback) => this.props.onPress(callback) }
            />
        );
    }

}

MyCarousel.propTypes = {
    data : propTypes.array,
    onPress : propTypes.func
};

MyCarousel.defaultProps = {
    onPress : null
};