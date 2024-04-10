import React from "react";
import { Small} from "../../publics/Ui";
import {FlatList, View} from "react-native";
import MyText from "../MyText";
import propTypes from 'prop-types';


export default class LabelList extends React.PureComponent {

    componentDidMount(): void {
        this.labelList.setNativeProps({scrollEnabled: false});
    }

    render() {

        return (
            <View
                style={{
                    backgroundColor: 'transparent'
                }}>

                <FlatList
                    ref={(list) => this.labelList = list}
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.ScoreData}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        )
    }


    renderItem = (item) => {

        return (

            <View style={{height:30}}>
                <MyText
                    text={'- ' + item.ScoreTitle + ' ' + item.Score + ' امتیاز '}
                    componentStyles={{
                        fontSize: Small,
                        color: 'white'
                    }}
                />
            </View>


        )


    }


}

LabelList.propsTypes = {
    ScoreData : propTypes.array,
};
