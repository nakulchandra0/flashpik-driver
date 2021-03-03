import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    TextInput,
    TouchableWithoutFeedback
} from 'react-native';

import moment from 'moment';
import { Button, Input, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';
import { BoxShadow } from 'react-native-shadow';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/header';
import styles from './styles';
import Config from '../../config/config';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";

import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
//import { forModalPresentationIOS } from 'react-navigation-stack/lib/typescript/src/vendor/TransitionConfigs/CardStyleInterpolators';

var { width, height } = Dimensions.get('window');

export default class Orders extends React.Component {

    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.params = this.props.navigation.state.params;
        this.state = {
            // dispute: [
            //     {
            //         "date": "Fri 08 Nov 2019",
            //         "time": "9:15 AM",
            //         "status": "In Review",
            //         "resaon": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            //         "orderid": "ABC123456DEF789"
            //     },
            //     {
            //         "date": "Fri 08 Nov 2019",
            //         "time": "9:15 AM",
            //         "status": "Resolved",
            //         "resaon": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            //         "orderid": "ABC123456DEF789"
            //     },
            //     {
            //         "date": "Fri 08 Nov 2019",
            //         "time": "9:15 AM",
            //         "status": "Resolved",
            //         "resaon": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
            //         "orderid": "ABC123456DEF789"
            //     },
            // ],
            latitude: null,
            longitude: null,

            dispute: [],

            status: null,
            switchOn: null,
        };

    }

    async componentDidMount() {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.disputelist;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
            };

            apiService.executeFormApi(
                url,
                "POST",
                JSON.stringify(reqJson),
                async (error, response) => {

                    if (error !== "") {
                        this.setState({ isLoading: false });
                        viewUtils.showToast(error);
                    }

                    if (response !== null && response !== "") {
                        console.log(response)
                        this.setState({ isLoading: false });
                        if (response.status == "true") {
                            this.setState({ dispute: response.data })
                            viewUtils.showToast(response.message.trim());
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                }
            );
        })
    }

    _navigate = (date, time, dispute_id, status, order_id, reason) => {
        console.log('date-->', date, ', time-->', time, ', dispute id-->', dispute_id, ', status-->', status, ', order id-->', order_id, ', reason-->', reason)
        this.props.navigation.navigate('Disputedetail', { date: date, time: time, dispute_id: dispute_id, status: status, order_id: order_id, reason: reason })
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.dispute.length;
        const shadowOpt = {
            width: width * 0.9,
            height: width * 0.333,
            color: Color.black,
            border: 4,
            radius: 8,
            opacity: 0.5,
            x: 0,
            y: 0,
            style: {
                marginHorizontal: width * 0.05,
                marginVertical: width * 0.03,
                paddingVerticle: width * 0.01
            }
        }
        return (
            <TouchableWithoutFeedback onPress={() => this._navigate(item.dispute_date.split(' ')[0].trim() + ' ' + item.dispute_date.split(' ')[1].trim(), item.dispute_date.split(' ')[2].trim() + ' ' + item.dispute_date.split(' ')[3].trim(), item.dispute_id, item.dispute_status, item.order_id, item.reason)}>
                <View style={styles.orderBox}>
                    <View style={styles.topNavigation}>
                        <View style={styles.leftNavigation}>
                            <Text style={styles.subTitle}>{item.dispute_date.split(' ')[0].trim() + ' ' + item.dispute_date.split(' ')[1].trim()}</Text>
                            <Text style={styles.subTitle}>{item.dispute_date.split(' ')[2].trim() + ' ' + item.dispute_date.split(' ')[3].trim()}</Text>
                        </View>
                        <View style={styles.rightNavigation}>
                            <Text style={{ color: Color.dark_blue, fontFamily: Font.bold, fontSize: width * 0.04, lineHeight: width * 0.047, }}>{item.dispute_id}</Text>
                            <Text style={{ color: item.status == "Resolved" ? Color.light_green : Color.orange, fontSize: width * 0.035, fontFamily: Font.regular, lineHeight: width * 0.037, textTransform: 'capitalize' }}>{item.dispute_status}</Text>
                        </View>
                    </View>

                    <View style={[styles.nav, { paddingTop: width * 0.001 }]}>
                        <View style={[styles.leftNav]}>
                            <Text style={styles.heading}>Order Id </Text>
                        </View>
                        <Text> :  </Text>
                        <View style={styles.rightNav}>
                            <Text style={{ color: Color.dark_blue, fontFamily: Font.regular, fontSize: width * 0.037 }}>{item.order_id}</Text>
                        </View>
                    </View>

                    <View style={[styles.nav, { paddingBottom: width * 0.02 }]}>
                        <View style={[styles.leftNav]}>
                            <Text style={styles.heading}>Reason</Text>
                        </View>
                        <Text> :  </Text>
                        <View style={[styles.rightNav]}>
                            <Text style={{ fontSize: width * 0.032, fontFamily: Font.regular }}>{item.reason}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {

                    console.log('latitude', position.coords.latitude);
                    console.log('longitude', position.coords.longitude);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        marker: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
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
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    // status={"Online"}
                    //switchOn={this.state.status == "Offline" ? false : true }
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onPress={() => this.toggle()}
                />
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>Dispute</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        refreshing={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.dispute}
                        extraData={this.state}
                        numColumns={1}
                        renderItem={this.renderItem.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}

