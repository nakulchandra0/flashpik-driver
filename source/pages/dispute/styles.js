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
        //paddingTop: width * 0.02,
        //paddingBottom: width * 0.035
    },
    
    orderBox: {
        backgroundColor: Color.white,
        borderRadius: 8,
        width: width * 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 6,
        elevation: 6,
        marginHorizontal: width * 0.05,
        marginVertical: width * 0.02,
        borderWidth: 2,
        borderColor: Color.grey_4,
    }, 
     
    topNavigation: {
        flexDirection:'row',
        alignItems: 'center', 
        borderBottomWidth:1, 
        borderBottomColor: Color.grey_3,
        paddingTop: width * 0.025,
        paddingBottom: width * 0.001,
        paddingHorizontal: width * 0.03, 
        marginBottom: 5
    },

    leftNavigation: {
        width: width * 0.3,
        //borderWidth: 1,
        alignItems: 'flex-start'
    },

    rightNavigation: {
        width: width * 0.53,
        //borderWidth: 1,
        alignItems: 'flex-end',
    },
    
    subTitle: {
        fontFamily: Font.regular,
        fontSize: width * 0.035,
        lineHeight: width * 0.04,
    },
 
    nav: {
        flexDirection:'row',
        borderBottomColor: Color.grey_3,
        paddingHorizontal: width * 0.03, 
        //paddingBottom: width * 0.02
    },

    leftNav: {
        width: width * 0.165,
        justifyContent: 'flex-start',
        alignItems: 'flex-start', 
        //borderWidth: 1
    },

    rightNav: {
        width: width * 0.65,
        alignItems: 'flex-start',
        //borderWidth: 1
    },

    heading: {
        fontFamily: Font.regular,
        fontSize: width * 0.04,
        lineHeight: width * 0.053,
    },
    
})