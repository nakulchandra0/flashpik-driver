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
        marginVertical: width * 0.02,
        flexDirection: 'column',
        paddingHorizontal: width * 0.04,
        paddingVertical: width * 0.04,
    },
        
    img: {
        width: '100%',
        height: width * 0.5,
        marginBottom: width * 0.01
    },

    name: {
        fontFamily: Font.extra_bold,
        color: Color.dark_blue,
        fontSize: width * 0.055
    },

    textContainer: {
        marginVertical: width * 0.01
    },

    label: {
        fontFamily: Font.bold, 
        fontSize: width * 0.03, 
        color: Color.dark_blue
    },

    textBox: {
        padding: 0,  
        paddingTop: 2,  
        paddingBottom: 2, 
        borderBottomColor: Color.dark_blue, 
        borderBottomWidth: 2, 
        fontFamily: Font.regular, 
        fontSize: width * 0.055,
        width: '100%',
    },

    buttonContainer: {
        paddingVertical: width * 0.05
    },

    buttonTitle: {
        fontFamily: Font.bold, 
        textAlign: 'center',
        fontSize: width * 0.05
    },

    button: {
        backgroundColor: Color.dark_blue,
        width: '100%',
        //height: 45,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 50,
        alignSelf: 'center',
        alignItems:'center',
        marginTop: width * 0.03,
        marginBottom: width * 0.05,
        paddingBottom: width * 0.03,
        paddingTop: width * 0.025
    },

    error: {
        color: Color.red,
        fontFamily: Font.extra_bold,
        fontSize: width * 0.03,
    },

})