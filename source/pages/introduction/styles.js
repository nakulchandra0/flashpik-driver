'use strict';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';

var { width, height } = Dimensions.get('window');

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center', 
        paddingHorizontal: width * 0.05,
        backgroundColor: Color.light_blue,
    },
    
    skipContainer: {
        width: width,
        paddingTop: width * 0.025,
        alignItems: 'flex-end',
        paddingHorizontal: width * 0.05,
        // borderWidth: 1,
    },

    skipText: {
        fontSize: width * 0.04,
        color: Color.grey_6,
        fontFamily: Font.bold,
    },

    topContainer: {
        height: height * (40/100),
        justifyContent:'flex-end',
        marginTop: width * 0.15,
        //borderWidth: 1,
    },

    slideImage: {
        width: width * 0.6,
        height: width * 0.7,
        resizeMode: 'contain',
    },

    middleContainer: {
        paddingTop: width * 0.03,
        //borderWidth: 1
    },

    title: {
        fontSize: width * 0.058,
        fontFamily: Font.extra_bold,
        color: Color.dark_blue,
        textAlign: 'center',
        paddingVertical: width * 0.02
    },

    content: {
        fontSize: width * 0.035,
        fontFamily: Font.regular,
        color: Color.black,
        textAlign: 'center'
    },
    
    btnBtnContainer: {
        width: '100%',
        position: 'absolute',
        bottom: height * (16/100), 
        //borderWidth: 1,
        zIndex: 9999,
    },

    buttonTitle: {
        fontFamily: Font.bold, 
        textAlign: 'center',
        fontSize: width * 0.05,
        textTransform:'uppercase'
    },

    button: {
        backgroundColor: Color.dark_blue,
        width: '90%',
        //height: 45,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 50,
        // marginTop: width * 0.15,
        //marginBottom: width * 0.04,
        paddingBottom: 5,
        paddingTop: 3,
        alignSelf: 'center',
        zIndex: 999,
    },

    bottom_view: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * (18/100),  
        //borderWidth: 1,
    },

})