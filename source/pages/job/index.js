
import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    StatusBar,
    Alert,
    TouchableHighlight,
    ImageBackground,
    TextInput,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Keyboard,
    TouchableWithoutFeedback,
    Animated,
    AppState,
    Platform,
    PixelRatio
} from 'react-native';

import MapView, {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType, PROVIDER_GOOGLE
} from 'react-native-maps';

import Carousel, { Pagination } from 'react-native-snap-carousel';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import MapViewDirections from 'react-native-maps-directions';
import marker from '../../../assets/img/pin_pick.png';
import markerDrop from '../../../assets/img/pin_drop.png';
import { Button, Input, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import firebase, { notifications } from 'react-native-firebase';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import RetroMapStyles from '../../component/RetroMapStyles.json';
import CustomCallout from '../../component/callout';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/header';
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';
import { addItem } from '../../config/addToFirebase';
import { db } from '../../config/db';

import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import SwithToggle from 'react-native-switch-toggle';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { duration } from 'moment';
import { Pressable } from 'react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 23.450256;
const LONGITUDE = 73.0739459;
const LATITUDE_DELTA = 0.04864195044303443;//0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyDi5VGZuYU7nnEX6WYj1DrAJygtagR3i2M';

// import Slider from './slider';
const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
    const value = (percentage * viewportWidth) / 50;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.36;
const slideWidth = 0;
const itemHorizontalMargin = width * 0.5;
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

let itemRef = db.ref('/drivers');

export default class Welcome extends React.PureComponent {
    // watchId = null;
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        //const { navigation } = props;

        this.state = {
            isModalVisible: false,
            slider1ActiveSlide: -1,
            keyboardSpace: '',
            // notification: [
            //     {
            //         "id": "1",
            //         "customer_profile": "",
            //         "customer_name": "Love Chauhan",
            //         "payment_method": "Google Pay",
            //         "total_order_price": "200.00",
            //         "order_distance": "5.5 Km",
            //         "pic_up_location": "46, Angle Arcade, Opp Kalupur Co-Operative Bank, Sold Rd, Ahmedabad, Gujrat 380041",
            //         "drop_location": "46, ABC Tower, Gurukul road, Ghatlodiya, Ahmedabad, Gujrat 380041",
            //         "route": "Trips",
            //         "pic_up_latlong": "23.156775,72.480240",
            //         "drop_latlong": "23.180764,72.749405",
            //         "accept_time": '50',
            //     },
            //     {
            //         "id": "2",
            //         "customer_profile": "",
            //         "customer_name": "Nakul Chandra",
            //         "payment_method": "Paytm",
            //         "total_order_price": "500.00",
            //         "order_distance": "7.5 Km",
            //         "pic_up_location": "46, Angle Arcade, Opp Kalupur Co-Operative Bank, Sold Rd, Ahmedabad, Gujrat 380041",
            //         "drop_location": "46, ABC Tower, Gurukul road, Ghatlodiya, Ahmedabad, Gujrat 380041",
            //         "route": "Trips",
            //         "pic_up_latlong": "23.019551,72.504664",
            //         "drop_latlong": "23.027212,72.507358",
            //         "accept_time": '50',
            //     },
            //     {
            //         "id": "3",
            //         "customer_profile": "",
            //         "customer_name": "Jigar Amin",
            //         "payment_method": "Cash",
            //         "total_order_price": "300.00",
            //         "order_distance": "7.5 Km",
            //         "pic_up_location": "46, Angle Arcade, Opp Kalupur Co-Operative Bank, Sold Rd, Ahmedabad, Gujrat 380041",
            //         "drop_location": "46, ABC Tower, Gurukul road, Ghatlodiya, Ahmedabad, Gujrat 380041",
            //         "route": "Trips",
            //         "pic_up_latlong": "23.005804,72.618771",
            //         "drop_latlong": "23.058411,72.607870",
            //         "accept_time": '50',
            //     },
            // ],

            notification: [],

            // region: {
            //     latitude: LATITUDE,
            //     longitude: LONGITUDE,
            //     latitudeDelta: LATITUDE_DELTA,
            //     longitudeDelta: LONGITUDE_DELTA,
            // },

            region: {
                latitude: 23.450256,
                longitude: 73.0739459,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },

            coordinates: [
                {
                    latitude: 23.019551,
                    longitude: 72.504664,
                },
                {
                    latitude: 23.027212,
                    longitude: 72.507358
                },
            ],

            marker:
            {
                latitude: LATITUDE,
                longitude: LONGITUDE
            },

            listData: [],

            orderid: null,
            vehicleid: null,
            driverid: null,

            hide: false,
            ignoredId: null,

            status: null,

            items: [],
            // status: null
            latitude: null,
            longitude: null,

            isShowLocation: false,
            forceRefresh: null,

            show: true,

            donavigate: 1,
        };

        this.mapView = null;
        this.map = null;
        if (Platform.OS == "ios") {
            Keyboard.addListener('keyboardDidShow', frames => {
                if (!frames.endCoordinates) return;
                this.setState({ keyboardSpace: frames.endCoordinates.height });
            });
        }

        Keyboard.addListener('keyboardDidHide', frames => {
            this.setState({ keyboardSpace: '' });
        });
        // this.currentLocation = this.currentLocation.bind(this);
    }

    async componentDidUpdate(prevProps, prevState) {
        const params = this.props.navigation.state.params;
        // console.log("params1", prevProps.navigation.state.params)
        // console.log("params2", params )
        params == undefined ? '' :
            prevProps.navigation.state.params !== undefined ?
                params.notification.orderid !== prevProps.navigation.state.params.notification.orderid ?
                    this.getNotification() : "" : this.getNotification();

        if (this.state.notification.length !== 0) {
            // console.log(this.state.notification.length)
            console.log("componentDidUpdate called..");
            if (prevState.slider1ActiveSlide !== this.state.slider1ActiveSlide) {
                // console.log(this.state.notification[this.state.slider1ActiveSlide].pic_up_latlong)
                this.setState({
                    coordinates: [
                        {
                            latitude: JSON.parse(this.state.notification[this.state.slider1ActiveSlide].pic_up_latlong.split(',')[0]),
                            longitude: JSON.parse(this.state.notification[this.state.slider1ActiveSlide].pic_up_latlong.split(',')[1]),
                        },
                        {
                            latitude: JSON.parse(this.state.notification[this.state.slider1ActiveSlide].drop_latlong.split(',')[0]),
                            longitude: JSON.parse(this.state.notification[this.state.slider1ActiveSlide].drop_latlong.split(',')[1]),
                        },
                    ],
                })
            }
        }

        // if(prevState.marker !== {                
        //     latitude: LATITUDE,
        //     longitude: LONGITUDE
        //     })
        // {
        //console.log( this.state.marker.latitude )
        // Geolocation.getCurrentPosition(
        //     position => {
        //         if(this.state.marker.latitude !== position.coords.latitude && 
        //             this.state.marker.longitude !== position.coords.longitude ) 
        //         {
        //                     //console.log( this.state.marker.latitude ) 
        //             this.setState({
        //                 region: {
        //                     latitude: position.coords.latitude,
        //                     longitude: position.coords.longitude,
        //                     latitudeDelta: LATITUDE_DELTA,
        //                     longitudeDelta: LONGITUDE_DELTA,
        //                 },
        //                 latitude: position.coords.latitude,
        //                 longitude: position.coords.longitude,
        //                 marker: {
        //                     latitude: position.coords.latitude,
        //                     longitude: position.coords.longitude,
        //                 }
        //             });

        //             var location = {
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude,
        //             };
        //         } else {
        //             console.log('hi')
        //         }
        //     },
        //     (error) => console.log(error.message),
        // );
        // }
        //addItem(this.state.driverid,this.state.latitude,this.state.longitude)
    }

    // async componentDidMount() {

    //     Geolocation.getCurrentPosition(
    //         async position => {
    //             // console.log('current location ---> componentDidMount')
    //             this.setState({
    //                 region: {
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                     latitudeDelta: LATITUDE_DELTA,
    //                     longitudeDelta: LONGITUDE_DELTA,
    //                 },
    //                 latitude: position.coords.latitude,
    //                 longitude: position.coords.longitude,

    //                 marker: {
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                 }
    //             })
    //             // var location = {
    //             //     lat: position.coords.latitude,
    //             //     lng: position.coords.longitude,
    //             // };
    //         },
    //         (error) => { console.log("getCurrentPosition "+ error.message) },
    //         { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
    //     );

    //     this.setState({
    //         status: await AsyncStorage.getItem('@status'),
    //         preTime: 0,
    //         driverid: await AsyncStorage.getItem('@userid'),
    //     });
    //     // this.currentLocation()
    //     // setInterval(() => 
    //     this.watchID = Geolocation.watchPosition(
    //         (position) => {
    //             console.log('position--->', position)
    //             // if (this.state.marker.latitude !== position.coords.latitude) {
    //                 console.log('position update--->', position.coords)

    //                 this.setState({
    //                     region: {
    //                         latitude: position.coords.latitude,
    //                         longitude: position.coords.longitude,
    //                         latitudeDelta: LATITUDE_DELTA,
    //                         longitudeDelta: LONGITUDE_DELTA,
    //                     },
    //                     latitude: position.coords.latitude,
    //                     longitude: position.coords.longitude,
    //                     marker: {
    //                         latitude: position.coords.latitude,
    //                         longitude: position.coords.longitude,
    //                     }
    //                 });
    //                 // var location = {
    //                 //     lat: position.coords.latitude,
    //                 //     lng: position.coords.longitude,
    //                 // };
    //                 // add to firebase
    //                 addItem(this.state.driverid, this.state.latitude, this.state.longitude)
    //                 // get from firebase
    //                 itemRef.on('value', (snapshot) => {
    //                     let data = snapshot.val();
    //                     let items = Object.values(data);
    //                     // console.log('items----->', items)
    //                 });
    //             // }
    //         },
    //         (error) => console.log("watchPosition "+error.message),
    //         { enableHighAccuracy: true, timeout: 2000, maximumAge: 0, distanceFilter: 0 }
    //     )
    //     // ,15000)
    // }

    async UNSAFE_componentWillMount() {
        this.index = 0;
        this.animation = new Animated.Value(0);
        this.map = null;
        this.mapView = null;

    }

    async componentDidMount() {

        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.continueorder;
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
                        // viewUtils.showToast(error);
                    }

                    if (response !== null && response !== "") {
                        this.setState({ isLoading: false });
                        if (response.status == "true") {
                            console.log('Data ===>', response.data)
                            response.data.continuestatus = true
                            if (response.data.order_status == "confirm") {
                                this.props.navigation.navigate('RideDetail', { data: response.data })
                            } else if (response.data.order_status == "pickup") {

                                response.data.continuestatus = true
                                response.data.distance = response.data.distance.substr(0, response.data.distance.indexOf(' '))
                                response.data.time = response.data.time.substr(0, response.data.time.indexOf(' '))
                                this.props.navigation.navigate('DropOff', response.data)
                            }
                        } else {
                            // viewUtils.showToast(response.message.trim());
                        }
                        await AsyncStorage.setItem('@total_distance', response.data.total_distance)
                        await AsyncStorage.setItem('@total_houre', response.data.total_houre)
                        await AsyncStorage.setItem('@total_trips', response.data.total_trips)
                    }
                });
        })


        Geolocation.getCurrentPosition(
            async position => {
                // console.log('current location ---> componentDidMount')
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,

                    marker: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                })
                // var location = {
                //     lat: position.coords.latitude,
                //     lng: position.coords.longitude,
                // };
            },
            (error) => { console.log("getCurrentPosition " + error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
        );

        this.setState({
            status: await AsyncStorage.getItem('@status'),
            preTime: 0,
            driverid: await AsyncStorage.getItem('@userid'),
        });

        // We should detect when scrolling has stopped then animate
        // We should just debounce the event listener here
        this.animation.addListener(({ value }) => {
            let index = Math.floor(value / width + 0.3); // animate 30% away from landing on the next item
            if (index >= this.state.notification.length) {
                index = this.state.notification.length - 1;
            }
            if (index <= 0) {
                index = 0;
            }

            clearTimeout(this.regionTimeout);
            this.regionTimeout = setTimeout(() => {
                if (this.index !== index) {
                    this.index = index;
                    // const { coordinate } = this.state.notification[index];
                    const { pic_up_latlong, drop_latlong } = this.state.notification[index];

                    const latitude = parseFloat(JSON.parse(pic_up_latlong.split(',')[0]));
                    const longitude = parseFloat(JSON.parse(pic_up_latlong.split(',')[1]));
                    const northeastLat = parseFloat(JSON.parse(pic_up_latlong.split(',')[0]));
                    const southwestLat = parseFloat(JSON.parse(drop_latlong.split(',')[0]));
                    const latDelta = Math.abs(northeastLat - southwestLat);
                    const lngDelta = latDelta * ASPECT_RATIO;

                    // this.setState({
                    //     coordinates: [
                    //         {
                    //             latitude: JSON.parse(pic_up_latlong.split(',')[0]),
                    //             longitude: JSON.parse(pic_up_latlong.split(',')[1]),
                    //         },
                    //         {
                    //             latitude: JSON.parse(drop_latlong.split(',')[0]),
                    //             longitude: JSON.parse(drop_latlong.split(',')[1]),
                    //         },
                    //     ],
                    // })
                    this.setState({
                        region: {
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: latDelta,
                            longitudeDelta: lngDelta,
                        },
                    })
                    // this.mapView && this.mapView.animateToRegion(
                    //     {
                    //         ...this.state.region
                    //     },
                    //     350
                    // );

                    // this.setState({ donavigate: 1 })
                    //this.mapView.fitToSuppliedMarkers(['marker0', 'marker1', 'marker2'], true)


                    // console.log("componentDidMount..." + pic_up_latlong)

                }
            }, 20);
        });
    }

    componentWillUnmount() {
        // Geolocation.clearWatch(this.watchId);
        // this.removeLocationUpdates();
    }

    removeLocationUpdates = () => {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
            this.watchId = null;
            console.log("removeLocationUpdates done");

        } else {
            console.log("removeLocationUpdates");
        }
    };

    pickLocationHandler = event => {
        //alert(event)
        const coords = event.coords;
        this.map.animateToRegion({
            ...this.state.region,
            //latitude: coords.latitude,
            // longitude: coords.longitude
        });
    };

    onRegionChange = region => {
        // console.log('onRegionChange..'+this.state.donavigate);
        // if(this.state.donavigate == 1){
        // console.log('onRegionChange.......'+this.state.donavigate);

        this.mapView && this.mapView.fitToSuppliedMarkers(['marker0', 'marker1', 'marker2'], {
            edgePadding:
            {
                top: 50,
                right: 50,
                bottom: 800,
                left: 50
            }, animated: true

        })

        //     this.setState({ donavigate: 0 })
        // }


        // this.setState({
        //     region
        // })
        // var location = {
        //     lat: region.latitude,
        //     lng: region.longitude,
        // };
        //.catch(err => console.warn(err))
        // setTimeout(() => { this.setState({ pulse: 0 }) }, 1000)
    }

    currentLocation() {
        //alert('ji')
        Geolocation.getCurrentPosition(
            async position => {
                // console.log('current location --->', position)

                this.map && this.map.animateToRegion(
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    },
                    1000
                );

                clearTimeout(this.currRegionTimeout);
                this.currRegionTimeout = setTimeout(() => {
                    this.setState({
                        region: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        },
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,

                        marker: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                    })
                }, 1000);

                // var location = {
                //     lat: position.coords.latitude,
                //     lng: position.coords.longitude,
                // };
                //viewUtils.showToast(error.message)
            },
            (error) => { console.log(error.message) },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 }
        );
    }

    async getNotification() {

        console.log("getNotification called")

        var url = Config.baseUrl + Config.acceptordervalidation;
        var reqJson = {
            orderid: this.props.navigation.state.params.notification.orderid,
            driverid: await AsyncStorage.getItem('@userid')
        };

        apiService.executeFormApi(
            url,
            "POST",
            JSON.stringify(reqJson),
            async (error, response) => {

                if (error !== "") {
                    viewUtils.showToast(error);
                }

                if (response !== null && response !== "") {
                    if (response.status == "true") {
                        var url = Config.baseUrl + Config.notificationdetails;
                        var reqJson = {
                            orderid: this.props.navigation.state.params.notification.orderid,
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
                                    this.setState({
                                        isLoading: false,
                                    });
                                    if (response.status == "true") {
                                        const responseValue = response.data
                                        console.log(responseValue)
                                        this.state.listData.push(responseValue);
                                        //this.state.notification.unshift(responseValue);
                                        this.setState({
                                            notification: this.state.listData,
                                            orderid: this.props.navigation.state.params.notification.orderid,
                                            vehicleid: this.props.navigation.state.params.notification.vehicleid,
                                            driverid: await AsyncStorage.getItem('@userid'),
                                        })
                                        if (this.state.notification.length == 1) {
                                            this.setState({ slider1ActiveSlide: 0 })
                                        } else {
                                            console.log(response.message.trim());
                                        }
                                    }
                                }
                            });
                    } else {
                        const responseValue = response
                        viewUtils.showToast(response.message.trim());
                    }
                }
            });
    }

    acceptOrder = (id, index) => {
        this.setState({
            notification: this.state.notification.filter(item => item.id != id),
            listData: this.state.notification.filter(item => item.id != id),
        })
        this._slider1Ref.snapToItem(this.state.notification.length - 2, true);
        // Get data from firebase database
        // itemRef.on('value', (snapshot) => {
        //     let data = snapshot.val();
        //     let items = Object.values(data);
        //     //console.log('items----->',items)
        //     this.setState({items});
        // });
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.acceptorder;
            var reqJson = {
                orderid: this.props.navigation.state.params.notification.orderid,
                driver_vehicle_id: this.props.navigation.state.params.notification.vehicleid,
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
                        this.setState({ isLoading: false });
                        if (response.status == "true") {
                            console.log('Data ===>', response.data)
                            this.props.navigation.navigate('RideDetail', { data: response.data })
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
    }

    ignor = (id, index) => {
        this.setState({
            notification: this.state.notification.filter(item => item.id != id),
            listData: this.state.notification.filter(item => item.id != id),
        })
        this._slider1Ref.snapToItem(this.state.notification.length - 2, true);
        console.log('notification===>', this.state.notification)
    }

    remove_post_on_list = (id, index) => {
        var data = this.state.notification.filter(itemValue => itemValue.id == id);
        this._slider1Ref.snapToItem(this.state.notification.length - 2, true);
        this.setState({
            //preTime: data[0].accept_time,
            notification: this.state.notification.filter(item => item.id != id),
            listData: this.state.notification.filter(item => item.id != id),
        })
        console.log('notification===>', this.state.notification)
        //console.log('pre time ===>',this.state.preTime)
    }

    _renderItemWithParallax({ item, index }) {
        const array = this.state.notification.length;
        //console.log('array',this.state.notification.length-1)
        return (
            // <BoxShadow setting={shadowOpt}>
            <View style={styles.jobContainer} key={index}>
                <View style={styles.header}>
                    <View style={styles.imageView}>
                        {item.customer_profile == "" ?
                            <Image source={require('../../../assets/img/user.png')} style={styles.image} />
                            : <Image source={{ uri: item.customer_profile }} style={styles.image} />}
                    </View>
                    <View style={styles.nameDiv}>
                        <Text style={styles.name}>{item.customer_name}</Text>
                        <View style={styles.paymentMethodDiv}>
                            <Text style={styles.paymentMethod}> {item.payment_method} </Text>
                        </View>
                    </View>
                    <View style={styles.priceDiv}>
                        <Text style={styles.price}>₹ {item.total_order_price}</Text>
                        <Text style={styles.distance}>{item.order_distance}</Text>
                    </View>
                </View>
                <View style={styles.detailDiv}>
                    <View style={styles.centerContainer}>
                        <View style={{ width: width * 0.7 }}>
                            <View style={[styles.locationNav, { marginTop: 5 }]}>
                                <View style={styles.timeline}>
                                    <View style={styles.line}>
                                        <View style={[styles.topLine, styles.hiddenLine]} />
                                        <View style={styles.bottomLine} />
                                    </View>
                                    <View style={[styles.dot, { backgroundColor: Color.green }]} />
                                </View>
                                <View style={styles.content}>
                                    <Text style={styles.locationTitle}>{item.pic_up_location}</Text>
                                </View>
                            </View>
                            <View style={[styles.locationNav, { marginBottom: 5 }]}>
                                <View style={styles.timeline}>
                                    <View style={styles.line}>
                                        <View style={styles.topLine} />
                                        <View style={[styles.bottomLine, styles.hiddenLine]} />
                                    </View>
                                    <View style={[styles.dot, { backgroundColor: Color.red }]} />
                                </View>
                                <View style={styles.content}>
                                    <Text style={styles.locationTitle}>{item.drop_location}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ width: width * 0.15, alignItems: 'center', justifyContent: 'center' }}>
                            <CountdownCircleTimer
                                isPlaying
                                key={item.id}
                                duration={item.accept_time}
                                //initialRemainingTime={ item.accept_time } //item.accept_time} //- this.state.preTime
                                colors={Color.dark_blue}
                                radius={10}
                                size={width * 0.12}
                                strokeWidth={5}
                                onComplete={() => {
                                    //this.remove_post_on_list(item.id)
                                }}
                            >
                                {({ remainingTime, animatedColor }) => {
                                    const minutes = Math.floor((remainingTime % 3600) / 60);
                                    const seconds = remainingTime % 60
                                    // console.log('remaining time->',remainingTime)

                                    // remainingTime !== 0 && this.setState({ preTime: remainingTime });
                                    //console.log(this.state.preTime)
                                    return (
                                        <Animated.Text style={{ color: animatedColor }}>
                                            {`${minutes}:${seconds}`}
                                        </Animated.Text>
                                    )
                                }}
                            </CountdownCircleTimer>
                        </View>
                    </View>
                    <View style={styles.btnContainer}>
                        <TouchableHighlight style={styles.button1} underlayColor="transparent" onPress={() => this.ignor(item.id)}>
                            <Text style={styles.buttonTitle1}> Ignore </Text>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor="transparent" style={styles.button2} onPress={() => this.acceptOrder(item.id)} >
                            <Text style={styles.buttonTitle2}> Accept </Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
            // </BoxShadow>
        );
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {
                    this.setState({
                        region: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        },
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        marker: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                    })
                    var location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    Geocoder.geocodePosition(location).then(res => {
                        //console.log(res[0].formattedAddress)
                        this.setState({ locationName: res[0].subLocality })
                    })
                        .catch(err => console.warn(err))

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
                                    this.props.navigation.navigate('Main')
                                } else {
                                    this.setState({ isLoading: false });
                                    this.props.navigation.navigate('Job');
                                    viewUtils.showToast(response.message)
                                }
                            }
                        })
                })
            },
            (error) => { viewUtils.showToast(error.message) },
            this.setState({ isLoading: false }),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    render() {
        const { region, pulse, locationName, slider1ActiveSlide } = this.state;


        // const interpolations = this.state.coordinates.map((marker, index) => {
        //     const inputRange = [
        //         (index - 1) * width,
        //         index * width,
        //         ((index + 1) * width),
        //     ];
        //     const scale = this.animation.interpolate({
        //         inputRange,
        //         outputRange: [1, 2.5, 1],
        //         extrapolate: "clamp",
        //     });
        //     const opacity = this.animation.interpolate({
        //         inputRange,
        //         outputRange: [0.35, 1, 0.35],
        //         extrapolate: "clamp",
        //     });
        //     return { scale, opacity };
        // });

        // console.log(this.state.marker.latitude+" "+this.state.marker.longitude);
        // console.log(region);
        // console.log(this.state.marker);

        // const padding = Platform.OS === 'android'
        //     ? PixelRatio.getPixelSizeForLayoutSize(500)
        //     : 20;

        // const mapPadding = { top: 0, right: 0, bottom: padding, left: 0 };
        const mapPadding = { top: 0, right: 0, bottom: (height / 10), left: 0 };


        return (
            <View style={styles.container} >
                <GeneralStatusBar backgroundColor={this.state.isModalVisible ? Color.transparent : Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onPress={() => this.toggle()}
                />

                {/* <Text>{this.state.marker.latitude}, {this.state.marker.longitude}</Text> */}
                <View style={styles.pickMapContainer}>
                    {this.state.notification.length == 0 ?
                        <MapView
                            style={styles.pickMap}
                            region={region}
                            provider={PROVIDER_GOOGLE}
                            customMapStyle={RetroMapStyles}
                            ref={(ref) => { this.map = ref }}
                            minZoomLevel={8}
                            onRegionChangeComplete={this.onRegionChange}
                            showsIndoorLevelPicker={true}
                            onRegionChange={() => this.setState({ pulse: 0 })}
                            zoomEnabled={true}
                            followsUserLocation={true}
                            mapPadding={mapPadding}
                        //showsUserLocation={true}           
                        //currentLocation
                        //showsMyLocationButton={true}
                        >
                            <MapView.Circle
                                center={this.state.marker}
                                radius={1000}
                                fillColor={'rgba(45, 48, 130, 0.2)'}
                                strokeWidth={0}
                            />
                            <Marker.Animated
                                coordinate={this.state.marker}
                                anchor={{ x: 0.5, y: 0.5 }}
                                // image={marker}
                                calloutOffset={{ x: -8, y: 28 }}
                                calloutAnchor={{ x: 0.5, y: 0.01 }}
                                ref={ref => { this.marker = ref; }}
                                key={marker.key}
                                identifier={"marker00"}
                                tracksViewChanges={false}
                                image={require('../../../assets/img/map_point.png')}

                            >
                                {/* <Image source={require('../../../assets/img/map_point.png')} style={{ width: width * 0.09, height: width * 0.09 }} /> */}
                            </Marker.Animated>
                        </MapView>
                        :
                        <MapView
                            ref={(ref) => { this.mapView = ref }}
                            style={styles.pickMap}
                            region={region}
                            provider={PROVIDER_GOOGLE}
                            customMapStyle={RetroMapStyles}
                            minZoomLevel={8}
                            onRegionChangeComplete={this.onRegionChange}
                            showsIndoorLevelPicker={true}
                            onRegionChange={() => this.setState({ pulse: 0 })}
                            zoomEnabled={true}
                            followsUserLocation={true}
                        >
                            {/* {this.state.coordinates.map((coordinate, index) =>
                            <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} image={index == 0 ? marker : markerDrop} />
                        )} */}
                            <MapView.Circle
                                center={this.state.marker}
                                radius={30}
                                fillColor={'rgba(45, 48, 130, 0.2)'}
                                strokeWidth={0}
                            />
                            <Marker.Animated
                                coordinate={this.state.marker}
                                anchor={{ x: 0.5, y: 0.5 }}
                                // image={marker}
                                calloutOffset={{ x: -8, y: 28 }}
                                calloutAnchor={{ x: 0.5, y: 0.01 }}
                                ref={ref => { this.marker = ref; }}
                                key={marker.key}
                                identifier={"marker2"}
                                tracksViewChanges={false}
                            >
                                <Image source={require('../../../assets/img/map_point.png')} style={{ width: width * 0.09, height: width * 0.09 }} />
                            </Marker.Animated>

                            {this.state.coordinates.map((marker, index) => {
                                // const scaleStyle = {
                                //     transform: [
                                //         {
                                //             scale: interpolations[index].scale,
                                //         },
                                //     ],
                                // };
                                // const opacityStyle = {
                                //     opacity: interpolations[index].opacity,
                                // };
                                return (
                                    <MapView.Marker coordinate={marker} identifier={`marker${index}`}>
                                        <Animated.View style={{ alignItems: "center", justifyContent: "center" }}>
                                            {/* <Animated.View style={[styles.ring, scaleStyle]} /> */}
                                            <Image
                                                key={`coordinate_${index}`}
                                                source={index == 0 ? require('../../../assets/img/pin_pick_2.png') : require('../../../assets/img/pin_drop_2.png')}
                                                style={{ width: width * 0.06, height: width * 0.06 }}
                                            />
                                        </Animated.View>
                                    </MapView.Marker>
                                );
                            })}

                            {(this.state.coordinates.length >= 2) && (
                                <MapViewDirections
                                    origin={this.state.coordinates[0]}
                                    // waypoints={(this.state.mark.length > 2) ? this.state.mark.slice(1, -1) : null}
                                    destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={3}
                                    strokeColor={Color.dark_blue}

                                />
                            )}

                            {(this.state.coordinates.length >= 2) && (
                                <MapViewDirections
                                    region={region}
                                    origin={this.state.marker}
                                    // waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
                                    destination={this.state.coordinates[0]}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={5}
                                    strokeColor={Color.dark_blue}
                                    lineDashPattern={[47.12, 10]}
                                />
                            )}

                        </MapView>
                    }
                </View>

                {this.state.notification.length == 0
                    ? <View style={[styles.mapImageContainer, { bottom: 10 }]}>
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.currentLocation()}>
                            <Image source={require('../../../assets/img/location.png')}
                                style={{ width: width * 0.15, height: width * 0.15 }} />
                        </TouchableHighlight>
                    </View>
                    : <View style={[styles.mapImageContainer, { bottom: height * 0.3 }]}>
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.currentLocation()}>
                            <Image source={require('../../../assets/img/location.png')}
                                style={{ width: width * 0.15, height: width * 0.15 }} />
                        </TouchableHighlight>
                    </View>
                }

                <View style={styles.carouselContainer}>
                    <Carousel
                        extraData={this.state}
                        ref={c => this._slider1Ref = c}
                        data={this.state.notification}
                        renderItem={this._renderItemWithParallax.bind(this)}
                        sliderWidth={sliderWidth}
                        slideHeight={width}
                        itemWidth={itemWidth}
                        hasParallaxImages={true}
                        //firstItem={this.state.slider1ActiveSlide}
                        inactiveSlideScale={0.94}
                        inactiveSlideOpacity={0.7}
                        inactiveSlideShift={20}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        removeClippedSubviews={false}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                        layout={'default'}
                        layoutCardOffset={-13}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            x: this.animation,
                                        },
                                    },
                                },
                            ],
                            { useNativeDriver: true }
                        )}

                        enableMomentum
                        snapOnAndroid
                        autoplay={false}
                        keyExtractor={item => item.id}
                    //refreshing={true}
                    //useScrollView={true}

                    />
                </View>
            </View >
        );
    }
}