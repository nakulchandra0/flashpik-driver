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
        width: width * 0.045,
        height: width * 0.045,
        resizeMode: 'cover',
    },
      
    mainContainer: {
        paddingHorizontal: width * 0.05
    },

    title: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.07,
        paddingTop: width * 0.03,
        paddingBottom: width * 0.05
    },

    orderBox: {
        backgroundColor: Color.white,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        marginHorizontal: width * 0.05,
        marginVertical: width * 0.02
    },
     
    navigation: {
        flexDirection:'row',
        alignItems: 'center', 
        borderBottomColor: Color.grey_3,
        padding: width * 0.03,
    },

    leftNavigation: {
        flex: 1
    },

    rightNavigation: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'flex-end'
    },
    
    rightNav: {
        paddingRight: 10
    },

    date: {
        fontFamily: Font.regular,
        fontSize: width * 0.045
    },

    orderStatus: {
        fontFamily: Font.regular,
        fontSize: width * 0.045
    },

    name: {
        fontFamily: Font.regular,
        fontSize: width * 0.045,
    },

    userImage: {
        width: width * 0.1,
        height: width * 0.1,
        resizeMode: 'contain',
        borderRadius: width / 2
    },

    locationNav: {
        padding: width * 0.01,
        paddingLeft: 0,
    },

    dot: {
        width: width * 0.03,
        height: width * 0.03,
        borderRadius: 50,
    },

    content: {
        marginLeft: 40,
    },

    locationTitle: {
        fontFamily: Font.regular,
        fontSize: width * 0.03
    },

     
    timeline: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 40,
        justifyContent: 'center',  
        alignItems: 'center',
    },
    
    line: {
        position: 'absolute',
        top: 0,
        width: 2,
        bottom: 0,
    },
    
    topLine: {
        flex: 1,
        width: 2,
        backgroundColor: 'black',
    },
    
    bottomLine: {
        flex: 1,
        width: 2,
        backgroundColor: 'black',
    },
    
    hiddenLine: {
        width: 0,
    },
      
})