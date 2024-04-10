import React, {Component} from "react";
import {backColor} from "../publics/Ui";
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";
import ImageTwoTitleTimeList from "../customs/List/ImageTwoTitleTimeList";
import {setUser} from "../../redux/actions";
import {Actions} from "react-native-router-flux";
class ChatHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            Loading: false,
            EmptyList: false
        }
    }

    componentWillMount() {
        this.fetchDataFromAPI();
    }
    render() {
        return (
            <BaseUi ViewStyle={{backgroundColor: backColor}}>

                <MyHeader
                    buttonRightOnPress={()=>{ Actions.pop(); setTimeout(()=> Actions.refresh({ refreshing: true }), 500)}}
                    buttonLeftShowing={false}
                    ViewStyle={{backgroundColor: 'white'}}
                    showText={true}
                    text={'گفت و گو'}
                />

                <ImageTwoTitleTimeList
                    Loading={this.state.Loading}
                    EmptyList={this.state.EmptyList} Data={this.state.data} UpdateBadge={(ID) => this.UpdateBadge(ID)}/>

            </BaseUi>
        )
    }

    fetchDataFromAPI() {
        this.setState({Loading: true});
        let Parameter = JSON.stringify({
            UserID: this.props.User.ID,
        });

        FetchDataFromAPI("GetChatList", Parameter, (response) => {

            if (response.Response.length > 0) {
                this.setState({data: response.Response});
            }

        }).done(() => this.setState({Loading: false, EmptyList: this.state.data.length <= 0}))

    }

    UpdateBadge(ID) {
        let data = [...this.state.data];
        let index = data.findIndex(el => el.ID == ID);
        if(parseInt(data[index].CountNewChatMessage) > 0 && parseInt(this.props.User.CountNewMessage)>0){
              let User = this.props.User;
              User.CountNewMessage = (parseInt(this.props.User.CountNewMessage)-parseInt(data[index].CountNewChatMessage)).toString();
             this.props.setUser(User);
        }
        data[index].CountNewChatMessage = 0;
        this.setState({data});
        this.props.CallBack();

    }


}
const mapDispatchToProps = (dispatch) => {

    return {

        setUser : (user) => {
            dispatch(setUser(user))
        }

    }

};
const mapStateToProps = (states) => {

    return {User: states.User}

};

export default connect(mapStateToProps,mapDispatchToProps)(ChatHistory);