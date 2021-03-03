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
    TextInput,
    TouchableHighlight,
    Linking
} from 'react-native';

var { width, height } = Dimensions.get('window');

import Icon from 'react-native-vector-icons/MaterialIcons';
import Color from '../../component/color';
import Font from '../../component/font';
import GeneralStatusBar from '../../component/statusbar/index';
import Header from '../../component/back';
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';
import { addItem } from '../../config/addToFirebase';
import { db } from '../../config/db';

import { Button, Input, CheckBox } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import { BoxShadow } from 'react-native-shadow';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
//import { transform } from '@babel/core';

// const ASPECT_RATIO = width / height;
// const LATITUDE = 23.450256;
// const LONGITUDE = 73.0739459;
// const LATITUDE_DELTA = 0.0322;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let itemRef = db.ref('/drivers');

export default class SideMenu extends Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            listData: [],

            latitude: null,
            longitude: null,
            driverid: null
        }

    }

    async componentDidMount() {
        console.log("continue data ", this.props.navigation.state.params.data);

        this.props.navigation.state.params.data.continuestatus ?
            this.setState({
                listData:
                {
                    orderid: this.props.navigation.state.params.data.id,
                    id: this.props.navigation.state.params.data.orderid,
                    customer_profile: this.props.navigation.state.params.data.profile,
                    customer_name: this.props.navigation.state.params.data.name,
                    customer_number: this.props.navigation.state.params.data.customer_number,

                    payment_method: this.props.navigation.state.params.data.paymentMethod,
                    service_name: this.props.navigation.state.params.data.serviceName,
                    quantity: this.props.navigation.state.params.data.quantity,
                    description: this.props.navigation.state.params.data.description,

                    pic_up_location: this.props.navigation.state.params.data.pickupAt,
                    pic_up_latlong: this.props.navigation.state.params.data.pic_up_latlong,

                    drop_location: this.props.navigation.state.params.data.dropAt,
                    drop_latlong: this.props.navigation.state.params.data.drop_latlong,

                    total_order_price: this.props.navigation.state.params.data.total,
                    sub_total: this.props.navigation.state.params.data.subtotal,
                    tax_fee: this.props.navigation.state.params.data.tax,
                    order_distance: this.props.navigation.state.params.data.distance,
                    timeto_destination: this.props.navigation.state.params.data.time,
                    pickup_contact_number: this.props.navigation.state.params.data.pickup_contact_number,
                    drop_contact_number: this.props.navigation.state.params.data.drop_contact_number
                }
            })
            :
            this.setState({ listData: this.props.navigation.state.params.data })

        // console.log(this.props.navigation.state.params.data)
        // console.log(this.props.navigation.state.params.vehicleid)
        // console.log(this.props.navigation.state.params.driverid)
        this.setState({ driverid: await AsyncStorage.getItem('@userid') })

        // setInterval(() => {
        //     Geolocation.getCurrentPosition(
        //         async position => {
        //             this.setState({
        //                 latitude: position.coords.latitude,
        //                 longitude: position.coords.longitude,
        //             })
        //             var location = {
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude,
        //             };    
        //        },
        //         (error) => console.log(error.message),
        // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }

        //     );

        //     itemRef.on('value', (snapshot) => {
        //         let data = snapshot.val();
        //         let items = Object.values(data);
        //         // console.log('items----->',items)
        //         //this.setState({items});
        //     });    
        //     addItem(this.state.driverid,this.state.latitude,this.state.longitude)
        // }, 5000);
    }

    _navigate() {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.gotopickup;
            var reqJson = {
                orderid: this.state.listData.id,
            };

            //console.log('reqJson ===> ', reqJson)
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
                            //console.log(this.state.listData.pic_up_latlong)
                            viewUtils.showToast(response.message.trim());
                            this.props.navigation.navigate('Pickup', {
                                id: this.state.listData.orderid,
                                profile: this.state.listData.customer_profile,
                                name: this.state.listData.customer_name,
                                orderid: this.state.listData.id,

                                paymentMethod: this.state.listData.payment_method,
                                serviceName: this.state.listData.service_name,
                                quantity: this.state.listData.quantity,
                                description: this.state.listData.description,

                                pickupAt: this.state.listData.pic_up_location,
                                pic_up_latlong: response.data.pic_up_latlong,

                                dropAt: this.state.listData.drop_location,
                                drop_latlong: response.data.drop_latlong,

                                total: this.state.listData.total_order_price,
                                subtotal: this.state.listData.sub_total,
                                tax: this.state.listData.tax_fee,
                                distance: this.state.listData.order_distance,
                                time: this.state.listData.timeto_destination,
                                pickup_contact_number: this.state.listData.pickup_contact_number,
                                drop_contact_number: this.state.listData.drop_contact_number
                            })
                            //console.log(this.state.notification)
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        });
    }

    call = () => {
        let phoneNumber = '';

        if (Platform.OS === 'android') {
            // phoneNumber = 'tel:${8000983424}';
            phoneNumber = `tel:${this.state.listData.customer_number}`;
        }
        else {
            //phoneNumber = 'telprompt:${8000983424}';
            phoneNumber = `telprompt:${this.state.listData.customer_number}`;
        }
        Linking.openURL(phoneNumber);

        // RNImmediatePhoneCall.immediatePhoneCall('8000983424');
    }

    cancel = () => {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.cancel;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
                orderid: this.state.listData.id
            };
            //console.log(reqJson)
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
                            viewUtils.showToast(response.message.trim());
                            this.props.navigation.navigate('Job')
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
    }

    render() {
        let index = 0;
        const shadowOpt = {
            width: width - width * 0.1,
            height: width * 0.335,
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
                    goBack={() => this.props.navigation.navigate('Job')}
                />

                <View style={styles.mainContainer}>
                    <Text style={styles.title}> #{this.state.listData.orderid} </Text>
                </View>

                <ScrollView>
                    <View style={styles.topContainer}>
                        {this.state.listData.customer_profile == "" ?
                            <Image source={require('../../../assets/img/user.png')} style={styles.userImage} />
                            : <Image source={{ uri: this.state.listData.customer_profile }} style={styles.userImage} />
                        }
                        <View style={{ flexDirection: 'column', width: width * 0.55 }}>
                            <Text style={styles.name} >{this.state.listData.customer_name}</Text>
                            <View style={styles.paymentMethodDiv}>
                                <Text style={styles.paymentMethod}> {this.state.listData.payment_method} </Text>
                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: width * 0.25 }}>
                            <Text style={styles.price}> ₹ {this.state.listData.total_order_price}</Text>
                            <Text style={styles.distance}> {this.state.listData.order_distance}</Text>
                        </View>
                    </View>
                    <View style={styles.mainContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Pick Up</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular, lineHeight: width * 0.04, marginTop: 4 }}>{this.state.listData.pic_up_location}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Drop Off</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular, lineHeight: width * 0.04, marginTop: 4 }}>{this.state.listData.drop_location}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Service</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular }}>{this.state.listData.service_name}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Quantity</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular }}>{this.state.listData.quantity} {this.state.listData.service_name}</Text>
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Description</Text>
                            <View style={styles.textBox}>
                                <Text style={{ fontFamily: Font.regular }}>{this.state.listData.description}</Text>
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
                                        <Text style={styles.invoicePrice}> ₹ {this.state.listData.sub_total} </Text>
                                    </View>
                                </View>

                                <View style={styles.invoiceDetailDiv}>
                                    <View style={styles.invoiceNameContainer}>
                                        <Text style={styles.invoiceName}> Tax 1 <Text style={styles.tax}>(18%) </Text> </Text>
                                    </View>
                                    <View style={styles.invoicePriceDiv}>
                                        <Text style={styles.invoicePrice}> ₹ {this.state.listData.tax_fee} </Text>
                                    </View>
                                </View>

                                <View style={[styles.invoiceDetailDiv, { borderBottomWidth: 0, }]}>
                                    <View style={styles.invoiceNameContainer}>
                                        <Text style={styles.invoiceTitle}> Total Invoice </Text>
                                    </View>
                                    <View style={styles.invoicePriceDiv}>
                                        <Text style={styles.invoiceTitle}> ₹ {this.state.listData.total_order_price} </Text>
                                    </View>
                                </View>
                            </View>
                        </BoxShadow>

                        <View style={styles.buttonMainView}>
                            <View style={styles.buttonContainer}>
                                <TouchableHighlight underlayColor="transparent" onPress={() => this.call()}>
                                    <View style={styles.btnDiv1}>
                                        <Image source={require('../../../assets/img/call_icon.png')} style={styles.icon} />
                                        <Text style={styles.buttonTitle}> Call </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableHighlight underlayColor="transparent" onPress={() => this.cancel()}>
                                    <View style={styles.btnDiv2}>
                                        <Image source={require('../../../assets/img/delete_icon.png')} style={styles.icon2} />
                                        <Text style={styles.buttonTitle}> Cancel </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                        <Button
                            title="Go To Pick Up"
                            titleStyle={styles.btntxt}
                            buttonStyle={styles.button}
                            onPress={() => this._navigate()}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

SideMenu.propTypes = {
    navigation: PropTypes.object
};

