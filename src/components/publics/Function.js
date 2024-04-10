import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    CameraRoll,
    PermissionsAndroid,
    Platform,
    NativeModules,
    Linking
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {AccentColor} from "./Ui";
import RNFetchBlob from "react-native-fetch-blob";
import ImagePicker from "react-native-image-crop-picker";
import {Actions} from 'react-native-router-flux';
import {BaseURL, ProfileAddress} from "./DataBase";
import GetLocation from 'react-native-get-location'
import {CAMERA, GALLERY} from "./Constant";
import FastImage from "react-native-fast-image";
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'react-native-crypto-js';

export const ScreenWidth = Dimensions.get('window').width;
export const ScreenHeight = Dimensions.get('window').height;
export const InstagramPostURL = "https://www.instagram.com/p/";
export const HeaderHeight = 48;

const PHONE_PATTERN = "09\\d{9}";
const EMAIL_PATTERN =
    "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
    + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";

export const PageCount = 6;
export const ChatPageCount = 20;
export const ForumPageCount = 10;


export const AppPackage       = Platform.OS === 'ios' ? "com.dpa-me.mashinchi" : "com.dpa_me.mashinchi";
export const IOS_STORE_URL    = "https://new.sibapp.com/applications/mashinchi";

const SALT_PK = "{F@rzad.Marius}";

const CryptoJSAesJson = {
    stringify: function (cipherParams) {
        let j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        let j = JSON.parse(jsonStr);
        let cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        return cipherParams;
    }
};

export async function ConvertFileToBase64(FilePath , cb) {

    const RNFS = require('react-native-fs');
    let path64temp = await RNFS.readFile(FilePath, 'base64');
    cb(path64temp);

}

export let HomeBanner = null;

export function setHomeBannerComponent(banner) {
    HomeBanner = banner;
}

export function getRenderListEmpty(IsShowLoading) {
    if (!IsShowLoading)
        return null;

    return <ActivityIndicator color={AccentColor} size={"large"}/>;
}

export function getTabBarIcon(iconAsset) {

    return(

        <FastImage
            source={iconAsset}
            style={{width : 24 , height : 24}}
            resizeMode={'contain'}
        />

    );

}

export function getNewCode() {
    return Math.floor(Math.random() * 90000) + 10000;
}

export function CheckPhoneNo(PhoneNo : String) {

    let Phone = PersianNumToEnglish(PhoneNo);

    return Phone.match(PHONE_PATTERN);
}

export function CheckEmail(Email : String) {

    let Em = PersianNumToEnglish(Email);

    return Em.match(EMAIL_PATTERN);
}

export function PersianNumToEnglish(string) : String {

    return string.replace(/[\u0660-\u0669]/g, function (c) {
        return c.charCodeAt(0) - 0x0660;
    }).replace(/[\u06f0-\u06f9]/g, function (c) {
        return c.charCodeAt(0) - 0x06f0;
    });

}

export function SecondToMin(Second , isShowHour = true) : String {

    Second = Math.floor(Second);

    let hour    = Math.floor(Second / 3600);
    Second %= 3600;
    let minutes = Math.floor(Second / 60);
    let seconds = Second % 60;

    let HH = hour;
    let MM = minutes;
    let SS = seconds;

    if (hour <= 9)
        HH = "0" + hour;

    if (minutes <= 9)
        MM = "0" + minutes;

    if (seconds <= 9)
        SS = "0" + seconds;

    if (isShowHour && hour > 0)
        return `${HH}:${MM}:${SS}`;
    else
        return `${MM}:${SS}`;
}

export function setMuteState(mute) {
    AsyncStorage.setItem("Mute",mute ? "1" : "0");
}

export function getMuteState() : Promise<any> {

    return new Promise((resolve , reject) => {

        try {

            AsyncStorage.getItem("Mute").then( (Mute) =>{

                resolve(  Mute === "1" );

            });

        }catch (e) {
            reject(e);
        }

    });

}

export async function requestWritePermission( onConfirm ) {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'مجوز ذخیره فایل',
                message:
                    'سلگرامیا برای دانلود فایل نیاز به مجوز ذخیره فایل بر روی دستگاه را دارد',
                buttonNeutral: 'بعدا سوال کن',
                buttonNegative: 'مجاز نیست',
                buttonPositive: 'مجاز است',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            onConfirm();
        } else {
            showAlert("ماشینچی به حافظه دستکاه دسترسی ندارد", () => requestWritePermission() );
        }
    } catch (err) {
        console.warn(err);
    }
}

function downloadAndSaveFile(URL,FileName,onDownloaded) {

    const dirs = RNFetchBlob.fs.dirs;

    let Dir = "";

    if (Platform.OS === 'android')
        Dir = dirs.SDCardDir + '/Mashinchi/';
    else
        Dir = dirs.DocumentDir + '/Mashinchi/';

    if (!RNFetchBlob.fs.exists(Dir))
        RNFetchBlob.fs.mkdir(Dir);

    RNFetchBlob
        .config({
            path : Dir + FileName
        })
        .fetch('GET', URL)
        .then((res) => {

            if (Platform.OS === 'ios') {
                CameraRoll.saveToCameraRoll(res.path());
                onDownloaded(res);
            }else{
                RNFetchBlob.fs.scanFile([ { path : res.path() } ])
                    .then(() => onDownloaded(res))
                    .catch(() => onDownloaded(null));
            }

        })
        .catch(() => onDownloaded(null));

}

export function saveFile(URL,FileName,onDownloaded) {

    if (Platform.OS === 'android') {

        requestWritePermission(() => {

            downloadAndSaveFile(URL,FileName,onDownloaded);

        }).done();

    }else
        downloadAndSaveFile(URL,FileName,onDownloaded);

}

