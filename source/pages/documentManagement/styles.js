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
        paddingBottom: width * 0.01
    },

    orderBox: {
        width: width * 0.9,
        backgroundColor: Color.light_blue,
        borderRadius: 20,
        marginHorizontal: width * 0.05,
        marginVertical: width * 0.017,
        flexDirection: 'column',
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.04,
    },
        
    img: {
        width: '100%',
        height: width * 0.47,
        marginBottom: width * 0.01,
        resizeMode: 'stretch'
    },

    name: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.05
    },
})