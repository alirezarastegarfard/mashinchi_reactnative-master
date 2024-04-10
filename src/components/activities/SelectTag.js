import React from "react";
import MyHeader from "../customs/MyHeader";
import {ScrollView, View} from "react-native";
import {getTagRender, height, Medium} from "../publics/Ui";
import MyText from "../customs/MyText";
import BaseUi from "../basepage/BaseUi";
import propType from 'prop-types';
import {TAG_TYPE_CARS, TAG_TYPE_SERVICE, TAG_TYPE_VIP_SERVICE} from "../publics/Constant";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import MyButton from "../customs/MyButton";
import {ScreenWidth} from "../publics/Function";
import {Actions} from 'react-native-router-flux';

class SelectTag extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            data : [],
            loading : true,
            btnLoading : false
        }
    }

    componentWillMount(): void {

        if (this.props.Type === TAG_TYPE_VIP_SERVICE || this.props.Type === TAG_TYPE_SERVICE){

            const Params = JSON.stringify({
                UserId : this.props.User.ID,
                IsVIP  : this.props.Type === TAG_TYPE_VIP_SERVICE ? true : null
            });

            FetchDataFromAPI("getServices",Params,response => {

                this.setState({ data : response.Response });

            }).done( () => this.setState({loading : false}));

        }else{

            const Params = JSON.stringify({
                UserId : this.props.User.ID,
            });

            FetchDataFromAPI("getCars",Params,response => {

                this.setState({ data : response.Response });

            }).done( () => this.setState({loading : false}));

        }

    }

    render(){
        return(
            <BaseUi
                Loading={this.state.loading}
                ViewStyle={{BackgroundColor:'white'}}>

                <MyHeader
                    buttonLeftShowing={false}
                    showText={true}
                    text={'خدمات و امکانات'}
                />

                <View style={{marginRight: '3%', marginTop: height * 0.03,marginBottom: height * 0.03}}>
                    <MyText
                        text={this.props.Title}
                        componentStyles={{fontSize:Medium}}
                    />
                </View>

                <ScrollView>

                    <View style={{
                        flexDirection: 'row-reverse',
                        paddingRight:8,
                        paddingLeft:8,
                        flexWrap: 'wrap'
                    }}>
                        {this.getRenderData()}
                    </View>

                </ScrollView>

                <MyButton
                    text={'تایید'}
                    viewStyle={{
                        marginLeft : 0,
                        marginRight : 0,
                        marginTop:0,
                        marginBottom : 0,
                        bottom : 0,
                        width : ScreenWidth,
                        left : 0,
                        right : 0,
                        height: 50,
                    }}
                    touchableOpacityStyle={{        borderRadius: 0}}
                    loading={this.state.btnLoading}
                    buttonOnPress={ () => this.sendDataAPI()}
                />

            </BaseUi>
        )
    }

    getSelectedData(){

        let Result = [];

        this.state.data.forEach( (item) => {

            if (item.Selected === this.props.User.ID)
                Result.push(item);
        });

        return Result;

    }

    getRenderData = () => {

        let Object = [];

        this.state.data.map( (items,index) => {

            let ItemName = "";

            if (this.props.Type === TAG_TYPE_VIP_SERVICE || this.props.Type === TAG_TYPE_SERVICE)
                ItemName = items.ServiceName;
            else if (this.props.Type === TAG_TYPE_CARS)
                ItemName = items.CarName;


            let Selected = items.Selected !== "0";

            Object.push(getTagRender(ItemName , Selected ,(selected) => {

                const Datas = this.state.data;

                Datas[index].Selected = selected ? this.props.User.ID : "0";

                this.setState({ data : Datas });

            }));

        });

        return Object;
    };

    sendDataAPI(){

        const Data = this.getSelectedData();

        if (Data.length <= 0) {
            Actions.ExceptionDialog({Message: "گزینه ای انتخاب نشده است"});
            return;
        }

        this.setState({ btnLoading : true });

        if (this.props.Type === TAG_TYPE_VIP_SERVICE || this.props.Type === TAG_TYPE_SERVICE) {

            const Params = JSON.stringify({

                UserId: this.props.User.ID,
                Services : Data,
                IsVIP    : this.props.Type === TAG_TYPE_VIP_SERVICE ? true : null

            });

            FetchDataFromAPI("setServicesProfile",Params,response =>{

                if (response.Success){

                    if (this.props.onConfirm !== null)
                        this.props.onConfirm(Data);

                    Actions.pop();
                }else
                    Actions.ExceptionDialog({ Message : response.Message });

            }).done( () => this.setState({ btnLoading : false }) );

        }else if (this.props.Type === TAG_TYPE_CARS){

            const Params = JSON.stringify({

                UserId: this.props.User.ID,
                Cars : Data

            });

            FetchDataFromAPI("setCarSupportProfile",Params,response =>{

                if (response.Success){

                    if (this.props.onConfirm !== null)
                        this.props.onConfirm(Data);

                    Actions.pop();
                }else
                    Actions.ExceptionDialog({ Message : response.Message });

            }).done( () => this.setState({ btnLoading : false }) );

        }

    }

}

SelectTag.propType = {
    Title : propType.string,
    Type  : propType.string,
    onConfirm : propType.func
};

const mapStateToProps = (states) =>{
    return {User : states.User}
};

export default connect(mapStateToProps)(SelectTag);