export function getBuildNumber() : number {

    const BuildNo = DeviceInfo.getBuildNumber();

    return parseInt(BuildNo);

}

export function getVersionInfo() {

    return DeviceInfo.getVersion();

}

export function getAppFlavor() {

    if (Platform.OS === 'android'){
        const BuildConfig = NativeModules.RNBuildConfig;
        return BuildConfig.MARKET_ID;
    }else
        return "sibapp";

}

export function getMarketPackage() {

    if (Platform.OS === 'android') {
        const BuildConfig = NativeModules.RNBuildConfig;
        return BuildConfig.MARKET_PACKAGE;
    }else
        return "sibapp";

}

export function pickSingleWithCamera(cropping , onSelected) {

    ImagePicker.openCamera({
            cropping: cropping,
            width: 800,
            height: 800,
            includeExif: true,
            includeBase64: true,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 640,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
        }
    ).then((image) => onSelected(image)
    ).catch( /*() => Actions.ExceptionDialog({ Message : "خطا در گرفتن عکس" })*/ );

}

export function pickVideoWithCamera(onSelected) {

    ImagePicker.openCamera({
        mediaType: "video"
        }
    ).then((video) => onSelected(video)
    ).catch( /*() => Actions.ExceptionDialog({ Message : "خطا در گرفتن ویدیو" })*/ );

}

export function pickSingle(cropping, onSelected ,circular = false , mediaType = "any") {

    ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: cropping,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 1,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            includeBase64: true,
            mediaType
        }
    ).then(image => onSelected(image)
    ).catch(/*() => Actions.ExceptionDialog({ Message : "خطا در انتخاب عکس" })*/ );
}

export function pickFileGallery(onSelected , mediaType = 'any') {

    ImagePicker.openPicker({
            mediaType: mediaType,
            compressImageMaxWidth: 640,
            compressImageMaxHeight: 480,
            compressImageQuality: 0.5,
            compressVideoPreset: 'MediumQuality',
            includeExif: true,
            includeBase64: true,
            multiple:false
        }
    ).then(file => onSelected(file)
    ).catch(/*() => Actions.ExceptionDialog({ Message : "خطا در انتخاب فایل" })*/ );
}

export function getProfilePhoto(PhotoFileName) {

    if (PhotoFileName === "")
        return BaseURL + ProfileAddress + "__profile.png";
    else
        return BaseURL + ProfileAddress + PhotoFileName;

}

export function getCurrentLocation(): Promise<any>{

    return new Promise(async (resolve,reject) => {

        const AccessLocation = () => {

            GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 30000,
            })
                .then(location => {
                    resolve(location);
                })
                .catch(() => {

                    GetLocation.getCurrentPosition({
                        enableHighAccuracy: false,
                        timeout: 30000,
                    })
                        .then(location => {
                            resolve(location);
                        })
                        .catch(error => {
                            resolve({latitude: 0, longitude: 0});
                        })
                });
        };

        const LocationQuestion = await AsyncStorage.getItem("LocationQuestion");

        if (LocationQuestion === null) {

            Actions.LocationAccessDialog({
                Message : "جهت محاسبه فاصله نیاز به دسترسی مکان دقیق شما داریم",
                onConfirm : () => AccessLocation()
            });

            AsyncStorage.setItem("LocationQuestion","1");

        }else
            AccessLocation();

    });

}

export function SendUserPost(type , onSendPost) {

    switch (type) {

        case CAMERA : {
            pickSingleWithCamera(false, (image) => {
                Actions.SendPost({ ImageData : image , onSendPost });
            });
            break;
        }
        case GALLERY : {

            pickSingle(false, (file) => {

                Actions.SendPost({ ImageData : file , onSendPost });

            },false,'photo');
            break;

/*            pickFileGallery( (file) => {         ///// For Pick Video File

                const Type = file.mime.split('/');

                if (Type[0] === "image")
                    Actions.SendPost({ ImageData : file , onSendPost });
                else
                    Actions.VideoTrimmer({ Source : file , onSendPost });
            });
            break;*/
        }
        /*case PICK_VIDEO : {
            pickVideoWithCamera( (video) =>{
                Actions.VideoTrimmer({ Source : video , onSendPost });
            });
            break;
        }*/
    }

}

export async function showDirectionOnGoogleMap(Lat,Lang) {

    const OpenWebMap = () => {
        const MapURL = `https://maps.google.com?saddr=Current+Location&daddr=${Lat},${Lang}`;
        Linking.openURL(MapURL);
    };


    const SendIntentAndroid = NativeModules.SendIntentAndroid;

    const PackageName = "com.google.android.apps.maps";

    if (await SendIntentAndroid.isAppInstalled(PackageName)) {

        const url = `google.navigation:q=${Lat},${Lang}`;

        let Result = await SendIntentAndroid.openAppWithData(PackageName, url, "VIEW", null,
            {position: {type: "int", value: 60}} );

        if (!Result)
            OpenWebMap();
    }else
        OpenWebMap();

}

export function encryptData(Data) {
    return CryptoJS.AES.encrypt(JSON.stringify(Data), SALT_PK, {format: CryptoJSAesJson}).toString();
}

export function decryptData(Data) {
    return JSON.parse(CryptoJS.AES.decrypt(Data, SALT_PK, {format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
}

export function generateRandomString(length = 50) {

    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let charactersLength = characters.length;
    let randomString = '';
    for (let i = 0; i < length; i++) {
        let Rand = Math.floor(0 + Math.random() * ((charactersLength -1) - 0));
        randomString += characters[Rand];
    }
    return randomString;
}