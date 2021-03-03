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

    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: width / 2,
        //borderWidth: 1
        // width: width * 0.3,
        // height: width * 0.3,

    },

    imageDiv: {
        borderRadius: width / 2,
        width: width * 0.3,
        height: width * 0.3,
        //borderWidth: 1
    },

    userImage: {
        resizeMode: 'cover',
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width / 2
    },

    editText: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.03,
        paddingVertical: width * 0.02
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
        padding: 0,  
        paddingTop: 1,  
        paddingBottom: 2, 
        borderBottomColor: Color.dark_blue, 
        borderBottomWidth: 2, 
        fontFamily: Font.regular, 
        fontSize: width * 0.055,
        width: '100%'
    },

    buttonContainer: {
        paddingTop: width * 0.05,
        // borderWidth: 1,
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
        marginHorizontal: 10,
        paddingBottom: width * 0.02,
        paddingTop: width * 0.01
    },

    error: {
        color: Color.red,
        fontFamily: Font.extra_bold,
        fontSize: width * 0.03,
    },

    // radio button style
    radioContainer: {
        flexDirection: 'row',
        width: width * 0.9,
        paddingTop: width * 0.02
    },

	radioButtonContainer: {
        flexDirection: 'row',
        width: width * 0.25,
        alignItems: 'center',
	},

    txt: {
        fontFamily: Font.Bold,
        fontSize: width * 0.05,
        paddingLeft: width * 0.02,
    },

	circle: {
		height: width * 0.06,
		width:  width * 0.06,
		borderRadius: width * 1,
		borderWidth: 1,
		borderColor: Color.dark_blue,
		alignItems: 'center',
		justifyContent: 'center',
	},
  
	checkedCircle: {
		width: width * 0.04,
		height: width * 0.04,
		borderRadius: width * 1,
		backgroundColor: Color.dark_blue,
	},


})