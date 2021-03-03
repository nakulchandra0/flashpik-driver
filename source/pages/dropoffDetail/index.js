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
    TouchableOpacity,
    TextInput
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, Input, CheckBox } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { BoxShadow } from 'react-native-shadow';

import Color from '../../component/color';
import Font from '../../component/font';
import GeneralStatusBar from '../../component/statusbar/index';
import Header from '../../component/header';
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';

var { width, height } = Dimensions.get('window');

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            latitude: null,
            longitude: null,

            profile: null,
            name: null,
            paymentMethod: null,
            serviceName: null,
            quantity: null,
            description: null,

            id: null,
            pickupAt: null,
            dropAt: null,
            total: null,
            subtotal: null,
            tax: null,
            distance: null,
            orderid: null,
            time: null

        }

    }

    componentDidMount = () => {
        this.setState({ 
            id: this.props.navigation.state.params.id,
            profile: this.props.navigation.state.params.profile,
            name: this.props.navigation.state.params.name,
            paymentMethod: this.props.navigation.state.params.paymentMethod,
            serviceName: this.props.navigation.state.params.serviceName,
            quantity: this.props.navigation.state.params.quantity,
            description: this.props.navigation.state.params.description,

            pickupAt: this.props.navigation.state.params.pickupAt,
            pic_up_latlong: this.props.navigation.state.params.pic_up_latlong,

            dropAt: this.props.navigation.state.params.dropAt,
            drop_latlong: this.props.navigation.state.params.drop_latlong,

            total: this.props.navigation.state.params.total,
            subtotal: this.props.navigation.state.params.subtotal,
            tax: this.props.navigation.state.params.tax,
            distance: this.props.navigation.state.params.distance,
            orderid: this.props.navigation.state.params.orderid,
            time: this.props.navigation.state.params.time
        })
    }

    renderItem({ item, index }) {
        console.log(item);
        const lengthArray = this.state.menus.length;
        return (
            <View style={lengthArray - 1 == index ? [styles.menu, { borderBottomWidth: 0 }] : index == 0 ? [styles.menu, { paddingTop: width * 0.05 }] : styles.menu}>
                <TouchableOpacity underlayColor="transparent" style={styles.menuView} onPress={() => this.props.navigation.navigate(item.route)}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.icon} style={styles.menuIcon} />
                        <Text style={styles.menuItem} >{item.name}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Icon name='chevron-right' color={Color.black} size={width * 0.07} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {

                    console.log('latitude', position.coords.latitude);
                    console.log('longitude', position.coords.longitude);
                    this.setState({
                        // region: {
                        //     latitude: position.coords.latitude,
                        //     longitude: position.coords.longitude,
                        //     latitudeDelta: LATITUDE_DELTA,
                        //     longitudeDelta: LONGITUDE_DELTA,
                        // },        
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        // marker: {
                        //     latitude: position.coords.latitude,
                        //     longitude: position.coords.longitude,
                        // }
                    })
                    console.log('latitude', position.coords.latitude);
                    console.log('longitude', position.coords.longitude);
                    console.log(this.state.marker);
                    var location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

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
        const shadowOpt = {
            width: width - width * 0.1,
            height: width * 0.35,
            color: Color.dark_blue,
            border: 5,
            radius: 25,
            opacity: 0.4,
            x: 0,
            y: 0,
            style: {
                marginTop: width * 0.03,
            }
        }

        return (
            <View style={styles.container}>
                    <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                    <Spinner visible={this.state.isLoading} textContent={''} />

                    <Header
                        // status={"Online"}
                        // switchOn={true}
                        onMenu={() => this.props.navigation.toggleDrawer()}
                        onPress={() => this.toggle()}
                    />

                    <View style={styles.mainContainer}>
                        <Text style={styles.title}>#{this.state.id}</Text>
                    </View>

                    <View style={styles.topContainer}>
                    {this.state.profile == null ? 
                     <Image source={require('../../../assets/img/user.png')} style={styles.userImage} />
                        :  <Image source={{uri: this.state.profile}} style={styles.userImage} />
                    }
                    <View style={{ flexDirection: 'column', width: width * 0.5 }}>
                            <Text style={styles.name} >{this.state.name}</Text>
                            <View style={styles.paymentMethodDiv}>
                                <Text style={styles.paymentMethod}> {this.state.paymentMethod} </Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: width * 0.3 }}>
                            <Text style={styles.price}> ₹ {this.state.total}</Text>
                            <Text style={styles.distance}> {this.state.distance} Km</Text>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Pick Up</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular, lineHeight: width * 0.04, marginTop: 4 }} >{this.state.pickupAt}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Drop Off</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular, lineHeight: width * 0.04, marginTop: 4 }} >{this.state.dropAt}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Service</Text>
                            <View style={styles.textBox}>
                                <Text>{this.state.serviceName}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Quantity</Text>
                            <View style={styles.textBox}>
                                <Text>{this.state.quantity} {this.state.serviceName} </Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Description</Text>
                            <View style={styles.textBox}>
                                <Text>{this.state.description}</Text>
                            </View>
                        </View>

                        <BoxShadow setting={shadowOpt}>
                            <View style={styles.invoiceContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.invoiceTitle}> Invoice Detail</Text>
                                </View>
                                <View style={styles.invoiceDetailDiv}>
                                    <View style={styles.invoiceNameContainer}>
                                        <Text style={styles.invoiceName}> Fare Price </Text>
                                    </View>
                                    <View style={styles.invoicePriceDiv}>
                                        <Text style={styles.invoicePrice}> ₹ {this.state.subtotal} </Text>
                                    </View>
                                </View>

                                <View style={styles.invoiceDetailDiv}>
                                    <View style={styles.invoiceNameContainer}>
                                        <Text style={styles.invoiceName}> Tax 1 <Text style={styles.tax}>(18%) </Text> </Text>
                                    </View>
                                    <View style={styles.invoicePriceDiv}>
                                        <Text style={styles.invoicePrice}> ₹ {this.state.tax} </Text>
                                    </View>
                                </View>
                                
                                <View style={[styles.invoiceDetailDiv, { borderBottomWidth: 0 }]}>
                                    <View style={styles.invoiceNameContainer}>
                                        <Text style={styles.invoiceTitle}> Total Invoice </Text>
                                    </View>
                                    <View style={styles.invoicePriceDiv}>
                                        <Text style={styles.invoiceTitle}> ₹ {this.state.total} </Text>
                                    </View>
                                </View>
                            </View>
                        </BoxShadow>

                    </View>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

