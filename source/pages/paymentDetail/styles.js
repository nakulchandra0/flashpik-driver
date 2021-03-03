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
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.05,
        paddingBottom: width * 0.03
    },

    totalPaymentContainer: {
        height: width * 0.25,
        width: width,
        backgroundColor: Color.dark_blue,
        alignItems: 'center',
        justifyContent: 'center',
    },

    viewTotal: {
        width: width * 0.4,
        paddingVertical: width * 0.045,
        borderRadius: 15,
    },

    totalTxt: {
        color: Color.white,
        fontSize: width * 0.04,
        fontFamily: Font.bold,
    },

    symbol: {
        color: Color.white,
        fontSize: width * 0.04,
        fontFamily: Font.bold,
        lineHeight: height * 0.04
        //alignSelf: 'flex-start'
    },

    totalCount: {
        color: Color.white,
        fontSize: width * 0.075,
        fontFamily: Font.bold,
        position: 'relative'
    },

    buttonContainer: {
        paddingVertical: width * 0.05,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    btnContainer: {
        width: width * 0.4,
        marginHorizontal: width * 0.03,
        backgroundColor: Color.dark_blue,
        paddingVertical: width * 0.022,
        borderRadius: width * 0.015,
    },

    buttonTitle: {
        fontFamily: Font.bold, 
        textAlign: 'center',
        fontSize: width * 0.038,
        color: Color.white
    },

    dateContainer: {
        width: width,
        backgroundColor: Color.grey_7,
        paddingTop: width * 0.03,
        paddingBottom: width * 0.01,
        paddingLeft: width * 0.05,
    },

    date: {
        color: Color.white,
        fontSize: width * 0.04,
        fontFamily: Font.bold
    },

    transactionDetailContainer: {
        flexDirection: 'row',
        paddingVertical: width * 0.02,
        paddingLeft: width * 0.05,
    },

    transactionDetail: {
        width: width * 0.75,
    },

    detailTitle: {
        color: Color.dark_blue,
        fontFamily: Font.extra_bold,
        fontSize: width * 0.035,
    },

    moneyContainer: {
        //width: width * 0.2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    id: {
        fontFamily: Font.regular,
        fontSize: width * 0.03,
        lineHeight: height * 0.02,
        //borderWidth: 1
    },

    money: {
        fontFamily: Font.extra_bold,
        color: Color.dark_blue,
        fontSize: width * 0.045
    }
})