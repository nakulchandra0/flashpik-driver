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
        paddingBottom: width * 0.03
    },
    
    navbar: {
        width: width,
        flexDirection: 'row',
        justifyContent: "center",
        backgroundColor: Color.white,
        //borderRadius: 5,
        alignItems:'center',
        paddingVertical: width * 0.025,
        paddingHorizontal: width * 0.05,
        //borderTopColor: Color.grey_4,
    },
     
    leftContainer: {
        flexDirection: 'row',
        marginRight: width *  0.03,
    },
    
    centerContainer:{
        flex: 1, 
        justifyContent: 'flex-start',
        alignItems:'flex-start'
    },

    rightContainer: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    
    notTitle: {
        textAlign: 'left',
        fontSize: width * 0.042, 
        fontFamily: Font.regular,
        alignItems:'center',
        color: Color.dark_blue
    },

    date: {
        fontSize: width * 0.025,
        lineHeight: width * 0.03
    },

    icon: {
        resizeMode: 'contain',
        width: width * 0.1,
        height: width * 0.1
    },
})