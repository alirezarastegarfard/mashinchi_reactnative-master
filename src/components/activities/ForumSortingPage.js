import React from "react";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import {backColor, height, Medium, width} from "../publics/Ui";
import MyText from "../customs/MyText";
import ForumSortList from "../customs/List/ForumSortList";
import FloatingAction from "../../../custom_package/react-native-floating-action/component/FloatingAction";
import {CREATE_QUESTION} from "../publics/Constant";
import {Actions} from "react-native-router-flux";
import propTypes from "prop-types";
import FastImage from "react-native-fast-image";

const actions = [
    {
        text: 'ایجاد سوال',
        icon: require('./../../assets/images/icons/comment.png'),
        name: CREATE_QUESTION,
        position: 1,
        textElevation: 0,
        textBackground: 'transparent',
        textColor: 'white'
    },

];

export default class ForumSortingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OrderMode: 1
        }
    }

    render() {
        return (
            <BaseUi>
                <MyHeader
                    text={'انجمن'}
                    showText={true}/>
                <View style={FormStyle.Sorting}>
                    <View>
                        <MyText
                            componentStyles={{

                                fontSize: Medium,
                            }}
                            text={' مرتب سازی '}/>
                    </View>
                    <TouchableOpacity
                        onPress={() => Actions.SortDialog({
                            OrderMode: this.state.OrderMode,
                            CallBack: (SelectedItem) => this.CallBack(SelectedItem)
                        })}
                        style={FormStyle.SortButton}>
                        <FastImage style={{width: 30, height: 30}}
                               source={require('../../assets/images/icons/SimpleSort.png')}
                        />
                    </TouchableOpacity>
                </View>

                <ForumSortList
                    OrderMode={this.state.OrderMode}
                    ref={ref => (this.ForumSortListRef = ref)}
                    connectionID={this.props.connectionID}/>

                <FloatingAction
                    showBackground={true}
                    position='left'
                    actions={actions}
                    onPressItem={(itemName) => this.selectedItem(itemName)}
                />
            </BaseUi>
        )
    }

    selectedItem = itemName => {

        switch (itemName) {
            case CREATE_QUESTION : {
                Actions.CreateQuestion({
                    GroupName: this.props.GroupName,
                    connectionID: this.props.connectionID,
                    CallBack: (item) => this.ForumSortListRef.UpdateListAfterReply(item)
                });
                break;
            }
        }
    };

    CallBack = (SelectedItem) => {
        this.setState({OrderMode: SelectedItem}, () => this.ForumSortListRef.handleRefresh())
    }


}

ForumSortingPage.propTypes = {
    connectionID: propTypes.string,
    GroupName: propTypes.GroupName
};
ForumSortingPage.defaultProps = {
    GroupName: ""
};

const FormStyle = StyleSheet.create({
    Sorting: {
        height: height * .06,
        backgroundColor: backColor,
        justifyContent: 'flex-end',
        paddingRight: '2%',
        alignItems: 'center',
        flexDirection: 'row'
    },
    SortButton:
        {
            height: width * 0.09,
            width: width * 0.09,
            justifyContent: 'center',
            alignItems: 'center'
        }

});