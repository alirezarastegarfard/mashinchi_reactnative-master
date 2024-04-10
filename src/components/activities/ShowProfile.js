import React from 'react';
import BaseUi from "../basepage/BaseUi";
import {FetchDataFromAPI} from "../publics/DataBase";
import BusinessProfile from "../pages/Navigations/Home/BusinessProfile";
import Profile from "../pages/Navigations/Home/Profile";
import {connect} from "react-redux";

class ShowProfile extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            ProfileData : null,
            Loading : true
        };

    }

    componentDidMount(): void {

        const { UserId = null } = this.props;

        const Parameter = JSON.stringify({
            UserId
        });

        FetchDataFromAPI("getProfileData",Parameter , (response) => {

            this.setState({ ProfileData : response.Response });

        }).done(() => this.setState({Loading : false}));

    }

    render(){

        if (this.state.ProfileData === null){
            return (
                <BaseUi
                    style={{flex : 1}}
                    Loading={this.state.Loading}/>
            );
        }

        return(

            <BaseUi
                style={{flex : 1}}
                Loading={this.state.Loading}>

                {
                   this.state.ProfileData.IsBusiness === "1" ?
                        <BusinessProfile
                            showOnNavigation={false}
                            isReadOnly={this.props.User.ID !== this.state.ProfileData.ID}
                            profileData={this.state.ProfileData}
                        />

                        :

                        <Profile
                            showOnNavigation={false}
                            isReadOnly={this.props.User.ID !== this.state.ProfileData.ID}
                            profileData={this.state.ProfileData}
                        />
                }


            </BaseUi>

        );

    }

}

const mapStateToProps = (states) => {

    return { User : states.User }

};

export default connect(mapStateToProps)(ShowProfile);
