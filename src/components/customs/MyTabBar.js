import React from 'react';
import {
    AccentColor,
    backColor,
    BorderColor,
    GreyColor,

    PrimaryColor,
    SecondaryTextColor
} from "../publics/Ui";
import {HeaderHeight, ScreenWidth} from "../publics/Function";
import {View,TouchableOpacity,StyleSheet} from "react-native";
import MyText from "./MyText";
import PropTypes from 'prop-types';

export default class MyTabBar extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            activeTab : this.props.selectedTab
        }

    }

    render(){

        return(

            <View style={{
                backgroundColor : backColor,
                width : ScreenWidth,
                height : HeaderHeight,
                flexDirection : 'row',
                justifyContent : 'space-between',
                alignItems : 'center',
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: BorderColor,

            }}>
                {this.renderTabs()}
            </View>


        );

    }

    renderTabs(){

        const Tabs = this.props.tabs;

        const TabWidth = ScreenWidth / Tabs.length;

        let ItemTab = [];

        Tabs.map( ( tab , index) => {

            let TabCaption = "";

            if (tab.badge > 0)
                TabCaption = `${tab.text} (${tab.badge})`;
            else
                TabCaption = tab.text;

            ItemTab.push(

                <TouchableOpacity
                    key={index}
                    style={[Styles.TabStyle , {
                        width: TabWidth
                    }]}
                    onPress={ () => {

                        if (this.state.activeTab === tab.tabName)
                            return;

                        this.setState({ activeTab : tab.tabName }, () => {
                            tab.onPress(tab.tabName);
                        });

                    }}>

                    <View
                        style={{
                            width : '100%',
                            height : '100%',
                            justifyContent : 'center',
                            alignItems : 'center',
                            borderLeftWidth : index === 0 ? 0 : 1,
                            borderColor : SecondaryTextColor,
                      

                        }}>

                        <MyText
                            componentStyles={{
                            fontSize: 13,   color : tab.tabName === this.state.activeTab ? PrimaryColor : SecondaryTextColor
                            }}
                            text={TabCaption}
                        />

                    </View>

                </TouchableOpacity>
            );

        });

        return ItemTab;

    }

}

const Styles = StyleSheet.create({

    TabStyle : {
        height: HeaderHeight,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

MyTabBar.propTypes = {
    tabs : PropTypes.array,
    defaultTab : PropTypes.string,
    selectedTab : PropTypes.string,
    badge : PropTypes.number
};

MyTabBar.defaultProps = {
    Tabs : [],
    badge : 0
};