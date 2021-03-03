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
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Color from '../../component/color';
import Font from '../../component/font';
import GeneralStatusBar from '../../component/statusbar/index';
import Header from '../../component/header';
import styles from './styles';
import Config from '../../config/config';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";

var { width, height } = Dimensions.get('window');

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            menus: [
                {
                    "name": "Vehicle Management",
                    "route": "VehicleManagement",
                    "icon": require('../../../assets/img/setting_vehicle_management.png')
                },
                {
                    "name": "Document Management",
                    "route": "DocumentManagement",
                    "icon": require('../../../assets/img/setting_document_management.png')
                },
                {
                    "name": "Reviews",
                    "route": "Reviews",
                    "icon": require('../../../assets/img/setting_reviews_icon.png')
                },
                {
                    "name": "Terms & Conditions",
                    "route": "Term&Condition",
                    "icon": require('../../../assets/img/setting_term&condition.png')
                },
                {
                    "name": "Privacy Policy",
                    "route": "PrivacyPolicy",
                    "icon": require('../../../assets/img/setting_privacy_policy.png')
                },
                {
                    "name": "Contact",
                    "route": "Contact",
                    "icon": require('../../../assets/img/setting_contact.png')
                },
            ],
            name: null,
            email: null,
            profile: [],
            status: null,

            latitude: null,
            longitude: null,
        }

    }

    componentDidMount = async () => {
        setInterval(async() => {
            //alert(await AsyncStorage.getItem('@status'))
            this.setState({
                status: await AsyncStorage.getItem('@status'),
                name: await AsyncStorage.getItem('@name'),
                email: await AsyncStorage.getItem('@email'),
                profile: { uri: await AsyncStorage.getItem('@profile'), type: 'image/jpg', name: 'image.jpg' },
            })
        },100)
    }

    renderItem({ item, index }) {
        //console.log(item);
        const lengthArray = this.state.menus.length;
        return (
            <View style={lengthArray - 1 == index ? [styles.menu] : index == 0 ? [styles.menu, { paddingTop: width * 0.05 }] : styles.menu}>
                <TouchableOpacity underlayColor="transparent" style={styles.menuView} onPress={() => this.props.navigation.navigate(item.route)}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.icon} style={styles.menuIcon} />
                        <Text style={styles.menuItem} >{item.name}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Icon name='arrow-right' color={Color.black} size={width * 0.035} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    })
                    await AsyncStorage.getItem('@status') == "Offline" || await AsyncStorage.getItem('@status') == null ? await AsyncStorage.setItem('@status', "Online") : await AsyncStorage.setItem('@status', "Offline")

                    var url = Config.baseUrl + Config.driveronlineoffline;
                    var reqJson = {
                        driverid: await AsyncStorage.getItem('@userid'),
                        latitudes: this.state.latitude,
                        longitudes: this.state.longitude,
                        status: await AsyncStorage.getItem('@status'),
                    };

                    apiService.executeFormApi(
                        url,
                        "POST",
                        JSON.stringify(reqJson),
                        async (error, response) => {

                            if (error !== "") {
                                this.setState({ isLoading: false });
                                //viewUtils.showToast(error);
                            }

                            if (response !== null && response !== "") {
                                console.log('main', response)
                                if (response.message == "Successfully Offline" || response.status == "false") {
                                    this.setState({ isLoading: false })
                                    viewUtils.showToast(response.message)
                                    //this.props.navigation.navigate('Main')
                                } else {
                                    this.setState({ isLoading: false });
                                    //this.props.navigation.navigate('Job');
                                    viewUtils.showToast(response.message)
                                }
                            }
                        })
                })
            },
            error => viewUtils.showToast(error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        //alert('2')
    }

    render() {
        let index = 0;
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    // switchOn={true}
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onPress={() => this.toggle()}
                />

                <View style={styles.mainContainer}>
                    <Text style={styles.title}>Setting</Text>
                </View>

                <View style={styles.topContainer}>
                    <View style={styles.mainBox}>
                        <TouchableOpacity underlayColor="transparent" style={styles.topMenu} onPress={() => this.props.navigation.navigate('Profile')}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                {this.state.profile.uri == null ?
                                    <Image source={require('../../../assets/img/user.png')} style={styles.userImage} />
                                    : <Image source={this.state.profile} style={styles.userImage} />}
                                <View style={{ flexDirection: 'column',}}>
                                    <Text style={styles.name}>{this.state.name} </Text>
                                    <Text style={styles.email}>{this.state.email} </Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end', justifyContent: 'center', width: width * 0.08 }}>
                                <Icon name='arrow-right' color={Color.dark_blue} size={width * 0.055} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView>
                    <FlatList
                        refreshing={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.menus}
                        extraData={this.state}
                        numColumns={1}
                        renderItem={this.renderItem.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

