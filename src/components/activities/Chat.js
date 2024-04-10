import React from "react";
import BaseUi from "../basepage/BaseUi";
import {Actions} from "react-native-router-flux";
import MyHeader from "../customs/MyHeader";
import {
    Image,
    TouchableOpacity,
    TextInput,
    View,
    FlatList,
    PermissionsAndroid,
    Platform,
    ActivityIndicator
} from "react-native";
import {AccentColor, AppFont, BorderColor, ChatBackGround, height, SecondaryTextColor, width} from "../publics/Ui";
import {SecondToMin} from "../publics/Function";
import ChatComponent from "../customs/List/ChatComponent";
import {FetchDataFromAPI} from "../publics/DataBase";
import {ChatPageCount, pickSingle, pickSingleWithCamera, ConvertFileToBase64} from "../publics/Function";
import {connect} from "react-redux";
import {CAMERA, GALLERY, REMOVE} from "../publics/Constant";
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import MyText from "../customs/MyText";
import FastImage from "react-native-fast-image";

let sound = undefined;
let OnePlayerID: null;
let LockingButtom: false;

class Chat extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            input: null,
            data: [],
            refreshing: false,
            ListLoading: false,
            page: 1,
            noData: false,
            RecordingIcon: true,
            recording: false,
            hasPermission: undefined,
            stoppedRecording: false,
            paused: false,
            isRecord: false,
            currentTime: null,
            audioPath: AudioUtils.DocumentDirectoryPath + `/Audio.aac`,
            OnePlayer: null,
            TwoPlayer: null,
            extraData: false,
            sending: false


        }
    }

    componentWillMount() {
        this.fetchDataFromAPI();
        OnePlayerID = null;
        LockingButtom = false;
        this.updatingData();

    }

    GetMaxOFArray() {
        //returns object
        return this.state.data.reduce(function (prev, current) {
            return (prev.ID > current.ID) ? prev : current
        });

    }

    componentDidMount() {

    }

    requestSoundPermission(){

        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({ hasPermission: isAuthorised });
        });

    }



    render() {
        return (
            <BaseUi ViewStyle={{backgroundColor: ChatBackGround}} Loading={this.state.ListLoading}>

                <MyHeader
                    showText={true} text={this.props.Name}
                    buttonRightOnPress={() => {
                        Actions.pop();
                    }}
                    buttonLeftShowing={false}

                />

                <FlatList
                    style={{backgroundColor: 'transparent'}}
                    data={this.state.data}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={this.onEndPage.bind(this)}
                    onEndReachedThreshold={.5}
                    ListEmptyComponent={() => this.renderEmptyList()}
                    extraData={this.state.data}
                    inverted
                />
                <View style={{
                    paddingLeft: width * 0.01,
                    paddingRight: width * 0.01,
                    paddingBottom: height * 0.01,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: BorderColor,
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: 30,
                        }}>

                        {this.renderSendingButtom()}

                        <TouchableOpacity
                            onPress={() => Actions.ChatAttachmentDialog({callback: (clicked) => this.UpLoadFile(clicked)})}
                            style={{
                                height: 50,
                                justifyContent: 'center',
                                display:this.state.RecordingIcon?'flex':'none',
                                width:this.state.RecordingIcon? '10%':0,
                                paddingLeft: 7
                            }}>
                            <FastImage
                                resizeMode={'contain'}
                                style={{width: '75%', height: '75%'}}
                                source={require('../../assets/images/icons/attachment.png')}
                            />
                        </TouchableOpacity>

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '80%', height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: this.state.recording ? 'flex' : 'none'
                            }}
                        >

                            <MyText text={SecondToMin(this.state.currentTime)}
                                    componentStyles={{textAlign: 'center'}}
                            />

                            <FastImage
                                resizeMode={'contain'}
                                style={{width: '20%', height: '50%'}}
                                source={require('../../assets/images/icons/red_microphone.png')}
                            />
                        </View>

                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder={'پیام خود را بنویسید...'}
                            multiline={true}
                            style={{

                                fontFamily: AppFont,
                                maxHeight: 100,
                                width:this.state.RecordingIcon?  '80%': '90%',
                                paddingLeft: 20,
                                paddingRight: 20,
                                textAlign: 'right',
                                minHeight: 30,
                                display: this.state.recording ? 'none' : 'flex'
                            }}
                            autoCorrect={false}
                            value={this.state.input}
                            onChangeText={(text) => {
                                this.setState({input: text}, () => this.onChangeInput());
                            }}
                        />


                    </View>
                </View>

            </BaseUi>
        )
    }

    renderItem = (item, index) => {

        return (

            <ChatComponent
                ref={(ref) => this.ListItemRef = {...this.ListItemRef, [`REF-LIST${item.ID}`]: ref}}
                IsLeft={item.FromUserID == this.props.User.ID ? false : true}
                IsAudio={item.MessageType == 3 ? true : false}
                IsImage={item.MessageType == 2 ? true : false}
                IsRight={item.FromUserID == this.props.User.ID ? true : false}
                data={item}
                Playing={item.ID === this.state.IDPlaying ? true : false}
                Pausing={item.ID === this.state.LastIDPlaying && item.ID != this.state.IDPlaying ? true : false}
                StopOtherRunningAudio={(ID, Playing, Pausing) => this.StopOtherRunningAudio(ID, Playing, Pausing)}
                FunctionPermission={this.state.FunctionPermission}
            />

        )


    };

    renderEmptyList() {

        if (!this.state.noData && !this.state.refreshing) {

        } else
            return (
                <View style={{
                    transform:[{ scaleY: -1}],
                    justifyContent: 'center', alignItems: 'center', marginTop: 20
                }}>

                    <MyText
                        componentStyles={{color: SecondaryTextColor, fontSize: 16}}
                        text={"اطلاعاتی برای نمایش وجود ندارد"}/>

                </View>
            );

    }

    updatingData() {
        this.Interval = setInterval(() => {
            if (this.state.noData === false) {
                this.getUpdateData();
            }
        }, 10000);
    }

    getUpdateData() {

        const maxDataArray = this.GetMaxOFArray();


        let Parameter = JSON.stringify({
            MasterID: maxDataArray.MasterID_Fk,
            MessageTime: maxDataArray.MessageTime,
            User: this.props.User.ID,
        });


        FetchDataFromAPI("UpdatingChatDesc", Parameter, (response) => {


            if (response.Success === true) {


                if (response.Response.length > 0) {


                    if (this.state.data.find(x => x.ID == response.Response[0].ID) === undefined) {
                        this.setState(preState => {
                            return {
                                data: [...response.Response, ...preState.data],
                            }
                        });
                    }

                }
            }
        }).done()

    }

    StopOtherRunningAudio(ID, Playing, Pausing) {


        if (LockingButtom === false) {
            LockingButtom = true;

            // play another voice of list
            if (OnePlayerID != null && OnePlayerID !== ID) {
                for (let i = 0; i < this.state.data.length; i++) {

                    let OnePlayerIDCall = this.ListItemRef[`REF-LIST${this.state.data[i].ID}`];
                    OnePlayerIDCall._stop();
                }
                OnePlayerID = ID;
                let OnePlayerIDCall2 = this.ListItemRef[`REF-LIST${ID}`];
                OnePlayerIDCall2._play();
                setTimeout(() => {
                    LockingButtom = false;
                }, 1000);

                return;

            }

            // first time
            if (OnePlayerID == null) {
                OnePlayerID = ID;
                let OnePlayerIDCall = this.ListItemRef[`REF-LIST${OnePlayerID}`];

                OnePlayerIDCall._play();
                setTimeout(() => {
                    LockingButtom = false;
                }, 1000);
                return;
            }
            // pause and then play again
            if (OnePlayerID === ID && Playing === false) {
                OnePlayerID = ID;
                let OnePlayerIDCall = this.ListItemRef[`REF-LIST${OnePlayerID}`];
                OnePlayerIDCall._playAgain();
                setTimeout(() => {
                    LockingButtom = false;
                }, 1000);
                return;
            }

            // pause

            if (OnePlayerID != null && OnePlayerID === ID && Playing === true) {
                let OnePlayerIDCall = this.ListItemRef[`REF-LIST${OnePlayerID}`];
                OnePlayerIDCall._pause();
                setTimeout(() => {
                    LockingButtom = false;
                }, 1000);
                return;
            }
        }


    }


    onChangeInput() {


        if (this.state.input === null) {
            this.setState({RecordingIcon: true});

            return;
        }
        if (this.state.input.trim() === '') {
            this.setState({RecordingIcon: true});
            return;
        }
        if (this.state.input.trim() !== '') {
            this.setState({RecordingIcon: false});

            return;
        }
        return null;
    }


    onEndPage() {

        if (this.state.data.length >= ChatPageCount) {
            this.setState({page: this.state.page + 1, ListLoading: true}, () =>
                this.fetchDataFromAPI());
        }

    }

    fetchDataFromAPI() {
        this.setState({refreshing: true, ListLoading: true});

        let Parameter = JSON.stringify({
            FromUserID: this.props.User.ID,
            ToUserID: this.props.ToUserID,
            Page: this.state.page
        });

        FetchDataFromAPI("GetChatDesciption", Parameter, (response) => {


            if (response.Response === null) {
                this.setState({refreshing: false, ListLoading: false});
                return;
            }


            if (response.Response.length > 0) {

                this.setState(preState => {
                    return {
                        data: this.state.page === 1 ? response.Response : [...preState.data, ...response.Response],
                        refreshing: false,

                    }
                });
            } else
                this.setState({refreshing: false, ListLoading: false});

        }).done(() => this.setState({refreshing: false, ListLoading: false, noData: this.state.data.length <= 0}))

    }

    sendRequest = () => {

        if (this.state.RecordingIcon === true) {
            return;
        }

        if (this.state.input == null) {
            return;

        }

        if (this.state.input.trim() === '') {
            return;
        }

        if (this.state.sending === true) {
            return;
        }


        this.setState({sending: true});


        let Params = JSON.stringify({
            FromUserID: this.props.User.ID,
            ToUserID: this.props.ToUserID,
            Message: this.state.input,
            MessageType: 1,
        });


        FetchDataFromAPI("SendMessageOfChat", Params, (response) => {

            if (response.Success == true) {


                let item = {
                    ID: response.Response.LastRecord[0].ID,
                    MessageTime: response.Response.LastRecord[0].MessageTime,
                    MasterID_Fk: response.Response.LastRecord[0].MasterID_Fk,
                    PersianTime: response.Response.LastRecord[0].PersianTime,
                    MessageType: 1,
                    FromUserID: this.props.User.ID,
                    ToUserID: this.props.ToUserID,
                    Description: this.state.input,
                    IsRead: 0,
                    PhotoFileName: this.props.User.PhotoFileName
                };

                this.setState(preState => {
                    return {
                        data: [item, ...preState.data]
                    }
                });

                this.setState({input: null, extraData: true, RecordingIcon: true});
            }

        }).done(() => this.setState({sending: false}));

    };

    UpLoadFile(clicked) {

        switch (clicked) {

            case CAMERA : {
                pickSingleWithCamera(true, (image) => {
                    this.setState({
                        image: {
                            uri: `data:${image.mime};base64,` + image.data,
                            width: image.width,
                            height: image.height
                        }
                    });

                    this.SendFile(image.data, 2);

                });
                break;
            }
            case GALLERY : {
                pickSingle(true, (image) => {
                    this.setState({
                        image: {
                            uri: `data:${image.mime};base64,` + image.data,
                            width: image.width,
                            height: image.height
                        },
                    });

                    this.SendFile(image.data, 2);

                });
                break;
            }
            case REMOVE : {
                this.SendFile(null);
                break;
            }
        }

    }

    SendFile(File, MessageType, FileTime = null) {

        if (this.state.sending === true) {
            return;
        }

        this.setState({extraData: true, sending: true});

        let Params = JSON.stringify({
            FromUserID: this.props.User.ID,
            ToUserID: this.props.ToUserID,
            Message: this.state.input,
            MessageType: MessageType,
            File: File,
            FileTime: FileTime,

        });

        FetchDataFromAPI("SendMessageOfChat", Params, (response) => {



            const FileName = response.Response.FileName;
            let item = {
                ID: response.Response.LastRecord[0].ID,
                MessageTime: response.Response.LastRecord[0].MessageTime,
                MasterID_Fk: response.Response.LastRecord[0].MasterID_Fk,
                PersianTime: response.Response.LastRecord[0].PersianTime,
                MessageType: MessageType,
                FromUserID: this.props.User.ID,
                ToUserID: this.props.ToUserID,
                FileName: FileName,
                IsRead: 0,
                FileTime:  response.Response.LastRecord[0].FileTime,
                PhotoFileName: this.props.User.PhotoFileName
            };




            this.setState(preState => {
                return {
                    data: [item, ...preState.data]
                }
            },()=> this.ListItemRef[`REF-LIST${response.Response.LastRecord[0].ID}`].setTimeFile());

        }).done(() => this.setState({sending: false, RecordingIcon: true}));

    }

    prepareRecordingPath = (audioPath) => {

        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 44100.0,
            Channels: 2,
            AudioQuality: 'High',
            AudioEncoding: 'aac',
            OutputFormat: 'aac',
            MeteringEnabled: false,
            MeasurementMode: false,
            AudioEncodingBitRate: 32000
        });

    };

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({finished: didSucceed, playControl: true});
        ConvertFileToBase64(filePath, (Base64) => {
            this.setState({
                audioBase: Base64
            }, () => this.SendFile(this.state.audioBase, 3, this.state.currentTime))
        }).done(()=>{this.setState({currentTime:null})});

    }




    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }


            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

     async _record() {

        const CheckMicPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

        if (!CheckMicPermission)
            this.requestSoundPermission();
        else {



            if (this.state.recording) {
                console.warn('Already recording!');
                return;
            }

            // if (!this.state.hasPermission) {
            //     console.warn('Can\'t record, no permission granted!');
            //     return;
            // }

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };

            if (this.state.stoppedRecording) {
                this.prepareRecordingPath(this.state.audioPath);
            }else
                this.prepareRecordingPath(this.state.audioPath);

            this.setState({recording: true, paused: false});

            try {
                const filePath = await AudioRecorder.startRecording();
            } catch (error) {
                console.error(error);
            }

        }

    }


    renderSendingButtom() {

        if (this.state.sending) {
            return <View style={{
                height: 40,
                width: '10%', paddingLeft: 7, justifyContent: 'center'
            }}>
                <ActivityIndicator color={AccentColor} size={"large"}/>
            </View>
        }
        if (!this.state.sending) {
            return (
                <TouchableOpacity
                    onPressOut={this.state.RecordingIcon ? () => this._stop() : null}
                    onLongPress={this.state.RecordingIcon ? () => this._record() : null}
                    onPress={() => {
                        this.sendRequest()
                    }}

                    style={{
                        height: 40,
                        width: '10%', paddingLeft: 7, justifyContent: 'center'
                    }}>
                    <FastImage
                        resizeMode={'contain'}
                        style={{width: '80%', height: '80%'}}
                        source={this.state.RecordingIcon === false ? require('../../assets/images/icons/send.png') : require('../../assets/images/icons/microphone.png')}
                    />
                </TouchableOpacity>)
        }

    }
}

const mapStateToProps = (states) => {
    return {User: states.User}
};

export default connect(mapStateToProps)(Chat);