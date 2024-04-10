import React from 'react';
import {FlatList, View, TouchableOpacity, ActivityIndicator,Keyboard,Image} from 'react-native';
import BaseLightbox from "../basepage/BaseLightbox";
import {AccentColor, DarkPrimaryColor, height, SecondaryTextColor} from "../publics/Ui";
import {connect} from "react-redux";
import propTypes from "prop-types"
import MySearchBarWithOutSorting from "../customs/MySearchBarWithOutSorting";
import MyText from "../customs/MyText";
import {FetchDataFromAPI} from "../publics/DataBase";
import {Actions} from "react-native-router-flux";
import {ScreenHeight, ScreenWidth} from "../publics/Function";


class CityDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Loading: false,
            Answer: '',
            data: [],
            noData : false,
            DialogSize : .7
        };
        this.arrayholder = [];
    }

    componentWillMount(): void {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onShowKeyBoard.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.onHideKeyBoard.bind(this));
    }

    componentDidMount() {
        this.fetchDataFromAPI();
    }

    componentWillUnmount(): void {
        Keyboard.removeListener(this.keyboardDidHideListener);
        Keyboard.removeListener(this.keyboardDidShowListener);
    }

    render() {

        return (

            <BaseLightbox
                verticalPercent={0.85}
                horizontalPercent={this.state.DialogSize}
                cancelOutTouchSide={true}
                jContent={'flex-start'}>
                <View style={{height : '100%', backgroundColor: DarkPrimaryColor}}>

                    <MySearchBarWithOutSorting
                        functions={(text) => this.searchFilterFunction(text)}
                    />

                    {this.renderAreaFromLocation()}
                    
                    <View style={{ height : (ScreenHeight * this.state.DialogSize) - 95 }}>
                        <FlatList
                            data={this.state.data}
                            renderItem={({item}) => this.renderItem(item)}
                            keyExtractor={(item) => item.Id.toString()}
                            ListEmptyComponent={() => this.renderEmptyList()}
                        />
                    </View>

                </View>


            </BaseLightbox>

        );

    }

    renderItem = item => {

        return <TouchableOpacity
                style={{height: height * 0.06,justifyContent:'center',paddingRight:'5%'}}
                onPress={() => {
                    this.props.callBack(item.Name, item.Id);
                    Actions.pop();
                }}>

                <MyText
                    text={item.Name}/>

            </TouchableOpacity>



    };

    fetchDataFromAPI() {
        this.setState({Loading: true});

        let Parameter = JSON.stringify({
            Type: this.props.Type,
            CityId: this.props.CityId

        });


        FetchDataFromAPI("GetCites", Parameter, response => {


            if (!response.Success) {

                this.setState({Loading: false});
                return;
            }
            if (response.Response.length > 0) {
                this.setState({data: response.Response});
                this.arrayholder = response.Response;
            }else
                this.setState({ noDate : true });

        }).done(() => this.setState({Loading: false}));
    };

    searchFilterFunction = text => {
        const newData = this.arrayholder.filter(item => {
            const itemData = `${item.Name.toUpperCase()} `;
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            data: newData,
        });
    };

    renderEmptyList(){

        if (this.state.noData)
            return (
                <View style={{
                    marginTop : 20,
                    width : '100%',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                    <MyText
                        componentStyles={{

                            color : SecondaryTextColor
                        }}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>
                </View>
            );
        else
            return <ActivityIndicator color={AccentColor} size={"large"}/>;

    }

    onShowKeyBoard() {
        this.setState({DialogSize : .5});
    }

    onHideKeyBoard() {
        this.setState({DialogSize : .7});
    }

    renderAreaFromLocation() {

        if (this.props.CityId === "")
            return null;
        
        return(

            <TouchableOpacity
                style={{
                    width: ScreenWidth * 0.85,
                    height : 40,
                    backgroundColor: AccentColor,
                    justifyContent : 'center',
                    alignItems: 'center',
                    alignSelf : 'center',
                    marginBottom : 3
                }}
                onPress={ () => {
                    Actions.pop();
                    this.props.onFindLocation()
                }}>

                <View
                    style={{
                        flexDirection : 'row',
                        justifyContent : 'center',
                        alignItems : 'center'
                    }}>
                    
                    
                    <MyText
                        componentStyles={{
                            color : 'white'
                        }}
                        text={"انتخاب محله بر اساس موقعیت جغرافیایی"}/>

                    <Image
                        source={require('../../assets/images/icons/gps-indicator.png')}
                        style={{
                            width : 20,
                            height : 20,
                            tintColor : 'white',
                            marginLeft : 5
                        }}
                    />

                </View>

            </TouchableOpacity>
            
        );
        
    }
}

CityDialog.propTypes = {
    CityId: propTypes.string,
    callBack : propTypes.func.isRequired,
    onFindLocation : propTypes.func
};
CityDialog.defaultProps = {
    CityId: "",
    onFindLocation : null
};


const mapStateToProps = (states) => {
    return {
        User: states.User,
    };
};

export default connect(mapStateToProps)(CityDialog);


