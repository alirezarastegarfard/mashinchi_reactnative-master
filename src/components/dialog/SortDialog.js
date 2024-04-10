import React from 'react';
import propTypes from 'prop-types';
import BaseLightbox from "../basepage/BaseLightbox";
import {View, Radio, TouchableOpacity} from "react-native";
import MyRadio from "../customs/MyRadio";
import MyText from "../customs/MyText";

import {Actions} from "react-native-router-flux";


export default class SortDialog extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            ItemOneSelected:this.props.OrderMode===1?true: false,
            ItemTwoSelected:this.props.OrderMode===2?true: false,
        }
    }

    render() {

        return (
            <BaseLightbox
                verticalPercent={0.7}
                horizontalPercent={0.17}
                cancelOutTouchSide={true}
                jContent={'flex-start'}>

                <View style={{
                    backgroundColor: 'white',
                    width: '100%',
                    height: '100%',
                    padding: 7
                }}>

                    <TouchableOpacity
                        onPress={() => this.MyRadioRef1.ChangeChecking()}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: '100%',
                            height: '50%'
                        }}>
                        <MyText

                            text={' جدید ترین '}/>
                        <MyRadio
                            ref={ref => (this.MyRadioRef1 = ref)}
                            componentStyles={{marginTop: '.5%'}}
                            Checked={this.state.ItemOneSelected}
                            GetCondition={(Condition) => {
                                if (Condition) this.setState({
                                    ItemTwoSelected: !Condition,
                                    ItemOneSelected: Condition
                                }, () => {
                                    this.props.CallBack(1);
                                    Actions.pop();
                                });
                            }}
                        />

                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.MyRadioRef2.ChangeChecking()}
                        style={{
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            flexDirection: 'row',
                            width: '100%',
                            height: '50%'
                        }}>
                        <MyText  text={' پربازدید ترین '}/>
                        <MyRadio
                            ref={ref => (this.MyRadioRef2 = ref)}
                            componentStyles={{marginTop: '.5%'}}
                            Checked={this.state.ItemTwoSelected}
                            GetCondition={(Condition) => {
                                if (Condition)
                                    this.setState({ItemTwoSelected: Condition, ItemOneSelected: !Condition}, () => {
                                        this.props.CallBack(2);
                                        Actions.pop();
                                    });
                            }}
                        />

                    </TouchableOpacity>

                </View>

            </BaseLightbox>

        );

    }


}
