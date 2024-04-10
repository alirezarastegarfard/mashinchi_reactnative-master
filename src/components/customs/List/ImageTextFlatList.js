import React from "react";
import {height, Medium, Small, width} from "../../publics/Ui";
import ListHeader from "../ListHeader";
import TouchableScale from "react-native-touchable-scale";
import {FlatList, Image, View} from "react-native";
import {MediaAddress, MediaURL} from "../../publics/DataBase";
import MyText from "../MyText";
import propTypes from 'prop-types';
import FastImage from "react-native-fast-image";

export default class ImageTextFlatList extends React.PureComponent {

    render() {
        const {heightViewRatio =  0,rightTextHeader="پر بازدید ترین ها",itemWidthViewRatio =0} = this.props;
        return (
            <View
                style={{
                    backgroundColor: 'transparent',
                    height:220+heightViewRatio,
                    width: width,
                    paddingRight: 7

                }}>

                <ListHeader
                    height={'15%'}
                    rightText={rightTextHeader}
                    onPress={ () => this.props.OnAllPress()}
                />

                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.props.data}
                    renderItem={({item}) => this.renderItem(item, itemWidthViewRatio)}
                    keyExtractor={(item, index) => index.toString()}
                    inverted={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

        )

    }


     renderItem(item,itemWidthViewRatio){

         const { FromURL = MediaURL + MediaAddress } = this.props;

         return (
             <TouchableScale
                 activeScale={0.98}
                 style={{
                     shadowOffset: {width: 0, height: 1},
                     shadowOpacity: 0.3,
                     shadowRadius: 2,
                     elevation: 2,
                     height: '95%', width: 140+itemWidthViewRatio, margin: 5, backgroundColor: 'white'
                 }}
                 onPress={ () => {

                     if (this.props.onPress !== null)
                         this.props.onPress(item);

                 }}>

                 <FastImage
                     resizeMode={'cover'}
                     style={{
                         width: '100%',
                         height: this.props.heightImage,
                     }}
                     source={{uri: FromURL + item.ThumbnailName}}
                 />

                 <View style={{
                     width: '100%',
                     height: this.props.heightTextView,
                     paddingRight:6

                 }}>

                     {this.renderThreeTitle(item)}

                 </View>

             </TouchableScale>
         );

     }

     renderThreeTitle(item) {

         if (this.props.WithTitle) {
             return (
                 <View>
                     <MyText
                         text={item.NewsTitle}
                         numberOfLines={1}
                         componentStyles={{fontSize: Medium, marginBottom: 3, marginTop: 1}}
                     />
                     <MyText
                         text={item.PostCaption}
                         numberOfLines={2}
                         componentStyles={{lineHeight: 25,}}

                     />
                 </View>);
         }else {
             return (
                 <View>

                     <MyText
                         text={item.PostCaption}
                         numberOfLines={2}
                     />
                 </View>
             )
         }
     }
}

ImageTextFlatList.propTypes = {
    data : propTypes.array,
    WithTitle : propTypes.bool,
    onPress : propTypes.func,
    heightImage:propTypes.string,
    heightTextView:propTypes.string,

};

ImageTextFlatList.defaultProps = {
    onPress : null,
    WithTitle:false,
    heightImage:'70%',
    heightTextView:'30%'

};