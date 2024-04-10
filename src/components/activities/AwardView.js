import React from 'react';
import {View, Image, ScrollView} from 'react-native';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {
    backColorLight,
    height, Large,
    LightBlue, Medium,
    NavyBlue,
    width
} from "../publics/Ui";
import BaseUi from "../basepage/BaseUi";
import MyText from "../customs/MyText";
import GridFlatList from "../customs/List/GridFlatList";
import LabelList from "../customs/List/LabelList";
import {BaseURL, FetchDataFromAPI, ImagesAddress} from "../publics/DataBase";
import MyHeader from "../customs/MyHeader";
import FastImage from "react-native-fast-image";

const progressCustomStyles = {
    backgroundColor: LightBlue,
    borderRadius: 4,
    borderColor: LightBlue,
};

class AwardView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            progressCustomized: 20,
            Loading: false
        };

    }

    componentWillMount() {

        const Params = JSON.stringify({

            UserId: this.props.User.ID

        });

        this.setState({Loading: true});

        FetchDataFromAPI("getUserLevel", Params, (response) => {

            this.setState({data: response.Response});

        }).done(() => this.setState({Loading: false}));

    }

    render() {

        if (this.state.data === null)
            return (

                <BaseUi
                    Loading={true}
                    ViewStyle={{backgroundColor: backColorLight}}/>

            );

        const MaxValue = Number.parseInt(this.state.data.UserLevel.MaxLevel);
        const Percent = (Number.parseInt(this.state.data.Score) * 100) / MaxValue;

        return (
            <BaseUi
                Loading={this.state.Loading}
                ViewStyle={{backgroundColor: backColorLight}}>
                <MyHeader showText={true} text={'امتیازات'}/>

                <View style={{flex: 1}}>
                    <ScrollView style={{backgroundColor: 'white'}}>
                        <View style={{backgroundColor: NavyBlue, margin:8,borderRadius:7 , marginBottom: '3%'}}>
                            <View style={{
                                height: 55,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <FastImage
                                    resizeMode='contain'
                                    style={{height: 45, width: 50}}
                                    source={{uri: BaseURL + ImagesAddress + this.props.User.LevelImage}}
                                />

                                <MyText
                                    text={this.state.data.UserLevel.Level}
                                    componentStyles={{
                                        fontSize: Large,
                                        color: LightBlue,
                                        marginTop:7,
                                        marginLeft: 4,

                                    }}
                                />
                            </View>

                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 50,
                            }}>
                                <MyText
                                    text={this.state.data.UserLevel.LevelName}
                                    componentStyles={{
                                        fontSize: Large,
                                        color: 'white',
                                        marginTop: '3%',
                                        marginLeft: '1%'
                                    }}
                                />
                            </View>

                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '4%',
                                height: 50,
                            }}>
                                <MyText
                                    text={`امتیاز شما : ${this.state.data.Score}`}
                                    componentStyles={{
                                        fontSize: Medium,
                                        color: 'white',
                                        marginTop: '3%',
                                        marginLeft: '1%'
                                    }}
                                />

                            </View>

                            <View style={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',


                                height: height * 0.024
                            }}>
                                <View style={{
                                    borderRadius: 10,
                                    width: width * 0.88,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'white'
                                }}>
                                    <ProgressBarAnimated
                                        {...progressCustomStyles}
                                        width={width * 0.88}
                                        maxValue={MaxValue}
                                        value={Percent}
                                    />

                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row', borderColor: 'white', borderBottomWidth: 2, height:47
                                , marginRight: '3%', marginLeft: '3%'
                            }}>
                                <View style={{width: '50%', alignItems: 'flex-start'}}>
                                    <MyText
                                        text={this.state.data.UserLevel.MinLevel}
                                        componentStyles={{

                                            color: 'white',

                                        }}
                                    />
                                </View>
                                <View style={{width: '50%'}}>
                                    <MyText
                                        text={this.state.data.UserLevel.MaxLevel}
                                        componentStyles={{

                                            color: 'white'
                                        }}
                                    />
                                </View>

                            </View>

                            <View style={{
                                height: this.state.data.ScoreData.length * 30,
                                marginRight: '4%',
                                marginTop: height * 0.01,
                                marginBottom: height * 0.025,
                            }}>
                                <LabelList ScoreData={this.state.data.ScoreData}/>
                            </View>

                        </View>
                        <View style={{height: this.state.data.UserScoreData.length * 35,marginBottom:height*0.02}}>
                            <GridFlatList UserScoreData={this.state.data.UserScoreData}/>
                        </View>


                    </ScrollView>
                </View>


            </BaseUi>
        );
    }
}

export default AwardView;
