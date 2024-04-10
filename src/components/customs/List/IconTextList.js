import React from "react";
import {height, PrimaryTextColor, SecondaryTextColor, Small} from "../../publics/Ui";
import {FlatList, Image, View} from "react-native";
import MyText from "../MyText";
import PropTypes from 'prop-types';
import {AssetAddress, BaseURL} from "../../publics/DataBase";
import FastImage from "react-native-fast-image";

class IconTextList extends React.PureComponent {

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'transparent',
                }}>
                <FlatList
                    {...this.props}
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.Contacts}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => this.props.key + index.toString()}
                />
            </View>
        )
    }

    renderText(item){
        if(this.props.ShowIcon){
           return(
               <FastImage
                   resizeMode='contain'
                   style={{height: '80%', width: '15%', marginLeft: '3%'}}
                   source={{uri: BaseURL + AssetAddress + item.ImageName }}
               />
           )
        }

        if(!this.props.ShowIcon){
            return(
                <MyText text={' - '}
                        componentStyles={{marginTop: 4, color: PrimaryTextColor, fontSize:Small}}/>
            )
        }


    }

    renderIcon(item) {

        if (!this.props.BothSideIcon) {
            return (

                <View style={{
                    height: 30,
                    width: '50%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end', alignItems: 'center'
                }}>
                    <MyText text={item.ContactValue}
                            componentStyles={{marginTop: 4, color: PrimaryTextColor, fontSize:Small}}/>
                </View>


            )

        }

        if (this.props.BothSideIcon) {
            return (
                <View style={{
                    height: 30,
                    width: '50%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end', alignItems: 'center'
                }}>
                    <MyText text={'موبایل'}
                            componentStyles={{color: SecondaryTextColor, fontSize:Small}}/>

                        {this.renderText(item)}

                </View>

            )

        }

    }


    renderItem = (item, index) => {

        return (

            <View style={{
                flexDirection: 'row',
                marginBottom: height * 0.015
            }}>

                {this.renderIcon(item)}
                <View style={{
                    height: 35,
                    width: '50%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end', alignItems: 'center'
                }}>
                    <MyText text={item.ContactType}
                            componentStyles={{color: SecondaryTextColor, fontSize: Small}}/>
                    {this.renderText(item)}

                </View>
            </View>


        )


    }


}

IconTextList.propTypes = {
    Contacts    : PropTypes.array,
    BothSideIcon: PropTypes.bool,
    MyIcon: PropTypes.bool,
    Icon: PropTypes.number,
    ShowIcon: PropTypes.bool,

};

IconTextList.defaultProps = {
    BothSideIcon: false,
    MyIcon:true,
    Icon:require('../../../assets/images/icons/id.png'),
    ShowIcon:true,
};

export default IconTextList;
