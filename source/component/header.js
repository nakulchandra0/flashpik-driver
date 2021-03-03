import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    StatusBar,
    Alert,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import { Header, Badge, } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Icon } from 'react-native-elements';
import SwithToggle from 'react-native-switch-toggle';

var { width, height } = Dimensions.get('window');

import Color from './color';
import Font from './font';
import Job from '../pages/job/index';
import ApiService from "../config/ApiService";
import Utility from "../config/utility";
import AsyncStorage from '@react-native-community/async-storage';

export default class HeaderFile extends React.Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        // const status = true;
        //switchOn = true
        //console.log('---->',props)
        this.state = {
            switchOn: true,
            status: null
        };
    }

    componentDidMount = async() => {
        setInterval(async()=> {
            //console.log('goBack',await AsyncStorage.getItem('@status'))
            this.setState({
                status: await AsyncStorage.getItem('@status'),
            })
            this.state.status == "Offline" ? this.setState({switchOn: false}) : this.setState({switchOn: true})
        },100)
    }
    
    render() {
        //console.log('hi===>',this.props.switchOn)
        return (
            <Header
                leftComponent={
                    <View style={styles.nav}>
                        <View style={styles.headerLeft}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.props.onMenu}>
                                <Image source={require('../../assets/img/side_menu.png')} style={styles.menuIcon} />
                            </TouchableHighlight>
                        </View>
                    </View>
                }
                centerComponent={
                    <View style={styles.nav}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.title}> {this.state.status} </Text>
                        </View>
                    </View>
                }
                rightComponent={
                    <View style={styles.nav}>
                        <View style={styles.headerRight}>
                            <SwithToggle
                                containerStyle={{
                                    marginRight: 15,
                                    width: width * 0.1,
                                    height: width * 0.052,
                                    borderRadius: 30,
                                    padding: 0,
                                    borderWidth: 1,
                                    borderColor: Color.dark_blue
                                }}
                                circleStyle={{
                                    width: width * 0.05,
                                    height: width * 0.05,
                                    borderRadius: 19,
                                }}
                                switchOn={this.state.switchOn}
                                onPress={this.props.onPress}
                                backgroundColorOn={Color.white}
                                backgroundColorOff={Color.white}
                                circleColorOff={Color.dark_blue}
                                circleColorOn={Color.dark_blue}
                                duration={0}
                            />
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
        paddingHorizontal: width * 0.025
    },

    title: {
        fontFamily: Font.bold,
        fontSize: width * 0.05,
        color: Color.dark_blue,
    },

    headerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: width * 0.03
    },

    menuIcon: {
        width: width * 0.08,
        height: width * 0.08,
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


