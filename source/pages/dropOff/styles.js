'use strict';
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';

var { width, height } = Dimensions.get('window');

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.28;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 10;

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    
    mainContainer: {
        paddingHorizontal: width * 0.05
    },

    title: {
        fontFamily: Font.extra_bold,
        color: Color.dark_blue,
        fontSize: width * 0.05,
        paddingBottom: width * 0.01
    },

    mapContainer: {
        height: height,
    },

    map: {
        height: height,
    },
 
    bottomContainer: {
        width: width,
        backgroundColor: Color.white,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: 'absolute',
        bottom: 0,

        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.03,

        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,    

        borderWidth: 2,
        borderColor: Color.grey_5,
    },

    imgContainer: {
        // backgroundColor: Color.green,
        width: width * 0.1,
        height: width * 0.1,
        // borderRadius: width/2,
        alignItems: "center",
        justifyContent: "center",
        //borderWidth: 1,
        resizeMode: 'contain'
    },

    img: {
        width: "100%",
        height: "100%",
    },

    txtContainer: {
        paddingHorizontal: 15,
        width: width * 0.75,
        //borderWidth: 1
    },

    txt: {
        fontSize: width * 0.031,
        fontFamily: Font.bold,
        lineHeight: width * 0.036,
    },

    //Modal style
    content: {
        backgroundColor: Color.white,
        borderColor: Color.grey_1,
        justifyContent: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderWidth: 1,
    },

    footerModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },

    ModalDetailViewDiv: {
        width: width,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        paddingVertical: width * 0.03,
        paddingHorizontal: 0,
        flexDirection: "row",
        borderBottomColor: Color.light_blue,
        borderBottomWidth: 1,
        alignItems: 'center',
    },

    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }, 

    detail: {
        width: width * 0.32,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        //borderWidth: 1,
    },

    time: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.039,
    },

    direction: {
        fontFamily: Font.regular,
        color: Color.dark_blue,
        fontSize: width * 0.023,
        lineHeight: width * 0.025,
    },

    buttonTitle: {
        color: Color.white,
        fontFamily: Font.bold, 
        textAlign: 'center',
        fontSize: width * 0.05
    },

    button: {
        backgroundColor: Color.dark_blue,
        borderRadius: 25,
        marginBottom: width * 0.05,
        marginTop: width * 0.01,
        marginHorizontal: 30,
        paddingBottom: width * 0.02,
        paddingTop: width * 0.01
    },

    mapImageContainer: {
        width: width,
        //borderWidth: 10,
        top: 0,
        position: 'absolute',
        //justifyContent: 'flex-en'
        alignItems: 'flex-end',
        paddingRight: 0,
        shadowColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,    
    },

    pickupImageSize:{
        width: width * 0.06, height: width * 0.06
    },

    mapPointImageSize:{
        width: width * 0.09, height: width * 0.09
    }

})