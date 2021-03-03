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

    statusContainer: {
        width: width,
        //height: width * 0.20,
        backgroundColor: Color.dark_blue,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: width * 0.015
    },

    statusHeading: {
        fontSize: width * 0.053,
        color: Color.white,
        fontFamily: Font.extra_bold,
    },

    statusDetail: {
        fontSize: width * 0.031,
        color: Color.white,
        fontFamily: Font.bold,
        lineHeight: 14
    },

    pickMapContainer: {
        height: height * 0.87,
    },

    pickMap: {
        height: height * 0.87,
    },

    customView: {
        width: width * 0.55,
        // height: width * 0.1,
        // borderWidth: 4,
    },

    toolAddress: {
        fontFamily: Font.semi_bold,
        fontSize: width * 0.03,
        textAlign: 'center',
        marginHorizontal: width * 0.005,
    },

    mapIcon: {
        width: width,
        height: height * 0.34,
        //borderWidth: 10,
        bottom: 0,
        position: 'absolute',
        //justifyContent: 'flex-en'
        alignItems: 'flex-end',
        paddingRight: 20,
    },

    allDetailViewDiv: {
        // position: 'absolute',
        // bottom: 0,
        width: width,
        backgroundColor: Color.light_blue,
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center', 
        paddingBottom: width * 0.07,
        //borderWidth: 1,
    },

    driverDetailDiv: {
        flexDirection: 'row',
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.045,
        //borderWidth: 1,
    },

    userImage: {
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width / 2,
    },

    driverNameDiv:{
        paddingHorizontal: width * 0.03,
        width: width * 0.5,
        justifyContent: 'center',
        //borderWidth: 1,
    },

    name: {
        fontSize: width * 0.047,
        fontFamily: Font.regular,
        lineHeight: width * 0.05622222
        //paddingBottom: 1,
    },

    moneyDiv: {
        paddingHorizontal: width * 0.01,
        width: width * 0.32,
        justifyContent: 'center',
        //borderWidth: 1,
    },

    money: {
        fontSize: width * 0.047,
        fontFamily: Font.regular,
        alignSelf: 'flex-end',
    },

    earned: {
        fontFamily: Font.regular,
        //fontWeight: "500",
        alignSelf: 'flex-end',
        fontSize: width * 0.036,
        lineHeight: width * 0.04
    },

    starImage: {
        width: width * 0.04,
        height: width * 0.04,
        resizeMode: 'cover',
        marginHorizontal: 1
    },

    childView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    ridesDiv: {
        backgroundColor: Color.dark_blue,
        width: width * 0.9,
        borderRadius: 20,
        flexDirection: 'row',
        marginHorizontal: width * 0.05,
        paddingVertical: width * 0.02,
        //alignItems: 'center',
        justifyContent: 'center',
        //paddingHorizontal: width * 0.05,
    },
    
    detailViewDiv:{
        alignItems:'center', 
        justifyContent: 'center',
        width: width * 0.27,
        marginVertical: width * 0.015,
        //marginHorizontal: width * 0.03,
        //borderWidth: 1,
    },

    count: {
        fontFamily: Font.extra_bold, 
        fontSize: width * 0.03, 
        color: Color.white,
    },

    iconDetailDiv: {
        alignItems:'center',
        marginVertical: width * 0.01,
        //borderWidth: 1
    },

    detail: {
        fontFamily: Font.bold, 
        fontSize: width * 0.02, 
        color: Color.white,
        //marginTop: 0.03,
        lineHeight: 10
    },

    icon: {
        width: width * 0.05,
        height: width * 0.05,
        resizeMode: 'contain',
        marginTop: width * 0.02,
    },

})