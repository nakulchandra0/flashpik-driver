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
    TouchableHighlightBase,
    Linking
} from 'react-native';
import MapView, {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType, PROVIDER_GOOGLE
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import { Button, Input } from 'react-native-elements';
import marker from '../../../assets/img/pin_pick.png';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Circle } from 'react-native-svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { BoxShadow } from 'react-native-shadow';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import RetroMapStyles from '../../component/RetroMapStyles.json';
import CustomCallout from '../../component/callout';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/goBack';
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';

var { width, height } = Dimensions.get('window');

/* map lat long */
const ASPECT_RATIO = width / height;
const LATITUDE = 23.026157;
const LONGITUDE = 72.597413;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyDi5VGZuYU7nnEX6WYj1DrAJygtagR3i2M';
const googleMapOpenUrl = ({ latitude, longitude }) => {
    const latLng = `${latitude},${longitude}`;
    // return `google.navigation:q=${latLng}`;
    return `geo:${latLng}?center=${latLng}&q=${latLng}&z=16`;
}
export default class Pickup extends React.PureComponent {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA

            },

            coordinates: [
                {
                    latitude: 22.996531,
                    longitude: 72.500516
                },
                {
                    latitude: 23.009651,
                    longitude: 72.507152,
                },
            ],


            marker: {
                latitude: LATITUDE,
                longitude: LONGITUDE
            },

            allCoordinates: [],

            isModalVisibleInfo: false,

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
            pic_up_latlong: null,

            dropAt: null,
            drop_latlong: null,

            total: null,
            subtotal: null,
            tax: null,
            distance: null,
            orderid: null,
            time: null,
            continuestatus: false
        }
    }

    componentDidMount() {

        console.log("dropoff", this.props.navigation.state.params);
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
            time: this.props.navigation.state.params.time,
            continuestatus: this.props.navigation.state.params.continuestatus ? this.props.navigation.state.params.continuestatus : false,
            pickup_contact_number: this.props.navigation.state.params.pickup_contact_number,
            drop_contact_number: this.props.navigation.state.params.drop_contact_number
        })

        Geolocation.getCurrentPosition(
            position => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    },
                    coordinates: [
                        {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        },
                        {
                            latitude: JSON.parse(this.props.navigation.state.params.drop_latlong.split(',')[0]),
                            longitude: JSON.parse(this.props.navigation.state.params.drop_latlong.split(',')[1]),
                        },
                    ],
                });

                /* var location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                Geocoder.geocodePosition(location).then(res => {
                    this.setState({ locationName: res[0].subLocality })
                })
                    .catch(err => console.warn(err)) */

                this.setState({
                    marker: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                })
            },
            (error) => console.log(error.message),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }


    pickLocationHandler = event => {
        const coords = event.coords;
        this.map.animateToRegion({
            ...this.state.region,
            // latitude: coords.latitude,
            // longitude: coords.longitude,
            // latitudeDelta: LATITUDE_DELTA,
            // longitudeDelta: LONGITUDE_DELTA,
        });
    };

    onRegionChange = region => {
        // this.setState({
        //     region
        // })

        // var location = {
        //     lat: region.latitude,
        //     lng: region.longitude,
        // };

        // Geocoder.geocodePosition(location).then(res => {
        //     var loc = (res[0].subLocality == null) ? res[0].formattedAddress : res[0].subLocality;
        //     this.setState({ locationName: loc })
        // })
        //     .catch(err => console.warn(err))

        // setTimeout(() => { this.setState({ pulse: 1 }) }, 1000)
    }

    _navigate = index => {
        this.setState({ isModalVisibleInfo: false });
        this.props.navigation.navigate('DropOffImage', {
            id: this.state.id,
            profile: this.state.profile,
            name: this.state.name,
            paymentMethod: this.state.paymentMethod,
            serviceName: this.state.serviceName,
            quantity: this.state.quantity,
            description: this.state.description,

            pickupAt: this.state.pickupAt,
            pic_up_latlong: this.state.pic_up_latlong,

            dropAt: this.state.dropAt,
            drop_latlong: this.state.drop_latlong,

            total: this.state.total,
            subtotal: this.state.subtotal,
            tax: this.state.tax,
            distance: this.state.distance,
            orderid: this.state.orderid,
            time: this.state.time
        })
    }

    locateActualView() {
        this.mapView.fitToCoordinates(this.state.allCoordinates, {
            edgePadding: {
                right: (width / 5),
                bottom: (height),
                left: (width / 5),
                top: (height / 15),
            }
        });
    }



    startNavigation() {
        console.log("navigation started...");
        Linking.openURL(
            googleMapOpenUrl({
                latitude: JSON.parse(this.props.navigation.state.params.drop_latlong.split(',')[0]),
                longitude: JSON.parse(this.props.navigation.state.params.drop_latlong.split(',')[1])
            })
        );
    }

    call = () => {
        let phoneNumber = '';

        if (Platform.OS === 'android') {
            // phoneNumber = 'tel:${8000983424}';
            phoneNumber = `tel:${this.props.navigation.state.params.drop_contact_number}`;
        }
        else {
            //phoneNumber = 'telprompt:${8000983424}';
            phoneNumber = `telprompt:${this.props.navigation.state.params.drop_contact_number}`;
        }
        Linking.openURL(phoneNumber);

        // RNImmediatePhoneCall.immediatePhoneCall('8000983424');
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {

                    console.log('latitude', position.coords.latitude);
                    console.log('longitude', position.coords.longitude);
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

    // toggleModalPickup() {
    //     this.setState({ isModalVisibleInfo: !this.state.isModalVisibleInfo });
    //     setTimeout(() => {
    //         this.mapView.fitToCoordinates(this.state.allCoordinates, {
    //             edgePadding: {
    //                 right: (width / 20),
    //                 bottom: this.state.isModalVisibleInfo ? (height / 0.95) : (height / 1.65),
    //                 left: (width / 20),
    //                 top: (height / 20),
    //             }
    //         });
    //     }, 100)
    // }

    render() {
        const { region, pulse, locationName } = this.state
        const shadowOpt = {
            width: width,
            height: width * 0.15,
            color: Color.black,
            border: 13,
            radius: 25,
            opacity: 0.9,
            x: 0,
            y: 0,
            style: {
                marginTop: 1,
                position: 'absolute',
                bottom: 0,
            }
        }
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                {
                    this.state.continuestatus ?
                        <Header
                            onPress={() => this.toggle()}
                        /> :
                        <Header
                            // status={"Online"}
                            // switchOn={true}

                            goBack={() => this.props.navigation.navigate('PickUpImage')}
                            onPress={() => this.toggle()}
                        />
                }

                <View style={styles.mainContainer}>
                    <Text style={styles.title}> Drop off</Text>
                </View>

                <View style={styles.mapContainer}>

                    <MapView
                        style={styles.map}
                        region={region}
                        provider={PROVIDER_GOOGLE}
                        customMapStyle={RetroMapStyles}
                        ref={c => this.mapView = c}
                        // initialRegion={region}
                        onRegionChangeComplete={this.onRegionChange}
                        // //showsUserLocation={true}
                        // customMapStyle={RetroMapStyles}
                        // minZoomLevel={0}
                        // maxZoomLevel={20}
                        showsIndoorLevelPicker={true}
                        onRegionChange={() => this.setState({ pulse: 0 })}
                        followsUserLocation={true}
                    >
                        <MapView.Circle
                            center={this.state.coordinates[0]}
                            radius={80}
                            fillColor={'rgba(45, 48, 130, 0.2)'}
                            strokeWidth={0}
                        />

                        {this.state.coordinates.map((coordinate, index) => {
                            return (
                                <Marker.Animated
                                    key={index}
                                    coordinate={coordinate}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                    calloutOffset={{ x: -8, y: 28 }}
                                    calloutAnchor={{ x: 0.5, y: 0.4 }}
                                    tracksViewChanges={false}
                                    image={index == 0 ? require('../../../assets/img/map_point.png') : require('../../../assets/img/pin_drop_2.png')}
                                    style={index == 0 ? styles.mapPointImageSize : styles.pickupImageSize}
                                >
                                    {/* <Image
                                        key={`coordinate_${index}`}
                                        source={index == 0 ? require('../../../assets/img/map_point.png') : require('../../../assets/img/pin_drop_2.png')}
                                        style={index == 0 ? styles.mapPointImageSize : styles.pickupImageSize}
                                    /> */}
                                </Marker.Animated>
                            );
                        }
                        )}

                        {(this.state.coordinates.length >= 2) && (
                            <MapViewDirections
                                origin={this.state.coordinates[0]}
                                waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
                                destination={this.state.coordinates[this.state.coordinates.length - 1]}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={8}
                                strokeColor={Color.dark_blue}
                                optimizeWaypoints={true}
                                onStart={(params) => {
                                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                }}
                                onReady={result => {
                                    console.log(`Distance: ${result.distance} km`)
                                    console.log(`Duration: ${result.duration} min.`)
                                    this.setState({ allCoordinates: result.coordinates })
                                    this.mapView.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: (width / 5),
                                            bottom: (height),
                                            left: (width / 5),
                                            top: (height / 15),
                                        }
                                    });
                                }}
                                onError={(errorMessage) => {
                                    // console.log('GOT AN ERROR');
                                }}
                            />
                        )}

                    </MapView>

                </View>

                {/* <BoxShadow setting={shadowOpt}> */}
                <View style={styles.bottomContainer}>
                    {/* <TouchableWithoutFeedback style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} nderlayColor="transparent" onPress={() => this.toggleModalPickup()}>
                        <View style={styles.imgContainer}>
                            <Image source={require('../../../assets/img/map_drop_point.png')} style={styles.img} />
                        </View>
                        <View style={styles.txtContainer}>
                            <Text style={styles.txt}>Drop off At </Text>
                            <Text style={[styles.txt, { color: Color.dark_blue }]}>{this.state.dropAt}</Text>
                        </View>
                    </TouchableWithoutFeedback> */}
                    <View style={styles.ModalDetailViewDiv}>
                        <View style={styles.imgContainer}>
                            <Image source={require('../../../assets/img/map_drop_point.png')} style={styles.img} />
                        </View>
                        <View style={styles.txtContainer}>
                            <Text style={styles.txt}>Drop off At </Text>
                            <Text style={[styles.txt, { color: Color.dark_blue }]}>{this.state.dropAt}</Text>
                        </View>
                    </View>
                    <View style={styles.detailContainer}>
                        <View style={styles.detail}>
                            <Text style={styles.time}>{this.state.time} min</Text>
                            <Text style={styles.direction}> EST </Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.time}>{this.state.distance} KM</Text>
                            <Text style={styles.direction}> DISTANCE </Text>
                        </View>
                        <View style={styles.detail}>
                            <Text style={styles.time}>₹ {this.state.total}</Text>
                            <Text style={styles.direction}> FARE </Text>
                        </View>
                    </View>
                    <Button
                        title="Take Parcel Images"
                        titleStyle={styles.buttonTitle}
                        buttonStyle={styles.button}
                        onPress={() => this._navigate()}
                    />
                </View>
                {/* </BoxShadow> */}


                <View style={[styles.mapImageContainer, { top: height * 0.15 }]}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.locateActualView()}>
                        <Image source={require('../../../assets/img/location.png')}
                            style={{ width: width * 0.15, height: width * 0.15 }} />
                    </TouchableHighlight>
                </View>

                <View style={[styles.mapImageContainer, { top: height * 0.222, paddingRight: 6 }]}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.startNavigation()}>
                        <Image source={require('../../../assets/img/map_nav.png')}
                            style={{ width: width * 0.11, height: width * 0.11 }} />
                    </TouchableHighlight>
                </View>

                <View style={[styles.mapImageContainer, { top: height * 0.282, paddingRight: 6 }]}>
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.call()}>
                        <Image source={require('../../../assets/img/ic_call_round.png')}
                            style={{ width: width * 0.11, height: width * 0.11 }} />
                    </TouchableHighlight>
                </View>

                {/* <Modal
                    isVisible={this.state.isModalVisibleInfo}
                    style={styles.footerModal}
                    onBackdropPress={() => this.toggleModalPickup()}
                >
                    <View style={styles.content}>
                        <View style={styles.ModalDetailViewDiv}>
                            <View style={styles.imgContainer}>
                                <Image source={require('../../../assets/img/map_drop_point.png')} style={styles.img} />
                            </View>
                            <View style={styles.txtContainer}>
                                <Text style={styles.txt}>Drop off At </Text>
                                <Text style={[styles.txt, { color: Color.dark_blue }]}>{this.state.dropAt}</Text>
                            </View>
                        </View>
                        <View style={styles.detailContainer}>
                            <View style={styles.detail}>
                                <Text style={styles.time}>{this.state.time} min</Text>
                                <Text style={styles.direction}> EST </Text>
                            </View>
                            <View style={styles.detail}>
                                <Text style={styles.time}>{this.state.distance} KM</Text>
                                <Text style={styles.direction}> DISTANCE </Text>
                            </View>
                            <View style={styles.detail}>
                                <Text style={styles.time}>₹ {this.state.total}</Text>
                                <Text style={styles.direction}> FARE </Text>
                            </View>
                        </View>
                        <Button
                            title="Take Parcel Images"
                            titleStyle={styles.buttonTitle}
                            buttonStyle={styles.button}
                            onPress={() => this._navigate()}
                        />
                    </View>
                </Modal> */}

            </View>
        );
    }
}



