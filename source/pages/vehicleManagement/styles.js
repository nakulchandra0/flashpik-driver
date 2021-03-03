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

    vehicleContainer: {
        width: width * 0.9,
        height: height * 0.75,
        //borderWidth: 1,
    },

    orderBox: {
        width: width * 0.9,
        backgroundColor: Color.light_blue,
        borderRadius: width * 0.05,
        marginVertical: width * 0.02,
        flexDirection: 'row',
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.04,
    },
        
    leftNavigation: {
        width: width * 0.15,
        //alignItems: 'center',
        //borderWidth: 1,
        justifyContent: 'center',
    },

    menuIcon: {
        width: width * 0.13,
        height: width * 0.13,
    },

    centerNavigation: {
        width: width * 0.57,
        justifyContent: 'center',
        paddingLeft: width * 0.01,
        //borderWidth: 1,
    },

    rightNavigation: {
        width: width * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        //borderWidth: 1,
    },
    
    name: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.06,
        lineHeight: width * 0.07
    },

    number: {
        fontFamily: Font.regular,
        fontSize: width * 0.045,
        color: Color.dark_blue,
        lineHeight: width * 0.05
    },

    radioBorder: {
        width: width * 0.07, 
        height: width * 0.07, 
        borderWidth: 1,
        borderRadius: width /2, 
        alignItems: 'center',
        justifyContent: 'center'
    },

    innerRadio: {
        width: width * 0.07, 
        height: width * 0.07, 
        backgroundColor: Color.dark_blue, 
        borderRadius: width /2,
        alignItems:'center',
        justifyContent: 'center',
    },

    checkIcon: {
        color: Color.light_blue,
        fontSize: width * 0.05,
    },

    footerNav: {
        alignItems: 'center',
        justifyContent: 'center',
        //borderWidth: 1,
        position: 'absolute',
        bottom: 0,
        width: width,
        paddingVertical: height * 0.01,
        alignSelf: 'flex-end'
    },

    addIcon: {
        width: width * 0.2,
        height: width *0.2,
    }

})