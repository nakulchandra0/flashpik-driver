'use strict';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';

var { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.light_blue,
    },
    
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: width * 0.03
    },

    menuIcon: {
        width: width * 0.08, 
        height: width * 0.08, 
        resizeMode:'contain'
    },
    
    mainContainer: {
        flex:1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.1,
        alignItems: 'center', 
        marginTop: - width * 0.1
    },

    logo: {
        width: width * 0.3,         
        height: width * 0.3,
        resizeMode:'contain',
    },

    flashpik: {
        width: width * 0.55,         
        height: width * 0.2,
        resizeMode:'contain',
    },
    
    bottom_view: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: 252,
    },

    bottom_image: {
        width: width,
        resizeMode: 'contain',
    },

    version: {
        fontFamily: Font.extra_bold,
        fontSize: width * 0.032,
        color: Color.dark_blue,
        paddingBottom: width * 0.05
    },
    
    title: {
        fontFamily: Font.extra_bold,
        fontSize: width * 0.05,
        color: Color.dark_blue,
        textAlign: 'center',
        textDecorationLine: "underline"
    }
})