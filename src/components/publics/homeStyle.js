import {Dimensions}  from "react-native";
import {AccentColor, DarkPrimaryColor, RedCircle} from "./Ui";
import EStyleSheet from "react-native-extended-stylesheet";


const window = Dimensions.get('window');
export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: 'white',
    background2: '#21D4FD'
};

const CircleImageSize = window.width* (15.8 / 100);
const ProfileCircleImageSize = window.width * .08;

export default EStyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: DarkPrimaryColor
    },

    scrollview: {
        flex: 1
    },
    SnapCarousel: {
        paddingVertical: 30,

    },

    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },

    paginationContainer: {
        paddingVertical: 8
    },
    CircleImage:{
        width:CircleImageSize,
        height: CircleImageSize,
        borderRadius:CircleImageSize / 2,
        margin:window.width*(2/100),
    },
    ProfileBackCircle : {
        width : ProfileCircleImageSize + 7,
        height : ProfileCircleImageSize + 7,
        borderRadius : (ProfileCircleImageSize + 7) / 2,
        borderWidth: 2,
        borderColor: RedCircle,
        justifyContent : 'center',
        alignItems : 'center'
    },
    ProfileCircleStyle : {
        width:ProfileCircleImageSize,
        height: ProfileCircleImageSize,
        borderRadius:ProfileCircleImageSize / 2,
        margin:window.width*(2/100)
    },
    CircleImageBack:{
        width:(window.width*(19/100)), height: (window.width*(19/100)) ,
        margin:window.width*(2/100),
        justifyContent:'center',alignItems:'center',
    },
    BanerAd:{
        height:window.height*(30/100),
        width:window.width,
        justifyContent:'center',
        alignItems:'center'
    },
    ButtonStyle : {
        width: '80%',
        height : 30,
        backgroundColor: AccentColor,
        justifyContent : 'center',
        alignItems: 'center',
        borderRadius : 10,
        '@media ios ' : {
            paddingTop : 5
        }
    }
});
