'use strict';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';

var { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center', 
        paddingHorizontal: width * 0.1,
        backgroundColor: Color.light_blue,
    },
     
    logo: {
        width: width * 0.4,         
        height: width * 0.4,
        resizeMode:'contain',
    },

    flashpik: {
        width: width * 0.6,         
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
    }
})