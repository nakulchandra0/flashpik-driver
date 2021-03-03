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

    mainContainer: {
        paddingHorizontal: width * 0.05
    },

    title: {
        fontFamily: Font.extra_bold,
        color: Color.dark_blue,
        fontSize: width * 0.05,
        paddingBottom: width * 0.03
    },

    topContainer: {
        backgroundColor: Color.light_blue,
    },

    mainBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.015,
        //borderWidth: 1
    },

    userImage: {
        width: width * 0.13,
        height: width * 0.13,
        borderRadius: width / 2,
    },

    name: {
        fontFamily: Font.bold,
        fontSize: width * 0.057,
        color: Color.dark_blue,
        marginLeft: width * 0.04,
        //borderWidth: 1
    },

    email: {
        fontFamily: Font.regular,
        fontSize: width * 0.035,
        color: Color.dark_blue,
        marginLeft: width * 0.04,
        lineHeight: width * 0.04,
    },

    menu: {
        marginHorizontal: width * 0.06,
        borderBottomWidth: 1,
        borderBottomColor: Color.grey_3,
    },

    topMenu: {
        flexDirection: 'row',
        paddingVertical: width * 0.01
    },

    menuView: {
        flexDirection: 'row',
        paddingVertical: width * 0.03
    },

    menuItem: {
        fontSize: width * 0.05,
        fontFamily: Font.bold,
        color: Color.black
    },

    menuIcon: {
        width: width * 0.065,
        height: width * 0.065,
        resizeMode: 'contain',
        marginRight: width * 0.07,
    },
})
