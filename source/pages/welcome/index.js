import * as React from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    PermissionsAndroid
} from 'react-native';
import MapView, {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType,
    PROVIDER_GOOGLE
} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Circle } from 'react-native-svg';
import { round } from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import { Button, Input } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

//import NetInfo from "@react-native-community/netinfo";

import marker from '../../../assets/img/map_point.png';
/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import RetroMapStyles from '../../component/RetroMapStyles.json';
import CustomCallout from '../../component/callout';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/header';
import styles from './styles';
import Config from '../../config/config';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import { TouchableHighlight } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 23.450256;
const LONGITUDE = 73.0739459;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyDi5VGZuYU7nnEX6WYj1DrAJygtagR3i2M';

export default class Welcome extends React.PureComponent {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
            Default_Rating: 3.5,
            Max_Rating: 5,
            Default_Rating_form: 0,

            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },

            marker:
            {
                latitude: LATITUDE,
                longitude: LONGITUDE
            },

            name: null,
            status: null,
            isLoading: false,

            locationName: null,
            latitude: null,
            longitude: null,

            isShowLocation: false,
            forceRefresh: null,

            total_distance: null,
            total_houre: null,
            total_trips: null,
            total_earned: null,
        };
        this.Star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
        this.Star_With_Border = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

    }

    UpdateRating(key) {
        console.log("rating " + key);
        this.setState({ Default_Rating: key });
    }

    componentDidMount = async () => {
        //alert()
        //console.log(await AsyncStorage.getItem('@status'))
        //alert(await AsyncStorage.getItem('@status'))
        this.setState({
            name: await AsyncStorage.getItem('@name'),
            status: await AsyncStorage.getItem('@status')
        })

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Cool Photo App location Permission",
                    message:
                        "Cool Photo App needs access to your location " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
                Geolocation.getCurrentPosition(
                    async position => {
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
                        // console.log('latitude', position.coords.latitude);
                        // console.log('longitude', position.coords.longitude);
                        // console.log(this.state.marker)

                        var location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        Geocoder.geocodePosition(location).then(res => {
                            console.log(res[0].formattedAddress)
                            this.setState({ locationName: res[0].subLocality })
                        })
                        //.catch(err => viewUtils.showToast(err))
                    },
                    (error) => viewUtils.showToast(error.message),
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                console.log("location permission denied");
            }
        } catch (err) {
            console.warn(err);
        }


        // Geolocation.watchPosition(
        //     async position => {
        //         // this.setState({
        //         //     region: {
        //         //         latitude: position.coords.latitude,
        //         //         longitude: position.coords.longitude,
        //         //         latitudeDelta: LATITUDE_DELTA,
        //         //         longitudeDelta: LONGITUDE_DELTA,
        //         //     },
        //         //     latitude: position.coords.latitude,
        //         //     longitude: position.coords.longitude,
        //         //     marker: {
        //         //         latitude: position.coords.latitude,
        //         //         longitude: position.coords.longitude,
        //         //     }
        //         // })
        //         console.log('latitude', position.coords.latitude);
        //         console.log('longitude', position.coords.longitude);
        //         console.log(this.state.marker)

        //         // var location = {
        //         //     lat: position.coords.latitude,
        //         //     lng: position.coords.longitude,
        //         // };

        //         // Geocoder.geocodePosition(location).then(res => {
        //         //     console.log(res[0].formattedAddress)
        //         //     this.setState({ locationName: res[0].subLocality })
        //         // })
        //         .catch(err => alert(err))
        //         // viewUtils.showToast(err))
        //     },
        //     (error) => viewUtils.showToast(error.message),
        //     //viewUtils.showToast(error)
        //     //{enableHighAccuracy: true, timeout: 20000, maximumAge: 0} 
        // );

        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.dashboard;
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
                            this.setState({
                                total_distance: response.data.total_distance,
                                total_houre: response.data.total_houre.split(' ')[0],
                                total_trips: response.data.total_trips,
                                total_earned: response.data.total_earned,
                                Default_Rating: response.data.total_avg_rating
                            })
                            await AsyncStorage.setItem('@total_distance', response.data.total_distance)
                            await AsyncStorage.setItem('@total_houre', response.data.total_houre)
                            await AsyncStorage.setItem('@total_trips', response.data.total_trips)
                            //viewUtils.showToast(response.message.trim());
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
    }

    pickLocationHandler = event => {
        const coords = event.coords;
        this.map.animateToRegion({
            ...this.state.region,
            latitude: coords.latitude,
            longitude: coords.longitude
        });
    };

    onRegionChange = region => {
        this.setState({
            region
        })

        var location = {
            lat: region.latitude,
            lng: region.longitude,
        };

        Geocoder.geocodePosition(location).then(res => {
            var loc = (res[0].subLocality == null) ? res[0].formattedAddress : res[0].subLocality;
            //console.log(location)
            this.setState({ locationName: loc })
        })
            .catch(err => console.warn(err))
        setTimeout(() => { this.setState({ pulse: 1 }) }, 1000)
    }

    toggle = async () => {
        const androidGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "App Geolocation Permission",
                message: "App needs access to your phone's location.",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );

        if (androidGranted === PermissionsAndroid.RESULTS.GRANTED) {
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
                error => viewUtils.showToast(error.message),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        } else {
            viewUtils.showToast('Location permission not granted!!!!');
        }
    }

    currentLocation() {
        //alert()
        Geolocation.getCurrentPosition(
            async position => {

                this.map && this.map.animateToRegion(
                    {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    },
                    1000
                );

                /* this.setState({
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
                }) */
                // console.log('latitude', position.coords.latitude);
                // console.log('longitude', position.coords.longitude);
                // console.log(this.state.marker)

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

                var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                Geocoder.geocodePosition(location).then(res => {
                    console.log(res[0].formattedAddress)
                    this.setState({ locationName: res[0].subLocality })
                })
                //.catch(err => console.warn(err))

            },
            (error) => viewUtils.showToast(error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    render() {
        const { region, pulse, locationName, status } = this.state;
        let React_Native_Rating_Bar = [];
        for (var i = 1; i <= this.state.Max_Rating; i++) {
            React_Native_Rating_Bar.push(
                <TouchableOpacity
                    activeOpacity={1}
                    key={i}
                    onPress={this.UpdateRating.bind(this, i)}>
                    <Image
                        style={styles.starImage}
                        source={
                            i <= this.state.Default_Rating
                                ? { uri: this.Star }
                                : { uri: this.Star_With_Border }
                        }
                    />
                </TouchableOpacity>
            );
        }

        // let React_Native_Rating_Bar_form = [];
        // for (var i = 1; i <= this.state.Max_Rating; i++) {
        //     React_Native_Rating_Bar_form.push(
        //         <Image
        //             style={styles.starImageForm}
        //             source={
        //                 i <= this.state.Default_Rating_form
        //                     ? { uri: this.Star }
        //                     : { uri: this.Star_With_Border }
        //             }
        //         />
        //     );
        // }

        return (
            <View style={styles.container}>
                {/* <ScrollView> */}
                <GeneralStatusBar backgroundColor={this.state.isModalVisible ? Color.transparent : Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    //status={this.state.status}
                    // switchOn={false}
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onPress={() => this.toggle()}
                />

                <View style={styles.statusContainer}>
                    <Text style={styles.statusHeading}> You are offline!</Text>
                    <Text style={styles.statusDetail}> Go online to start accepting jobs. </Text>
                </View>

                <View style={styles.pickMapContainer}>
                    <MapView
                        ref={(ref) => { this.map = ref }}
                        style={styles.pickMap}
                        region={region}
                        //onRegionChangeComplete={this.onRegionChange}
                        provider={PROVIDER_GOOGLE}
                        customMapStyle={RetroMapStyles}
                        //ref={c => this.mapView = c}
                        minZoomLevel={8}
                        showsIndoorLevelPicker={true}
                        //onRegionChange={() => this.setState({ pulse: 0 })}
                        zoomEnabled={true}
                        followsUserLocation={true}
                        mapPadding={
                            {
                                bottom: (height / 4),
                                // top: (height / 20)
                            } 
                        } 
                    //showsUserLocation={true}
                    //key={this.state.forceRefresh}
                    //gestureHandling="greedy"
                    >
                        {/* <MapView.Circle
                                center={this.state.marker}
                                radius={400}
                                fillColor={'rgba(45, 48, 130, 0.4)'}
                                strokeWidth={0}
                            />
                            <Marker
                                coordinate={this.state.marker}
                                anchor={{ x: 0.5, y: 0.5 }}
                                image={marker}
                            > */}
                        <MapView.Circle
                            center={this.state.marker}
                            radius={80}
                            fillColor={'rgba(45, 48, 130, 0.4)'}
                            strokeWidth={0}
                        />

                        <Marker
                            coordinate={this.state.marker}
                            anchor={{ x: 0.5, y: 0.5 }}
                            // image={marker}
                            calloutOffset={{ x: -8, y: 28 }}
                            calloutAnchor={{ x: 0.5, y: 0.01 }}
                            ref={ref => { this.marker = ref; }}
                            key={marker.key}
                        >
                            <Image source={require('../../../assets/img/map_point.png')} style={{ width: width * 0.09, height: width * 0.09 }} />

                            <Callout
                                tooltip
                                style={styles.customView}
                            >
                                <CustomCallout>
                                    <Text style={styles.toolAddress}>{this.state.locationName}</Text>
                                </CustomCallout>
                            </Callout>
                        </Marker>
                    </MapView>
                </View>

                <View style={[styles.mapIcon]}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.currentLocation()}>
                        <Image source={require('../../../assets/img/location.png')}
                            style={{ width: width * 0.15, height: width * 0.15 }} />
                    </TouchableHighlight>
                </View>

                <View style={styles.allDetailViewDiv}>
                    <View style={styles.driverDetailDiv}>
                        <Image source={require('../../../assets/img/user.png')} style={styles.userImage} />
                        <View style={styles.driverNameDiv}>
                            <Text style={styles.name}>{this.state.name} </Text>
                            <View style={[styles.childView, { marginTop: height * 0.001 }]}>{React_Native_Rating_Bar}</View>
                        </View>
                        <View style={styles.moneyDiv}>
                            <Text style={styles.money}> ₹ {this.state.total_earned} </Text>
                            <Text style={styles.earned}> Total Earned </Text>
                        </View>
                    </View>
                    <View style={styles.ridesDiv}>
                        <View style={styles.detailViewDiv}>
                            <Image source={require('../../../assets/img/active_hour.png')} style={styles.icon} />
                            <View style={styles.iconDetailDiv}>
                                <Text style={styles.count}>{this.state.total_houre}</Text>
                                <Text style={styles.detail}> HOURS ONLINE</Text>
                            </View>
                        </View>
                        <View style={styles.detailViewDiv}>
                            <Image source={require('../../../assets/img/active_distance.png')} style={styles.icon} />
                            <View style={styles.iconDetailDiv}>
                                <Text style={styles.count}>{this.state.total_distance}</Text>
                                <Text style={styles.detail}> TOTAL DISTANCE</Text>
                            </View>
                        </View>
                        <View style={styles.detailViewDiv}>
                            <Image source={require('../../../assets/img/active_trip.png')} style={styles.icon} />
                            <View style={styles.iconDetailDiv}>
                                <Text style={styles.count}>{this.state.total_trips}</Text>
                                <Text style={styles.detail}> TOTAL TRIPS</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* </ScrollView> */}
            </View >
        );
    }
}



