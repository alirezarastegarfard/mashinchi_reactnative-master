import React from 'react';
import propTypes from "prop-types";
import Comment from "./Comment";
import MediaPost from "./MediaPost";
import BaseUi from "../basepage/BaseUi";
import {FetchDataFromAPI} from "../publics/DataBase";
import {connect} from "react-redux";

class MediaPostWithComment extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            loading : false,
            Post    : null,
            PostId  : null
        };

        this.ItemRef = null;

    }

    componentWillMount(): void {

        this.setState({ loading : true });

        const Parameter = JSON.stringify({

            CommentId : this.props.CommentId

        });

        FetchDataFromAPI("getPostIdByCommentId",Parameter,(response) =>{

            const PostId = response.Response.PostId;
            this.setState({ PostId });
            this.getPostById(PostId);

        }).done();
    }

    render(){

        if (this.state.Post === null)
            return(

                <BaseUi
                    ViewStyle={{flex : 1}}
                    Loading={this.state.loading}/>

            );
        else
            return(

                <BaseUi>

                    <Comment
                        ListHeaderComponent={ () => <MediaPost Post={this.state.Post} ShowHeader={false} ShowCommentButtons={false}/> }
                        PostId={this.state.PostId}
                        CommentId={this.props.CommentId}
                    />

                </BaseUi>

            );
    }

    getPostById(PostId) {

        this.setState({ loading : true });


        const Parameter = JSON.stringify({

            page   : 1,
            UserId : this.props.User.ID,
            PostId : PostId

        });

        FetchDataFromAPI("getPosts",Parameter, (response) => {

            if (response.Success)
                this.setState({ Post : response.Response[0] } , () => {

                    if (this.ItemRef !== null && this.state.Post !== null)
                        this.ItemRef.playThisVideo(true);

                });

        }).done(() => this.setState({ loading : false }))

    }

}

MediaPostWithComment.propTypes = {
    CommentId : propTypes.string.isRequired
};

const mapStateToProps = (states) => {

    return {

        User : states.User

    };

};

export default connect(mapStateToProps)(MediaPostWithComment);