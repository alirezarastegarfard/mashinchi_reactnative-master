import React from 'react';
import MyHeader from "../customs/MyHeader";
import {ScrollView, View} from "react-native";
import InstaBaner from "../customs/InstaBanner";
import {connect} from 'react-redux';
import {backColor, DarkPrimaryColor} from "../publics/Ui";
import propTypes from 'prop-types';
import BaseUi from "../basepage/BaseUi";
import {FetchDataFromAPI} from "../publics/DataBase";
import LongVideoBanner from "../customs/LongVideoBanner";

class MediaPost extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            loading : false,
            Post    : this.props.Post

        };

        this.ItemRef = null;

    }

    componentWillMount(): void {

        if (this.props.isGetPost && this.props.PostId !== null){
            this.getPostById(this.props.PostId);
        }

    }

    componentDidMount(){

        if (this.state.Post === null || this.state.Post.GetPostTypeId !== "1")
            return;

        setTimeout( () => {

            if (this.ItemRef !== null && this.state.Post !== null)
                this.ItemRef.playThisVideo(true);


        },1200);
    }

    componentWillUnmount(): void {
        this.ItemRef = null;
    }

    render() {

        const item = this.state.Post;

        if (item === null || item === undefined){
            return(

                <BaseUi
                    ViewStyle={{flex: 1, backgroundColor: DarkPrimaryColor}}
                    Loading={this.state.loading}/>

            );
        }else {

            return (
                <BaseUi
                    loading={this.state.loading}
                    ViewStyle={{flex: 1, backgroundColor: DarkPrimaryColor}}>

                    {this.renderHeader()}

                    <View style={{flex: 1, backgroundColor: backColor}}>

                        <ScrollView style={{flex: 1, backgroundColor: backColor, marginBottom: '5%'}}>

                            {item.GetPostTypeId === "1" ?

                                <InstaBaner
                                    ref={(ref) => this.ItemRef = ref}
                                    profileId={item.ProfileId}
                                    postId={item.PostId}
                                    UserName={item.UserName}
                                    fullName={item.FullName}
                                    persianDate={item.PersianDate}
                                    postCaption={item.PostCaption}
                                    posts={item.Posts}
                                    ProfilePhotoName={item.ProfilePhotoName}
                                    keyIndex={0}
                                    liked={item.Liked === "1"}
                                    saved={item.Saved === "1"}
                                    UserId={this.props.User.ID}
                                    shortCode={item.ShortCode}
                                    postLikes={item.PostLikes}
                                    isFollow={item.IsFollow}
                                    showPostComplete
                                    CommentCount={item.CommentCount}
                                    ShowCommentButtons={this.props.ShowCommentButtons}
                                />

                                :

                                <LongVideoBanner
                                    profileId={item.ProfileId}
                                    postId={item.PostId}
                                    UserName={item.UserName}
                                    fullName={item.FullName}
                                    persianDate={item.PersianDate}
                                    postCaption={item.PostCaption}
                                    posts={item.Posts}
                                    ProfilePhotoName={item.ProfilePhotoName}
                                    keyIndex={0}
                                    liked={item.Liked === "1"}
                                    saved={item.Saved === "1"}
                                    UserId={this.props.User.ID}
                                    shortCode={item.ShortCode}
                                    postLikes={item.PostLikes}
                                    isFollow={item.IsFollow}
                                    CommentCount={item.CommentCount}
                                    ThumbnailName={item.ThumbnailName}
                                    PostTitle={item.PostTitle}
                                    Duration={item.Duration}
                                    showPostComplete
                                    ShowCommentButtons={this.props.ShowCommentButtons}
                                />

                            }

                        </ScrollView>

                    </View>

                </BaseUi>

            );
        }
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

    renderHeader(){

       if (!this.props.ShowHeader)
            return null;

       return(

            <MyHeader
                showText={true}
                text={this.state.Post.FullName}
            />
       );

    }
}

MediaPost.propTypes = {

    Post : propTypes.object,
    PostId : propTypes.string,
    isGetPost : propTypes.bool,
    ShowHeader : propTypes.bool,
    ShowCommentButtons : propTypes.bool
};

MediaPost.defaultProps = {

    Post : null,
    PostId : null,
    isGetPost : false,
    ShowHeader : true,
    ShowCommentButtons : true

};

const mapStateToProps = (states) => {

    return {

        User : states.User

    };

};

export default connect(mapStateToProps)(MediaPost);