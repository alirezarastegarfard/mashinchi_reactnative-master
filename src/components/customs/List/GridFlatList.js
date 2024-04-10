import React from "react";
import {PrimaryTextColor, SkyBlue} from "../../publics/Ui";
import {FlatList, View} from "react-native";
import MyText from "../MyText";

import propTypes from 'prop-types';

export default class GridFlatList extends React.PureComponent {

    componentDidMount(): void {
        this.gridList.setNativeProps({scrollEnabled: false});
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'transparent',
                    marginRight: '3.5%',
                    marginLeft: '3.5%',

                }}>
                <FlatList
                    ref={( list ) =>  this.gridList = list}
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.UserScoreData}
                    renderItem={({item , index}) => this.renderItem(item , index)}
                    keyExtractor={(item, index) => index.toString()}

                />

            </View>
        )
    }

    renderItem = (item , index) => {
        let colors;
        if (index % 2 === 0) {
            colors = SkyBlue;
        }
        if (index % 2 !== 0) {
            colors = 'white';
        }
        return (

                <View
                    style={{
                        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                        , backgroundColor: colors, height:35, borderRadius: 7,
                        paddingRight: '5%', paddingLeft: '5%'
                    }}>
                    <View style={{width: '50%', alignItems: 'flex-start'}}>
                        <MyText
                            text={`${item.ScoreValue} مورد `}
                            componentStyles={{
                                color: PrimaryTextColor,
                            }}
                        />
                    </View>
                    <View style={{width: '50%'}}>
                        <MyText
                            text={item.ScoreTitle}
                            componentStyles={{
                                color: PrimaryTextColor,

                            }}
                        />
                    </View>

                </View>



        )


    };



}

GridFlatList.propTypes = {
    UserScoreData : propTypes.array
};
