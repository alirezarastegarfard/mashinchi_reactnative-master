import React from 'react';
import {TouchableOpacity, Animated , Dimensions} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Actions} from 'react-native-router-flux';
import {backColor} from "../publics/Ui";
const { height : deviceHeight , width : deviceWidth} = Dimensions.get('window');

export default class BaseLightbox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            opacity : new Animated.Value(0),
            scaleAnimation : new Animated.Value(0)
        }

    }

    componentWillMount() {

        Animated.parallel([

            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start(),

            Animated.spring(this.state.scaleAnimation, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true
            }).start()

        ]);

    }

    _renderLightbox() {
        const {
            children ,
            verticalPercent = 1 ,
            horizontalPercent = 1 ,
            jContent = 'center' ,
            aItems = 'center',
            heightContent = null} = this.props;
        const width = verticalPercent ? deviceWidth * verticalPercent : deviceWidth;
        const height = horizontalPercent ? deviceHeight * horizontalPercent : deviceHeight;
        const HeightStyle = heightContent ? { height : heightContent } : { height };

        return (

            <Animated.View
                style={{
                    transform : [
                        {scale: this.state.scaleAnimation}
                    ]
                }}>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={null}
                    style={[{
                        width ,
                        justifyContent: jContent ,
                        alignItems: aItems ,
                        backgroundColor : backColor ,
                        borderRadius : 4
                    },HeightStyle]}>
                    {children}
                </TouchableOpacity>

            </Animated.View>
        )
    }

    render() {

        const { cancelOutTouchSide = true } = this.props;

        return (
            <Animated.View
                style={[styles.container , {
                    opacity : this.state.opacity
                }]}>

                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.TouchableStyle}
                    onPress={cancelOutTouchSide ? () => Actions.pop() : null}>

                    {this._renderLightbox()}

                </TouchableOpacity>

            </Animated.View>
        )
    }

}

const styles = EStyleSheet.create({
    container : {
        backgroundColor: 'rgba(52,52,52,.5)',
        position: 'absolute',
        top : 0 ,
        bottom : 0,
        left : 0,
        right : 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    TouchableStyle : {
        flex : 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
