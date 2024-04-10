import React, {Component} from 'react';
import {Platform} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import EStyleSheet from "react-native-extended-stylesheet";
import {connect, Provider} from "react-redux";
import {Lightbox, Router, Scene} from "react-native-router-flux";
import Main from "./src/components/activities/Main";
import Splash from "./src/components/activities/Splash";
import Comment from './src/components/activities/Comment';
import Store from "./src/redux/store";
import HomeRegistration from "./src/components/pages/Registration/HomeRegistration";
import Login from "./src/components/pages/Registration/Login";
import InsertMobile from "./src/components/pages/Registration/InsertMobile";
import {AccentColor, AppFont, DarkPrimaryColor, PrimaryColor} from "./src/components/publics/Ui";
import GetCode from "./src/components/pages/Registration/GetCode";
import ResetPassword from "./src/components/pages/Registration/ResetPassword";
import Registration from "./src/components/pages/Registration/Registration";
import ConfirmDialog from "./src/components/dialog/ConfirmDialog";
import ExceptionDialog from "./src/components/dialog/ExceptionDialog";
import PostOptionDialog from "./src/components/dialog/PostOptionDialog";
import PostDialog from "./src/components/dialog/PostDialog";
import QuestionDialog from "./src/components/dialog/QuestionDialog";
import MediaPost from "./src/components/activities/MediaPost";
import CameraDialog from "./src/components/dialog/CameraDialog";
import ChangePictureDialog from "./src/components/dialog/ChangePictureDialog";
import AwardView from "./src/components/activities/AwardView";
import News from "./src/components/activities/News";
import ShowProfile from "./src/components/activities/ShowProfile";
import IWasThereDialog from "./src/components/dialog/IWasThereDialog";
import CriticizeDialog from "./src/components/dialog/CriticizeDialog";
import RatingDialog from "./src/components/dialog/RatingDialog";
import UserWasThere from "./src/components/activities/UserWasThere";
import Player from "./src/components/activities/Player";
import ShowListData from "./src/components/activities/ShowListData";
import ChatHistory from "./src/components/activities/ChatHistory";
import EditProfile from "./src/components/activities/EditProfile";
import BusinessEditProfile from "./src/components/activities/BusinessEditProfile";
import ChooseLocation from "./src/components/activities/ChooseLocation";
import BrandHomePage from "./src/components/activities/BrandHomePage";
import SelectTag from "./src/components/activities/SelectTag";
import Chat from "./src/components/activities/Chat";
import ChatAttachmentDialog from "./src/components/dialog/ChatAttachmentDialog";
import SendPost from "./src/components/activities/SendPost";
import UserShowPost from "./src/components/activities/UserShowPost";
import OwnerPostDialog from "./src/components/dialog/OwnerPostDialog";
import EditPostDialog from "./src/components/dialog/EditPostDialog";
import Forum from "./src/components/activities/Forum";
import ForumSearch from "./src/components/activities/ForumSearch";
import CreateQuestion from "./src/components/activities/CreateQuestion";
import ReportDialog from "./src/components/dialog/ReportDialog";
import ForumSortingPage from "./src/components/activities/ForumSortingPage";
import AnswerQuestionDialog from "./src/components/dialog/AnswerQuestionDialog";
import SortDialog from "./src/components/dialog/SortDialog";
import EditReviewDialog from "./src/components/dialog/EditReviewDialog";
import ForumReplyList from "./src/components/customs/List/ForumReplyList";
import CityDialog from "./src/components/dialog/CityDialog";
import ShowReviewDialog from "./src/components/dialog/ShowReviewDialog";
import MediaPostWithComment from "./src/components/activities/MediaPostWithComment";
import BusinessBookMarkPosts from "./src/components/activities/BusinessBookMarkPosts";
import SwitchToBusiness from "./src/components/activities/SwitchToBusiness";
import MobileJobs from "./src/components/activities/MobileJobs";
import Shopkeepers from "./src/components/activities/Shopkeepers";
import OfficialRepresentation from "./src/components/activities/OfficialRepresentation";
import GetCodeForChangeToBusiness from "./src/components/activities/GetCodeForChangeToBusiness";
import Result from "./src/components/activities/Result";
import ChangePassword from "./src/components/activities/ChangePassword";
import LocationAccessDialog from "./src/components/dialog/LocationAccessDialog";
import Test from "./src/components/activities/Test";

