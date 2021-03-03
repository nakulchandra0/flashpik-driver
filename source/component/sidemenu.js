import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Image,
    Text,
    View,
    ScrollView,
    FlatList,
    Dimensions,
    StyleSheet,
    StatusBar,
    TouchableOpacity
} from 'react-native';

import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import DeviceInfo from 'react-native-device-info';
import {
    LoginManager,
    LoginButton,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';

import Color from './color';
import Font from './font';
import Config from '../config/config';

//import { toggleDrawer } from 'react-navigation-drawer/lib/typescript/src/routers/DrawerActions';

var { width, height } = Dimensions.get('window');

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buildNumber: DeviceInfo.getVersion(),
            name: null,
            email: null,
            phone_number: null,
            profile_image: null,
            menus: [
                {
                    "name": "Home",
                    "route": "Job",
                    "icon": require('../../assets/img/side_home.png')
                },
                {
                    "name": "Trips",
                    "route": "Trips",
                    "icon": require('../../assets/img/side_order.png')
                },
                {
                    "name": "Payment",
                    "route": "Payment",
                    "icon": require('../../assets/img/side_payment.png')
                },
                {
                    "name": "Dispute",
                    "route": "Dispute",
                    "icon": require('../../assets/img/side_dispute.png')
                },
                // {
                //     "name": "Notification",
                //     "route": "Notification",
                //     "icon": require('../../assets/img/side_notification.png')
                // },
                {
                    "name": "Settings",
                    "route": "Setting",
                    "icon": require('../../assets/img/side_settings.png')
                },
                {
                    "name": "Reviews",
                    "route": "Reviews",
                    "icon": require('../../assets/img/side_reviews.png')
                },
                {
                    "name": "About",
                    "route": "About",
                    "icon": require('../../assets/img/side_about.png')
                }
            ],
            status: null,
            type: null,

            total_distance: null,
            total_houre: null,
            total_trips: null,
        }
    }

    async componentDidUpdate(prevState) {
        this.detail();
    }

    detail = async () => {
        // console.log('distance-->',await AsyncStorage.getItem('@total_distance'))
        // console.log('houre-->',await AsyncStorage.getItem('@total_houre'))
        // console.log('trips-->',await AsyncStorage.getItem('@total_trips'))
        // console.log('profile_image-->',await AsyncStorage.getItem('@profile'))

        this.setState({
            name: await AsyncStorage.getItem('@name'),
            email: await AsyncStorage.getItem('@email'),
            phone_number: await AsyncStorage.getItem('@phone'),
            profile_image: await AsyncStorage.getItem('@profile'),
            type: await AsyncStorage.getItem('@login'),
            status: await AsyncStorage.getItem('@status'),
            total_distance: await AsyncStorage.getItem('@total_distance'),
            total_houre: await AsyncStorage.getItem('@total_houre'),
            total_trips: await AsyncStorage.getItem('@total_trips'),
        })
    }

    renderItem({ item, index }) {
        //console.log(item);
        const lengthArray = this.state.menus.length;
        return (
            <View style={lengthArray - 1 == index ? [styles.menu, { borderBottomWidth: 0 }] : index == 0 ? [styles.menu, { paddingTop: height * 0.025 }] : styles.menu}>
                <TouchableOpacity underlayColor="transparent" style={styles.menuView} 
                    onPress={() => (item.name=='Home' && this.state.status == 'Offline' 
                        ? this.props.navigation.navigate('Main') 
                        : this.props.navigation.navigate(item.route)) && this.props.navigation.closeDrawer()}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.icon} style={styles.menuIcon} />
                        <Text style={styles.menuItem}>{item.name}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Icon name='arrow-right' color={Color.black} size={width * 0.03} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    async logout() {
        if (await AsyncStorage.getItem('@login') != "normal") {
            LoginManager.logOut();   
            try {
                let keys = ['@userid','@name','@email','@phone','@profile','@date_of_birth','@gender','@login','@status'];
                AsyncStorage.multiRemove(keys, (err) => {
                    console.log('Local storage user info removed!');
                });
                //this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Signin' })], 0)
                this.props.navigation.navigate('Signin');     
                return true;
            } catch(exception) {
                return false;
            }
        } else {
            try {
                let keys = ['@userid','@name','@email','@phone','@profile','@date_of_birth','@gender','@login','@status'];
                AsyncStorage.multiRemove(keys, (err) => {
                    console.log('Local storage user info removed!');
                });
                //this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Signin' })], 0)
                this.props.navigation.navigate('Signin');     
                return true;
            } catch(exception) {
                return false;
            }
        }
    }

    render() {
        let index = 0;
        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.mainBox}>
                        <View style={{ position: 'relative' }}>
                            {this.state.profile_image == null
                                ? <Image source={require('../../assets/img/user.png')} style={styles.userImage} />
                                : <Image source={{uri :this.state.profile_image}} style={styles.userImage} />}
                            <TouchableOpacity underlayColor="transparent" onPress={() => this.props.navigation.navigate('Profile')} style={styles.edit}>
                                <Image source={require('../../assets/img/edit_profile.png')} style={styles.editIcon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.profile}>
                            <Text style={styles.name}> {this.state.name}</Text>
                            <Image source={require('../../assets/img/verification.png')} 
                                style={{        
                                    width: width * 0.05,
                                    height: width * 0.05,
                                    //resizeMode: 'contain',
                                    marginLeft: 5,
                                    top: 0,
                                    alignSelf: 'baseline'
                                    //verticleAlign: 'top'
                                }} />
                        </View>
                        {this.state.phone_number && 
                            <Text style={styles.phone}> {this.state.phone_number} </Text> }
                        <Text style={styles.email}> {this.state.email} </Text>
                    </View>

                    <View style={styles.mainBoxDetail}>
                        <View style={styles.detailView}>
                            <Image source={require('../../assets/img/side_houre.png')} style={styles.verification} />
                            <Text style={styles.count}>{this.state.total_houre}</Text>
                            <Text style={styles.detail}>HOURS ONLINE</Text>
                        </View>
                        <View style={styles.detailView}>
                            <Image source={require('../../assets/img/side_distance.png')} style={styles.verification} />
                            <Text style={styles.count}>{this.state.total_distance}</Text>
                            <Text style={styles.detail}>TOTAL DISTANCE</Text>
                        </View>
                        <View style={styles.detailView}>
                            <Image source={require('../../assets/img/side_trip.png')} style={styles.verification} />
                            <Text style={styles.count}>{this.state.total_trips}</Text>
                            <Text style={styles.detail}>TOTAL TRIPS</Text>
                        </View>
                    </View>
                </View>

                {/* <View style={{height: height * 0.47,}}>
                    <ScrollView contentContainerStyle={{ height: height * 0.7}}> */}
                        <FlatList
                            refreshing={true}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.menus}
                            extraData={this.state}
                            numColumns={1}
                            renderItem={this.renderItem.bind(this)}
                        />
                    {/* </ScrollView>
                </View> */}

                    <View style={styles.logoutContainer}>
                        <TouchableOpacity underlayColor="transparent" onPress={() => this.logout()}>
                            <Image source={require('../../assets/img/logout.png')} style={styles.logout} />
                            <Text style={styles.logoutText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>

                    <Image source={require('../../assets/img/bottom_layer.png')} style={styles.bottom_view} />
                    <Text style={styles.version}>Version 1.0.0</Text>

            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },

    topContainer: {
        backgroundColor: Color.bottom_bar,
    },

    mainBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: height * 0.04,
        paddingHorizontal: width * 0.05,
        //borderWidth: 1
    },

    mainBoxDetail: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: width * 0.02,
        //paddingHorizontal: width * 0.05,
        //borderWidth:1,
        flexDirection: 'row',
    },

    detailView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: width * 0.035,
        //borderWidth:1,
    },

    verification: {
        width: width * 0.045,
        height: width * 0.045,
        resizeMode: 'contain',
        //marginLeft: 5,
        marginBottom: height * 0.001,
    },

    count: {
        fontFamily: Font.bold,
        fontSize: width * 0.031,
        color: Color.dark_blue,
    },

    detail: {
        fontFamily: Font.bold,
        fontSize: width * 0.02,
        color: Color.dark_blue,
        lineHeight: height * 0.013
    },

    userImage: {
        width: width * 0.3,
        height: width * 0.3,
        borderRadius: width / 2,
        marginTop: width * 0.06,
    },

    edit: {
        position: 'absolute',
        right: 0,
        top: 20
    },

    editIcon: {
        width: width * 0.08,
        height: width * 0.08,
        resizeMode: 'contain',
    },

    profile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.015,
        //borderWidth: 1,
    },

    name: {
        fontFamily: Font.bold,
        fontSize: width * 0.05,
        color: Color.dark_blue,
        lineHeight: height * 0.03,
        //borderWidth: 1,
    },

    phone: {
        fontFamily: Font.bold,
        fontSize: width * 0.038,
        color: Color.black,
        lineHeight: height * 0.025,
        //borderWidth: 1,
    },

    email: {
        textAlign: 'center',
        fontFamily: Font.bold,
        fontSize: width * 0.04,
        color: Color.black,
        lineHeight: height * 0.025,
        //borderWidth: 1,
    },

    menu: {
        marginHorizontal: width * 0.07,
        borderBottomWidth: 1,
        borderBottomColor: Color.grey_3,
        //borderWidth: 1
    },

    menuView: {
        flexDirection: 'row',
        height: height * 0.055,
        //borderWidth: 1
    },

    menuItem: {
        fontSize: width * 0.048,
        fontFamily: Font.bold,
        color: Color.black,
    },

    menuIcon: {
        width: width * 0.063,
        height: width * 0.063,
        resizeMode: 'contain',
        marginRight: width * 0.07
    },

    logoutContainer: {
        zIndex: 9999,
        alignItems: 'center',
        paddingBottom: width * 0.05,
        justifyContent: 'center',
        position: 'absolute',
        bottom: height * 0.005,
        width: '100%',
        //borderWidth: 1,
    },

    logout: {
        width: width * 0.15,
        height: width * 0.15,
        resizeMode: 'contain',
        alignSelf: 'center'
    },

    logoutText: {
        color: Color.dark_blue,
        fontFamily: Font.bold,
        fontSize: width * 0.045,
        alignSelf: 'center'
    },

    bottom_view: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },

    version: {
        color: Color.black,
        fontFamily: Font.light,
        fontSize: width * 0.03,
        position: 'absolute',
        bottom: height * 0.005,
        right: width * 0.02
    }

})

