import React from 'react';
import { Platform, StatusBar, Text, View, Dimensions, StyleSheet, Image, TouchableHighlight } from 'react-native';
import { Header, Badge, } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Icon } from 'react-native-elements';
import SwithToggle from 'react-native-switch-toggle';
import AsyncStorage from '@react-native-community/async-storage';

import Color from './color'
import Font from './font'

var { width, height } = Dimensions.get('window');

export default class HeaderFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Header
                leftComponent={
                    <View style={styles.nav}>
                        <View style={styles.headerLeft}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.props.goBack}>
                                <Image source={require('../../assets/img/back_arrow.png')} style={styles.menuIcon} />
                            </TouchableHighlight>
                        </View>
                    </View>
                }
                containerStyle={{
                    backgroundColor: Color.white,
                    borderBottomWidth: 0,
                    height: Platform.OS === 'ios' ? 70 - 20 : 70 - 20,
                    paddingTop: Platform.OS === 'ios' ? - 20 : 0
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: width * 0.03
    },

    title: {
        fontFamily: Font.bold,
        fontSize: width * 0.05,
        color: Color.dark_blue,
    },

    headerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: width * 0.03
    },

    menuIcon: {
        width: width * 0.07,
        height: width * 0.07,
        resizeMode: 'contain'
    },

    notificationIcon: {
        width: width * 0.065,
        height: width * 0.065,
        resizeMode: 'contain'
    },

    badge: {
        position: 'absolute',
        top: -6,
        right: 2
    },

    bText: {
        color: Color.white,
        fontSize: width * 0.03
    },

});


