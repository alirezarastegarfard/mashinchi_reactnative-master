import React from 'react';
import {FlatList} from 'react-native';
import propType  from 'prop-types';
import BaseUi from "../basepage/BaseUi";
import MyHeader from "../customs/MyHeader";
import {getRenderListEmpty} from "../publics/Function";
import {FetchDataFromAPI} from "../publics/DataBase";
import {backColor} from "../publics/Ui";

class BrandHomePage extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            loading : true,
            data    : []
        }

    }

    componentDidMount(): void {

        const Params = JSON.stringify({ BrandId : this.props.BrandId });

        FetchDataFromAPI("getHomeBrandItems",Params,(response) => {
            
            this.setState({ data : response.Response });

        }).done(() => this.setState({ loading : false }));

    }

    render(){
        return(
            <BaseUi
                ViewStyle={{ backgroundColor : backColor , flex : 1 }}
                loading={this.state.loading}>

                <MyHeader/>

                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={(item) => this.props.RenderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => getRenderListEmpty(!this.state.refreshing)}
                    refreshing={this.state.refreshing}
                />

            </BaseUi>
        );
    }

}

export default BrandHomePage;

BrandHomePage.propType = {
    RenderItem : propType.func,
    BrandId    : propType.string,
    BrandName  : propType.string
};

