import React from "react";
import NetInfo from "@react-native-community/netinfo";
import RNExitApp from "react-native-exit-app";
import Snackbar from 'react-native-snackbar';
import {AccentColor} from "./Ui";
import {decryptData, encryptData, generateRandomString} from "./Function";

export let   BaseURL          = "";
export let   MediaURL         = "";
export const ServiceAddress   = "Services/";
export const ImagesAddress    = "Images/";
export const MediaAddress     = "Medias/";
export const AdsImageAddress  = "AdsImages/";
export const ProfileAddress   = "ProfileImages/";
export const ChatFileAddress  = "ChatFile/";
export const AssetAddress     = "Assets/";
export const UsersPostAddress = "UsersPosts/";
export const ForumGroupImage = "ForumGroupImage/";
export const ForumHeaderImage = "ForumHeaderImage/";

export const SERVER_APP_ID = "0r68xeesprri usmmaruhsilffkbakrns5gtogidwh4qh79kpq2osma";
const ROUTE_SERVER1        = "http://restook.ir/server_handling/api/routing.php";
const ROUTE_SERVER2        = "http://footballica.ir/server_handling/api/routing.php";
const ROUTE_SERVER3        = "http://volcan.ir/server_handling/api/routing.php";

export function setBaseURL(URL) {
    BaseURL = URL;
}

export function setMediaURL(URL) {
    MediaURL = URL;
}

export function getBaseURL() : Promise<any> {

    return new Promise((resolve,reject) => {

        fetch(ROUTE_SERVER1, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({app_id: SERVER_APP_ID})
        })
            .then((response) => response.json())
            .then((json) => resolve(json))
            .catch(() => {

                fetch(ROUTE_SERVER2, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({app_id: SERVER_APP_ID})
                })
                    .then((response) => response.json())
                    .then((json) => resolve(json))
                    .catch(() => {

                        fetch(ROUTE_SERVER3, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({app_id: SERVER_APP_ID})
                        })
                            .then((response) => response.json())
                            .then((json) => resolve(json))
                            .catch((error) => {

                                reject(error);
                                Actions.ExceptionDialog({
                                    Message : "خطا در اتصال به سرور",
                                    onConfirm : () => RNExitApp.exitApp()
                                });

                            })


                    })

            })


    });

}

export async function FetchDataFromAPI(ServiceName: String, Parameter, onResponse) {


    try {

        let connectionInfo = await NetInfo.getConnectionInfo();

        if (connectionInfo.type == 'none') {
            Snackbar.show({
                title: "خطا در اتصال به اینترنت",
                duration: Snackbar.LENGTH_INDEFINITE,
                action: {
                    title: 'تلاش مجدد',
                    color: AccentColor,
                    onPress: () => FetchDataFromAPI(ServiceName, Parameter, onResponse).done()
                }
            });
            return;
        }

//        const Params = __DEV__ ? Parameter : encryptData(Parameter);

//        const Api_Token = ServiceName + ":[" + generateRandomString() + "]";

        let response = await fetch(BaseURL + ServiceAddress + ServiceName, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
//                'Api-Token'    : encryptData(Api_Token),
//                'Mode'         : __DEV__ ? 'DEBUG' : 'RELEASE'
            },
            timeout: 7000,
            body: Parameter
        });

        //const Data = __DEV__ ? await response.json() : JSON.parse(decryptData(JSON.stringify(await response.json())));

        const Data = await response.json();

        onResponse(Data);

    } catch (error) {
        console.log(error);
         if (error == "TypeError: Network request failed") {
             Snackbar.show({
                 title: 'خطا در ارتباط با سرور',
                 duration: Snackbar.LENGTH_INDEFINITE,
                 action: {
                     title: 'تلاش مجدد',
                     color: AccentColor,
                     onPress: () => FetchDataFromAPI(ServiceName, Parameter, onResponse).done()
                 }
             });
         }
    }

}