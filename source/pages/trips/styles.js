'use strict';
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';

var { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },

    statusContainer: {
        paddingHorizontal: width * 0.05
    },

    statusHeading: {
        fontFamily: Font.extra_bold,
        color: Color.dark_blue,
        fontSize: width * 0.05,
        paddingBottom: width * 0.01
    },

    detailContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    detail: {
        backgroundColor: Color.dark_blue,
        width: width * 0.41,
        height: height * 0.098,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        flexDirection: 'row',
        borderRadius: 18,
        //borderWidth: 2,
    },

    iconImg1: {
        width: width * 0.12,
        height: width * 0.085,
        resizeMode:'cover',
        marginLeft: 0,
    },

    iconImg2: {
        width: width * 0.11,
        height: height * 0.06,
        resizeMode:'contain',
    },

    totalContainer: {
        // paddingHorizontal: width * 0.03,
    },

    totalHeader: {
        color: Color.white,
        fontSize: width * 0.03,
        fontFamily: Font.bold,
    },

    total: {
        color: Color.white,
        fontSize: width * 0.05,
        fontFamily: Font.bold,
    },

    tripsDiv:{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: width * 0.01,
        paddingBottom: height * 0.01,
    },

    orderBox: {
        width: width,
        flexDirection: 'row',
        paddingVertical: width * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 0,
    },

    jobContainer: {
        borderRadius: 20,
        width: width * 0.85,
        marginHorizontal: 0,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 6,        
        borderWidth: 2,
        borderColor: Color.grey_4
    },

    header: {
        //width: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingBottom: 3,
        paddingTop: 3,
        paddingHorizontal: 10,
        backgroundColor: Color.light_blue,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        //borderWidth: 1
    },

    imageView: {
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width / 2,
    },

    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain',
        borderRadius: width / 2,
    },

    nameDiv: {
        width: width * 0.45,
        paddingLeft: 10,
        justifyContent: 'center',
        //borderWidth: 1,
    },

    name: {
        fontSize: width * 0.042,
        fontFamily: Font.regular,
        lineHeight: width * 0.05,
    },

    paymentMethodDiv: {
        backgroundColor: Color.dark_blue,
        alignItems: 'center',
        width: width * 0.22,
        borderRadius: 4,
        justifyContent: 'center',
        paddingTop: width * 0.005,

    },

    paymentMethod: {
        color: Color.white,
        fontSize: width * 0.022,
        fontFamily: Font.regular,
        lineHeight: width * 0.025,
    },

    priceDiv: {
        width: width * 0.2,
        height: width * 0.15,
        alignItems: 'flex-end',
        //paddingRight: 5,
        justifyContent: 'center',
        //borderWidth: 1
    },

    price: {
        fontSize: width * 0.042,
        fontFamily: Font.regular,
    },

    distance: {
        fontSize: width * 0.035,
        fontFamily: Font.regular,
        lineHeight: width * 0.04
    },

    detailDiv: {
        //width: width * 0.9,
        backgroundColor: Color.white,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingHorizontal: width * 0.03,
        //borderWidth: 1
    },

    locationNav: {
        paddingVertical: width * 0.008,
        //borderWidth: 1,
        //width : width * 0.83
    },

    dot: {
        width: width * 0.02,
        height: width * 0.02,
        borderRadius: 50,
    },

    content: {
        marginLeft: 25,
    },

    locationTitle: {
        fontFamily: Font.bold,
        fontSize: width * 0.03
    },

    timeline: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    line: {
        position: 'absolute',
        top: 0,
        width: 2,
        bottom: 0,
    },

    topLine: {
        flex: 1,
        width: 2,
        backgroundColor: 'black',
    },

    bottomLine: {
        flex: 1,
        width: 2,
        backgroundColor: 'black',
    },

    hiddenLine: {
        width: 0,
    },
})