import * as React from "react";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {View, ScrollView, Share} from "react-native";
import {Medium, MiniSize, PrimaryTextColor, SecondaryTextColor, Small, VerySmall} from "../publics/Ui";
import MyText from "../customs/MyText";
import UsuallImageBanner from "../customs/UsuallImageBanner";
import propTypes from 'prop-types';
import {BaseURL, FetchDataFromAPI, ImagesAddress} from "../publics/DataBase";
import {getAppFlavor} from "../publics/Function";
import {connect} from "react-redux";


class News extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            ShareLoading : false,
            ViewCount    : this.props.NewsData.ViewCount
        }

    }

    componentDidMount(): void {

        const Parameter = JSON.stringify({

            UserId : this.props.User.ID,
            NewsId : this.props.NewsData.NewsId

        });

        FetchDataFromAPI("setNewsViewCount" , Parameter , (response) => {

            this.setState({ ViewCount : response.Response.ViewCount });

        }).done();

    }

    render() {

        return (
            <BaseUi
                Loading={this.state.ShareLoading}>
                <MyHeader buttonLeftImage={require('../../assets/images/icons/share.png')}
                          buttonLeftShowing={true}
                          text={''}
                          showText={true}
                          buttonLeftOnPress={ () => this._sharePost() }
                />
                <ScrollView style={{backgroundColor: 'white'}}>
                    <View>
                        <UsuallImageBanner data={ { Image : this.props.NewsData.ThumbnailName } }/>
                    </View>

                    <View style={{paddingRight:5}}>

                    <View style={{padding: 5,marginTop:4}}>
                        <MyText text={this.props.NewsData.NewsTitle}
                                componentStyles={{
                                    color: PrimaryTextColor,
                                    fontSize:Medium
                                }}

                        />
                    </View>
                    <View style={{ marginRight: 7, marginLeft: 7}}>



                        <View >
                            <MyText text={`تعداد بازدید: ${this.state.ViewCount} نفر`}
                                    componentStyles={{
                                        color: SecondaryTextColor,
                                        fontSize: MiniSize
                                    }}

                            />
                        </View>

                        <View >
                            <MyText text={this.props.NewsData.NewsDateTime}
                                    componentStyles={{
                                        color: SecondaryTextColor,
                                        fontSize: MiniSize
                                    }}

                            />
                        </View>


                    </View>



                    <View style={{padding: 10}}>
                        <MyText
                            text={this.props.NewsData.NewsDescription}
                            componentStyles={{
                                color: SecondaryTextColor,
                                fontSize:VerySmall
                            }}

                        />
                    </View>
                    </View>

                </ScrollView>


            </BaseUi>
        )
    }

    _sharePost() {

        if (this.state.ShareLoading)
            return;

        const URL = BaseURL + ImagesAddress + this.props.NewsData.ThumbnailName;

        const Parameter = JSON.stringify({

            URL     : URL,
            Title   : this.props.NewsData.NewsTitle,
            Caption : this.props.NewsData.NewsDescription,
            Flavor  : getAppFlavor()


        });

        this.setState({ShareLoading : true});

        FetchDataFromAPI("GetShareNews", Parameter, (response) => {

            let Message = response.Response.ShareText;

            Share.share({

                message: Message,
                title: "ماشینچی"

            });

        }).done( () => this.setState({ShareLoading : false}) );

    }

}

News.propTypes = {

    NewsData : propTypes.object

};

const mapStateToProps = (states) => {

    return { User : states.User };

};

export default connect(mapStateToProps)(News);