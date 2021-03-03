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

    topContainer: {
        backgroundColor: Color.light_blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.05,
        flexDirection: 'row',
        paddingVertical: width * 0.027,
        //borderWidth: 1,
    },

    userImage: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width / 2,
        //borderWidth: 1,
    },

    name: {
        fontFamily: Font.regular,
        fontSize: width * 0.044,
        marginLeft: width * 0.03,
        lineHeight: width * 0.05,
    },

    paymentMethodDiv: {
        backgroundColor: Color.dark_blue,
        alignItems: 'center',
        width: width * 0.22,
        borderRadius: 4,
        justifyContent: 'center',
        paddingTop: width * 0.005,
        marginLeft: width * 0.03,
    },

    paymentMethod: {
        color: Color.white,
        fontSize: width * 0.022,
        fontFamily: Font.regular,
        lineHeight: width * 0.025,
        //paddingHorizontal: 10
    },

    price: {
        fontSize: width * 0.042,
        fontFamily: Font.regular,
    },

    distance: {
        fontSize: width * 0.033,
        fontFamily: Font.regular,
        lineHeight: width * 0.04
    },

    mainContainer: {
        paddingHorizontal: width * 0.05
    },

    textContainer: {
        marginVertical: width * 0.013,
    },

    label: {
        fontFamily: Font.extra_bold,
        fontSize: width * 0.03,
        color: Color.dark_blue
    },

    textBox: {
        padding: 0,
        paddingTop: 3,
        paddingBottom: 2,
        borderBottomColor: Color.dark_blue,
        borderBottomWidth: 2,
        fontFamily: Font.regular,
        fontSize: width * 0.05,
        width: '100%',
    },

    invoiceContainer: {
        borderColor: Color.dark_blue,
        borderRadius: 25,
        borderWidth: 2,
        //marginTop: width * 0.01,
        backgroundColor: Color.white,
        
        // shadowColor: Color.black,
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 1,
        // shadowRadius: 3.84,
        // elevation: 5,
    },

    titleContainer: {
        borderBottomWidth: 1,
        borderColor: Color.grey_4,
        paddingVertical: width * 0.01,
        paddingHorizontal: width * 0.02,
    },

    invoiceTitle: {
        fontFamily: Font.bold,
        color: Color.dark_blue,
        fontSize: width * 0.041,
    },

    invoiceDetailDiv: {
        flexDirection: 'row',
        marginHorizontal: 8,
        marginVertical: 1,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: Color.grey_3,
    },

    invoiceNameContainer: {
        width: width * 0.50,
    },

    invoiceName: {
        fontSize: width * 0.038,
    },

    tax: {
        fontSize: width * 0.023,
        fontFamily: Font.bold
    },

    invoicePriceDiv: {
        width: width * 0.35,
        alignItems: 'flex-end',
        //borderWidth: 1,
    },

    buttonMainView: {
        flexDirection: 'row',
    },

    buttonContainer: {
        paddingVertical: width * 0.04,
        width: width * 0.45,
        //borderWidth: 1,
    },

    btnDiv1: {
        backgroundColor: Color.dark_blue,
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: width * 0.025,
        width: width * 0.25,
        marginLeft: width * 0.13
        //borderWidth: 1,
    },

    icon: {
        width: width * 0.055,
        height: width * 0.055,
        marginBottom: 5,
    },

    buttonTitle: {
        color: Color.white,
        textAlign: 'center',
        fontSize: width * 0.045
    },

    btnDiv2: {
        backgroundColor: Color.red,
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: width * 0.025,
        width: width * 0.25,
        marginLeft: width * 0.07
    },

    icon2: {
        width: width * 0.045,
        height: width * 0.055,
        marginBottom: 5,
    },

    button:{
        backgroundColor: Color.dark_blue,
        borderRadius: 25,
        marginVertical: width * 0.05,
        paddingBottom: width * 0.02
    },

    btntxt: {
        color: Color.white,
        fontFamily: Font.bold, 
        textAlign: 'center',
        fontSize: width * 0.05
    }
})
