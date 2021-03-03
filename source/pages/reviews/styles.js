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
    
    childView: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
       
    starImage: {
        width: width * 0.035,
        height: width * 0.035,
        resizeMode: 'cover',
        marginLeft: 2,
    },
      
    mainContainer: {
        paddingHorizontal: width * 0.05
    },

    title: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.05,
        paddingBottom: width * 0.01
    },

    orderBox: {
        backgroundColor: Color.white,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 6,
        marginHorizontal: width * 0.05,
        marginVertical: width * 0.02,
        borderWidth: 2,
        borderColor: Color.grey_4
    },
     
    navigation: {
        flexDirection:'row',
        alignItems: 'center', 
        borderBottomColor: Color.grey_3,
        paddingVertical: width * 0.012,
        paddingHorizontal: width * 0.03
    },

    leftNavigation: {
        width: width * 0.45,
        //borderWidth: 1
    },

    rightNavigation: {
        width: width * 0.4,
        flexDirection:'row',
        justifyContent: 'flex-end',
        //borderWidth: 1,
    },
    
    rightNav: {
        paddingRight: 10
    },

    id: {
        fontFamily: Font.regular,
        fontSize: width * 0.037
    },

    date: {
        fontFamily: Font.regular,
        fontSize: width * 0.037,
        lineHeight: height * 0.023,
        //borderWidth: 1
    },

    name: {
        fontFamily: Font.bold,
        fontSize: width * 0.042,
        color: Color.dark_blue,
    },
        
    contentNav: {
        paddingHorizontal: width * 0.03,
        paddingVertical: width * 0.012,
    },

    content: {
        fontSize: width * 0.035,
        fontFamily: Font.regular,
        lineHeight: width * 0.04
    }
})