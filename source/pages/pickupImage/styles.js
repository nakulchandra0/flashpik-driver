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
        paddingBottom: width * 0.025
    },
     
    imgcontainerView: {
        //flexDirection: 'row',
        justifyContent: 'center',
        height: height * 0.78,
        paddingHorizontal: width * 0.05,
        //borderWidth: 1,
        //alignItems: 'center',
    },

    imgContainer: {
        width: width * 0.4,
        //width: width * 0.9,
        height: width * 0.4,
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 15,
        borderStyle: "dashed",
        alignItems:'center',
        justifyContent:'center',
        //marginTop: width * 0.02,
        marginBottom: width * 0.05
    },

    img: {
        width: width * 0.15,
        height: width * 0.13,
    },

    txt: {
        fontSize: width * 0.03,
        fontFamily: Font.light,
    },

    image: {
        width: "99%",
        height: "99%",
        borderRadius: width * 0.035
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
    }
})