if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableDebugging(true);
    KeyboardManager.setKeyboardDistanceFromTextField(10);
    KeyboardManager.setPreventShowingBottomBlankSpace(true);
    KeyboardManager.setEnableAutoToolbar(true);
    KeyboardManager.setToolbarDoneBarButtonItemText("بستن");
    KeyboardManager.setToolbarManageBehaviour(0);
    KeyboardManager.setShouldToolbarUsesTextFieldTintColor(false);
    KeyboardManager.setToolbarPreviousNextButtonEnable(false);
    KeyboardManager.setShouldShowTextFieldPlaceholder(true);
    KeyboardManager.setOverrideKeyboardAppearance(false);
    KeyboardManager.setShouldResignOnTouchOutside(true);
    KeyboardManager.resignFirstResponder();
    KeyboardManager.isKeyboardShowing()
        .then((isShowing) => {
            // ...
        });

}

EStyleSheet.build({

    $colorPrimary: PrimaryColor,
    $colorPrimaryDark: DarkPrimaryColor,
    $colorAccent: AccentColor,
    $Appfont: AppFont

});

export default class App extends Component<props> {

    render() {

        const RouterWithRedux = connect()(Router);

        return (

            <Provider store={Store}>

                <RouterWithRedux>

                    <Lightbox hideNavBar>

                        <Scene key="Splash"  component={Splash} hideNavBar  initial/>


                        <Scene key="auth" hideNavBar>
                            <Scene key="HomeRegistration" component={HomeRegistration} hideNavBar initial/>
                            <Scene key="InsertMobile" component={InsertMobile} hideNavBar/>
                            <Scene key="Login" component={Login} hideNavBar/>
                            <Scene key="GetCode" component={GetCode} hideNavBar/>
                            <Scene key="ResetPassword" component={ResetPassword} hideNavBar/>
                            <Scene key="Registration" component={Registration} hideNavBar/>
                        </Scene>

                        <Scene key={"Mains"} hideNavBar>
                            <Scene key={"Main"}           component={Main}      hideNavBar initial/>
                            <Scene key={"MediaPost"}      component={MediaPost} hideNavBar />
                            <Scene key={"Comment"}        component={Comment}   hideNavBar />
                            <Scene key={"AwardView"}      component={AwardView} hideNavBar/>
                            <Scene key={"ShowProfile"}    component={ShowProfile} hideNavBar/>
                            <Scene key={"UserWasThere"}   component={UserWasThere} hideNavBar/>
                            <Scene key={"News"}           component={News}  hideNavBar />
                            <Scene key={"Player"}         component={Player} hideNavBar />
                            <Scene key={"ShowListData"}   component={ShowListData} hideNavBar />
                            <Scene key={"EditProfile"}    component={EditProfile} hideNavBar />
                            <Scene key={"BusinessEditProfile"} component={BusinessEditProfile} hideNavBar />
                            <Scene key={"BrandHomePage"}  component={BrandHomePage} hideNavBar />
                            <Scene key={"SelectTag"}      component={SelectTag} hideNavBar />
                            <Scene key={"ChooseLocation"} component={ChooseLocation} hideNavBar />
                            <Scene key={"Chat"}           component={Chat}   hideNavBar />
                            <Scene key={"ChatHistory"}    component={ChatHistory}   hideNavBar />
                            <Scene key={"ChooseLocation"} component={ChooseLocation} hideNavBar />
                            <Scene key={"SendPost"}       component={SendPost} hideNavBar />
                            {/*<Scene key={"VideoTrimmer"}   component={VideoTrimmer} hideNavBar />*/}
                            <Scene key={"UserShowPost"}   component={UserShowPost} hideNavBar />
                            <Scene key={"Forum"}   component={Forum} hideNavBar />
                            <Scene key={"ForumSearch"}   component={ForumSearch} hideNavBar />
                            <Scene key={"ForumSortingPage"}   component={ForumSortingPage} hideNavBar />
                            <Scene key={"CreateQuestion"}   component={CreateQuestion} hideNavBar />
                            <Scene key={"ForumReplyList"}   component={ForumReplyList} hideNavBar />
                            <Scene key={"MediaPostWithComment"}   component={MediaPostWithComment} hideNavBar />
                            <Scene key={"BusinessBookMarkPosts"}   component={BusinessBookMarkPosts} hideNavBar />
                            <Scene key={"InsertMobile"} component={InsertMobile} hideNavBar/>
                            <Scene key={"GetCode"} component={GetCode} hideNavBar/>
                            <Scene key={"SwitchToBusiness"} component={SwitchToBusiness} hideNavBar />
                            <Scene key={"MobileJobs"} component={MobileJobs} hideNavBar />
                            <Scene key={"Shopkeepers"} component={Shopkeepers} hideNavBar />
                            <Scene key={"OfficialRepresentation"} component={OfficialRepresentation} hideNavBar />
                            <Scene key={"GetCodeForChangeToBusiness"} component={GetCodeForChangeToBusiness} hideNavBar />
                            <Scene key={"Result"} component={Result} hideNavBar />
                            <Scene key={"ChangePassword"}  component={ChangePassword} hideNavBar   />
                        </Scene>

                        <Scene key={"ConfirmDialog"}        component={ConfirmDialog} hideNavBar/>
                        <Scene key={"ExceptionDialog"}      component={ExceptionDialog} hideNavBar/>
                        <Scene key={"PostOptionDialog"}     component={PostOptionDialog} hideNavBar/>
                        <Scene key={"PostDialog"}           component={PostDialog} hideNavBar/>
                        <Scene key={"QuestionDialog"}       component={QuestionDialog} hideNavBar/>
                        <Scene key={"CameraDialog"}         component={CameraDialog} hideNavBar/>
                        <Scene key={"ChangePictureDialog"}  component={ChangePictureDialog} hideNavBar/>
                        <Scene key={"IWasThereDialog"}      component={IWasThereDialog} hideNavBar/>
                        <Scene key={"CriticizeDialog"}      component={CriticizeDialog} hideNavBar/>
                        <Scene key={"RatingDialog"}         component={RatingDialog} hideNavBar/>
                        <Scene key={"ChatAttachmentDialog"} component={ChatAttachmentDialog} hideNavBar/>
                        <Scene key={"OwnerPostDialog"}      component={OwnerPostDialog} hideNavBar/>
                        <Scene key={"EditPostDialog"}       component={EditPostDialog} hideNavBar/>
                        <Scene key={"ReportDialog"}         component={ReportDialog} hideNavBar/>
                        <Scene key={"OwnerPostDialog"}      component={OwnerPostDialog} hideNavBar/>
                        <Scene key={"EditPostDialog"}       component={EditPostDialog} hideNavBar/>
                        <Scene key={"AnswerQuestionDialog"} component={AnswerQuestionDialog} hideNavBar/>
                        <Scene key={"SortDialog"}           component={SortDialog} hideNavBar/>
                        <Scene key={"EditReviewDialog"}     component={EditReviewDialog} hideNavBar/>
                        <Scene key={"CityDialog"}           component={CityDialog} hideNavBar/>
                        <Scene key={"ShowReviewDialog"}     component={ShowReviewDialog} hideNavBar/>
                        <Scene key={"LocationAccessDialog"} component={LocationAccessDialog} hideNavBar/>

                    </Lightbox>


                </RouterWithRedux>

            </Provider>


        );
    }

}

