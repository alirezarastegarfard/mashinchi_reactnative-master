import React from "react";
import {height, PrimaryTextColor, Small, width} from "../../publics/Ui";
import {FlatList, Image, View} from "react-native";
import MyText from "../MyText";
import PropTypes from 'prop-types';
import FastImage from "react-native-fast-image";
import {BaseURL, ImagesAddress} from "../../publics/DataBase";

class ColumnIconTextList extends React.PureComponent {

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'transparent',
                    transform : [{ scaleX: -1 }],
                }}>
                <FlatList
                    {...this.props}
                    numColumns={2}
                    style={{backgroundColor: 'transparent',paddingRight : 10 , paddingLeft : 10}}
                    data={this.props.Data}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    listKey={(item, index) => this.props.key + index.toString()}
                />
            </View>
        )
    }

    renderText(){

        if(this.props.ShowIcon){
            return(<FastImage
                    resizeMode='contain'
                    style={{height:20, width:20, marginLeft: 5}}
                    source={this.props.MyIcon ? this.props.Icon : {uri:''}}
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




    renderItem = (item, index) => {

        return (
            <View style={{
                flexDirection: 'row',
                width:'50%',
                marginBottom: !this.props.ShowIcon ? 0.5: 3 ,
                transform:[{ scaleX: -1 }]
            }}>
                <View style={{
                    height: 30,
                    width:'100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-end', alignItems: 'center'
                    }}>
                    <MyText text={this.props.listKey === "CARS" ? item.CarName : item.ServiceName}
                            componentStyles={{color: PrimaryTextColor, fontSize: Small}}/>

                    {this.props.listKey === "CARS" ?
                        <FastImage
                            source={{ uri : BaseURL + ImagesAddress + item.CarLogo }}
                            style={{ width : 20 , height : 20 , marginLeft: '2%' }}
                            resizeMode={'contain'}
                        />
                        :
                        this.renderText()
                    }


                </View>
            </View>
        )


    }


}

ColumnIconTextList.propTypes = {
    Data      : PropTypes.array,
    MyIcon    : PropTypes.bool,
    Icon      : PropTypes.number,
    ShowIcon  : PropTypes.bool

};

ColumnIconTextList.defaultProps = {
    MyIcon:true,
    Icon:require('../../../assets/images/icons/id.png'),
    ShowIcon:true,
    Data:[]
};

export default ColumnIconTextList;
