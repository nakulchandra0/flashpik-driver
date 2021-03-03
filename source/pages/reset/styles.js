'use strict';
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';
import { he } from 'date-fns/locale';

var { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
    container: {
        flex: 1,
    },
    
    imgBg: {
        width: '100%', 
        height: '100%',
        resizeMode: 'stretch'
    },

    overlay: {
        flex:1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 1,
        width: width,
        height: height,  
        backgroundColor:'transparent', 
        justifyContent: 'center',
        alignItems: 'center',
        //borderWidth: 1  
    }, 

    inputContainer: {
        backgroundColor: Color.light_blue, 
        width: width - width * 0.1,
        borderRadius: 12,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        padding: width * 0.03,
        paddingHorizontal: width * 0.04,
        marginTop: 0,
        //borderWidth: 1,
    },

    title: {
        fontFamily: Font.bold, 
        fontSize: width * 0.07, 
        color: Color.dark_blue
    },

    info: {
        fontSize: width * 0.04,
        fontFamily: Font.light,
        lineHeight: 15,
        paddingTop: width * 0.03
    },

    textContainer: {
        marginVertical: width * 0.03
    },

    label: {
        fontFamily: Font.bold, 
        fontSize: width * 0.03, 
        color: Color.dark_blue
    },

    textBox: {
        padding: 0,  
        paddingTop: 9, 
        paddingBottom: 2, 
        borderBottomColor: Color.dark_blue, 
        borderBottomWidth: 2, 
        fontFamily: Font.regular, 
        fontSize: width * 0.05
    },

    buttonContainer: {
        width: width, 
        paddingVertical: width * 0.02,
        alignItems: 'center',
        //marginBottom: width * 0.0001,
        //borderWidth: 1
    },

    buttonTitle: {
        fontFamily: Font.bold, 
        textAlign: 'center',
        fontSize: width * 0.05,
    },

    button: {
        backgroundColor: Color.dark_blue,
        width: width * 0.8,
        //height: height * 0.07,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 30,
        marginTop: width * 0.05,
        marginBottom: width * 0.09,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: height * 0.015,
        paddingTop: height * 0.01,
    },
    
    bottomContainer: {
        position: 'absolute',
        bottom: width * 0.05,
        //borderWidth: 1
    },

    alreadyTitle: {
        fontFamily: Font.bold, 
        fontSize: width * 0.03, 
        color: Color.black,
    },

    error: {
        color: Color.red,
        fontFamily: Font.extra_bold,
        fontSize: width * 0.03,
    },

})