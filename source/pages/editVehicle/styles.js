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

    editText: {
        fontFamily: Font.regular,
        color: Color.dark_blue,
        fontSize:width * 0.035,
        paddingVertical: width * 0.05
    },
   
    textContainer: {
        marginVertical: width * 0.01,
    },

    label: {
        fontFamily: Font.bold, 
        fontSize: width * 0.03, 
        color: Color.dark_blue
    },

    textBox: {
        paddingLeft: 0, 
        paddingTop: 0, 
        paddingBottom: 2, 
        borderBottomColor: Color.dark_blue, 
        borderBottomWidth: 2, 
        fontFamily: Font.regular, 
        fontSize: width * 0.055,
        width: width * 0.9,
        //borderWidth: 1
    },

    imageDiv: {
        width: width * 0.9,
        height: width * 0.3,
        borderRadius: 15,
        marginTop: width * 0.03,  
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: Color.dark_blue,
    },

    finalImage: {
        width: width * 0.89,
        height: width * 0.29,
        borderRadius: 15,
        // marginTop: width * 0.03,  
        // alignItems: 'center',
        // justifyContent: 'center',
        //borderWidth: 3,
        // borderStyle: "dashed",
        // borderColor: Color.dark_blue,
    },

    imageDiv: {
        width: width * 0.9,
        height: width * 0.3,
        borderRadius: 15,
        marginTop: width * 0.03,  
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.red,
        backfaceVisibility: "visible", 
    },

    image: {
        height: width * 0.3,
        width: width * 0.9,
        borderRadius: 15,
        position: 'absolute',
        opacity: 0.3,
        resizeMode: 'stretch',
    },

    deleteIcon: {
        width: width * 0.04,
        height: width * 0.05,
    },

    deleteTxt: {
        color: Color.white,
        fontSize: width * 0.05,
        fontFamily: Font.bold,
    },

    uploadImageDiv: {
        width: width * 0.9,
        height: width * 0.3,
        borderRadius: 15,
        marginTop: width * 0.03,  
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Color.white,
        backfaceVisibility: "visible", 
        borderStyle: "dashed",
        borderColor: Color.dark_blue,
        borderWidth: 3,
    },

    uploadIcon: {
        width: width * 0.11,
        height: width * 0.09,
    },

    pickerLable: {
        fontFamily: Font.bold,
        width: width * 0.9,
        padding: 0,
        borderWidth: 2,
        backgroundColor: 'black',
        margin: 0,
    },

    pickerStyle: {
        //fontFamily: Font.bold,
        //borderWidth: 2,
        width: width * 0.9,
        borderBottomWidth: 2,
        padding: 0,
        margin: 0,
    },

    buttonContainer: {
        paddingTop: width * 0.04,
        paddingBottom: 0,
        //borderWidth: 2,
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
        marginVertical: width * 0.01,
        marginHorizontal: 5,
        paddingBottom: width * 0.025,
        paddingTop: width * 0.015
    },

    deleteButton: {
        backgroundColor: Color.red,
        borderRadius: 30,
        marginTop: width * 0.05,
        marginBottom: width * 0.05,
        marginHorizontal: 5,
        paddingBottom: width * 0.025,
        paddingTop: width * 0.015
    },

    error: {
        color: Color.red,
        fontFamily: Font.extra_bold,
        fontSize: width * 0.03,
    },

})