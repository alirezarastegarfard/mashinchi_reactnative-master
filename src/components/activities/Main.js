import React from 'react';
import {SafeAreaView,ToastAndroid,AppState,BackHandler} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import TabNavigator from "react-native-tab-navigator";
import {getTabBarIcon, HomeBanner} from "../publics/Function";
import {backColor} from "../publics/Ui";
import Search from "../pages/Navigations/Home/Search";
import Profile from "../pages/Navigations/Home/Profile";
import Home from "../pages/Navigations/Home/Home";
import Media from "../pages/Navigations/Home/Media";
import {UpdateHome, UpdateSavedPosts} from "../publics/FuncLibs";
import BusinessProfile from "../pages/Navigations/Home/BusinessProfile";
import {connect} from 'react-redux';
import NotificationCenter from "../pages/Navigations/Home/NotificationCenter";
import RNExitApp from "react-native-exit-app";
import {Actions} from "react-native-router-flux";

class Main extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'Home',
            BackPressed : false
        };
    }

    componentWillMount(){
        AppState.addEventListener('change', this._handleAppStateChange);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount(){
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    _handleAppStateChange = (nextAppState) => {

        if ( this.state.selectedTab !== 'home' )
            return true;

        if (nextAppState === "background" && HomeBanner !== null) {
            AsyncStorage.setItem("Mute", "1");
            HomeBanner.playThisVideo(false);
        }else if (nextAppState === "active" && HomeBanner !== null && Actions.currentScene === 'Main')
            HomeBanner.playThisVideo(true);

    };

    handleBackPress = () =>{

        if (Actions.currentScene !== "Main")
            return false;

        if (this.state.BackPressed) {
            RNExitApp.exitApp();
            return false;
        }

        ToastAndroid.show("برای خروج کلید بازگشت را دوباره بزنید" , ToastAndroid.SHORT);

        this.setState({ BackPressed : true }, () => {

            setTimeout(() => {
                this.setState({ BackPressed : false });
            }, 2000);

        });

        return true;
    };

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>

                <TabNavigator
                    tabBarStyle={{backgroundColor: backColor}}
                    sceneStyle={{backgroundColor: backColor}}>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Profile'}
                        renderIcon={() => getTabBarIcon(require('../../assets/images/icons/user.png'))}
                        renderSelectedIcon={() => getTabBarIcon(require('../../assets/images/icons/user_fill.png'))}
                        onPress={() => {
                            this.setState({selectedTab: 'Profile'},() => {

                                if (HomeBanner !== null)
                                    HomeBanner.playThisVideo(false);

                                if (this.props.User.IsBusiness === "0")
                                    UpdateSavedPosts();

                            });
                        }}>

                        {this.props.User.IsBusiness === "0" ? <Profile/> : <BusinessProfile/>}

                    </TabNavigator.Item>


                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Notification'}
                        renderIcon={() => getTabBarIcon(require('../../assets/images/icons/notification.png'))}
                        renderSelectedIcon={() => getTabBarIcon(require('../../assets/images/icons/notification_fill.png'))}
                        onPress={() => {
                            this.setState({selectedTab: 'Notification'},() => {

                                if (HomeBanner !== null)
                                    HomeBanner.playThisVideo(false);

                            });
                        }}
                    >
                        <NotificationCenter/>

                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Home'}
                        renderIcon={() => getTabBarIcon(require('../../assets/images/icons/home.png'))}
                        renderSelectedIcon={() => getTabBarIcon(require('../../assets/images/icons/home_fill.png'))}
                        onPress={() => {
                            this.setState({selectedTab: 'Home'}, () => {

                                if (HomeBanner !== null)
                                    HomeBanner.playThisVideo(false);

                            });
                        }}>

                        <Home/>

                    </TabNavigator.Item>

                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Search'}
                        renderIcon={() => getTabBarIcon(require('../../assets/images/icons/Search.png'))}
                        renderSelectedIcon={() => getTabBarIcon(require('../../assets/images/icons/search_fill.png'))}
                        onPress={() => {
                            this.setState({selectedTab: 'Search'} , () => {

                                if (HomeBanner !== null)
                                    HomeBanner.playThisVideo(false);

                            });
                        }}>

                        <Search/>

                    </TabNavigator.Item>


                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Media'}
                        renderIcon={() => getTabBarIcon(require('../../assets/images/icons/media.png'))}
                        renderSelectedIcon={() => getTabBarIcon(require('../../assets/images/icons/media_fill.png'))}
                        onPress={() => {

                            if (this.state.selectedTab === 'Media'){
                                UpdateHome();
                            }

                            this.setState({selectedTab: 'Media'} , () => {

                                if (HomeBanner !== null)
                                    HomeBanner.playThisVideo(true);

                            });
                        }}>

                        <Media/>

                    </TabNavigator.Item>

                </TabNavigator>

            </SafeAreaView>
        )
    }
}

const mapStateToProps = (states) => {
    return { User : states.User };
};

export default connect(mapStateToProps)(Main);