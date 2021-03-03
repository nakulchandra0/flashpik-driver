'use strict';
import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';
import { OpaqueColorValue } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

var { width, height } = Dimensions.get('window');

const IS_IOS = Platform.OS === 'ios';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white
    },
    statusContainer: {
        width: width,
        height: width * 0.14,
        backgroundColor: Color.dark_blue,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: width * 0.04,
    },
    statusHeading: {
        fontSize: width * 0.05,
        color: Color.white,
        fontFamily: Font.extra_bold,
    },
    statusDetail: {
        fontSize: width * 0.03,
        color: Color.white,
        fontFamily: Font.bold,
    },
    pickMap: {
        height: height,
        position: 'relative',
    },

    mapImageContainer: {
        width: width,
        //borderWidth: 10,
        bottom: 0,
        position: 'absolute',
        //justifyContent: 'flex-en'
        alignItems: 'flex-end',
        paddingRight: 10,
    },

    carouselContainer: {
        width: width,
        position: 'absolute',
        bottom: height * 0.005,
        //borderWidth: 10
    },

    slider: {
        overflow: 'visible',
        // bottom: height * 0.005,
        //borderWidth: 2
    },

    jobContainer: {
        borderRadius: 25,
        shadowColor: Color.black,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 2.62,
        elevation: 4,
        marginLeft: 2,
        marginTop: height * 0.04,
        marginBottom: 5,
        width: width * 0.95,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Color.grey_5,
    },

    header: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: width * 0.03,
        //paddingHorizontal: width * 0.03,
        backgroundColor: Color.light_blue,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        //marginHorizontal: 0.01,
        //borderWidth: 1,
        // borderColor: Color.grey_5,
        // borderBottomWidth: 0,
    },

    imageView: {
        width: width * 0.1,
        height: width * 0.1,
        justifyContent: 'center',
        borderRadius: width / 2,
        resizeMode: 'contain',
        marginLeft: width * 0.04,
        //borderWidth: 1
    },

    image: {
        width: "100%",
        height: "100%",
        borderRadius: width / 2,
    },

    nameDiv: {
        width: width * 0.47,
        //height: width * 0.15,
        justifyContent: 'center',
        paddingLeft: 10,
        //borderWidth: 1,
        //paddingVertical: width * 0.01
    },

    name: {
        fontSize: width * 0.042,
        fontFamily: Font.regular,
        lineHeight: width * 0.05,
    },

    paymentMethodDiv: {
        backgroundColor: Color.dark_blue,
        alignItems: 'center',
        width: width * 0.23,
        borderRadius: 4,
        justifyContent: 'center',
        //paddingTop: width * 0.001
    },

    paymentMethod: {
        color: Color.white,
        fontSize: width * 0.022,
        fontFamily: Font.bold,
        lineHeight: width * 0.028,
        paddingVertical: 3
    },

    priceDiv: {
        width: width * 0.25,
        //height: width * 0.15,
        alignItems: 'flex-end',
        //paddingRight: 5,
        justifyContent: 'center',
        //borderWidth: 1
    },

    price: {
        fontSize: width * 0.042,
        fontFamily: Font.regular,
    },

    distance: {
        fontSize: width * 0.034,
        fontFamily: Font.regular,
    },

    detailDiv: {
        width: '100%',
        backgroundColor: Color.white,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingHorizontal: 5,
        //borderWidth: 1,
        //flexDirection: 'row'
        // borderColor: Color.grey_4,
        // borderTopWidth: 0
    },

    centerContainer: {
        width: '100%',
        backgroundColor: Color.white,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        //paddingHorizontal: 5,
        //borderWidth: 1,
        flexDirection: 'row'
    },

    locationNav: {
        padding: width * 0.01,
        paddingLeft: 0,
        //borderWidth: 1,
    },

    dot: {
        width: width * 0.02,
        height: width * 0.02,
        borderRadius: 50,
    },

    content: {
        marginLeft: 35,
    },

    locationTitle: {
        fontFamily: Font.bold,
        fontSize: width * 0.029
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

    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingBottom: 13,
        paddingLeft: width * 0.33,
    },

    buttonTitle1: {
        fontFamily: Font.bold,
        fontSize: width * 0.03,
        color: Color.dark_blue,
        marginVertical: 5
    },

    button1: {
        backgroundColor: Color.white,
        borderColor: Color.dark_blue,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.06,
        paddingBottom: width * 0.005,
        marginHorizontal: width * 0.01,
        borderWidth: 1,
    },

    buttonTitle2: {
        fontFamily: Font.bold,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: width * 0.03,
        color: Color.white,
    },

    button2: {
        backgroundColor: Color.dark_blue,
        borderWidth: 0,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.06,
        paddingBottom: width * 0.005,
        marginHorizontal: width * 0.01,
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },

    appContainer: {
        flex: 1,
    },

    appHeader: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        flexDirection: 'column',
        flex: 0,
        height: 130,
        paddingTop: 25,
        paddingHorizontal: 10,
        backgroundColor: Color.dark_blue,
        zIndex: 2,
    },

    appFooter: {
        flex: 0,
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: Color.dark_blue,
    },

    inputContainer: {
        marginBottom: 5,
        flexDirection: 'row',
    },

    inputLabel: {
        color: Color.light_blue,
        fontSize: 20,
        marginBottom: 10,
        fontFamily: Font.light,
    },

    input: {
        backgroundColor: Color.light_blue,
        color: Color.dark_blue,
        padding: 15,
        borderRadius: 3,
        fontSize: 19,
        flex: 1,
    },

    button: {
        flex: 0,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        fontFamily: "Navigation",
        fontSize: 30,
        color: Color.light_blue,
    },

    map: {
        flex: 1,
    }


})