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
        paddingBottom: width * 0.02
    },

    orderBox: {
        borderBottomColor: Color.dark_blue,
        borderBottomWidth: 1,
        paddingHorizontal: width * 0.05,
    },
    
    topNavigation: {
        flexDirection:'row',
        alignItems: 'center', 
        marginBottom: 10,
        paddingVertical: 1,
    },

    leftNavigation: {
        flex: 1,
        alignItems: 'flex-start',
    },

    rightNavigation: {
        flex: 1,
        alignItems: 'flex-end'
    },
    
    subTitle: {
        fontFamily: Font.semi_bold,
        fontSize: width * 0.037,
        lineHeight: width * 0.04
    },
 
    nav: {
        flexDirection:'row',
        borderBottomColor: Color.grey_3,
        paddingBottom: width * 0.001,
    },

    leftNav: {
        flex: 0.21,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },

    rightNav: {
        flex: 1,
        alignItems: 'flex-start'
    },

    heading: {
        fontFamily: Font.semi_bold,
        fontSize: width * 0.036
    },
    
    reason: {
        fontFamily: Font.semi_bold,
        fontSize: width * 0.032,
    },

    chatContainer: {
        flex: 1,
    }
})