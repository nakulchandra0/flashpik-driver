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
    FlatList
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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';

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
export default class Pickup extends React.PureComponent {
    _isMounted = false;

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

            marker: {
                latitude: LATITUDE,
                longitude: LONGITUDE
            },

            isModalVisibleInfo: false,
            parcelImage: [{
                name: "image.jpg",
                type: "image/jpeg",
                uri: require("../../../assets/img/upload_icon.png")
            }],
            image: [],

            pickupImage: [],

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
            time: null
        }
        this.addImage = this.addImage.bind(this)
        //this.uploadFiles = this.uploadFiles.bind(this)    
    }

    componentDidMount = () => {
        this._isMounted = true;
        //alert(JSON.stringify(this.state.pickupImage))
        console.log("pickupimage", this.props.navigation.state.params);

        if (this._isMounted) {

            this.setState({
                image: this.state.parcelImage,

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
                pickup_contact_number: this.props.navigation.state.params.pickup_contact_number,
                drop_contact_number: this.props.navigation.state.params.drop_contact_number
            })
        }
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

    addImage = async () => {

        try {

            ImagePicker.openCamera({
                //multiple: true,
                //cropping: true,
                //includeExif: true
            }).then(image => {
                console.log('image', image);
                this.setState({ isLoading: true });
                const parcel = {
                    uri: image.path,
                    type: image.mime,
                    name: Platform.OS === 'ios' ? image.filename : 'image.jpg'
                }
                this.state.parcelImage.push(parcel)
                this.setState({ image: this.state.parcelImage, isLoading: false })

                this.state.pickupImage.push(parcel)
                //console.log('state', this.state.pickupImage)
            }).catch(e => alert('User cancelled image selection.'));
        } catch (error) {
            console.log('error --> ', error)
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    renderItem({ item, index }) {
        // console.log('item',item);
        const lengthArray = this.state.image.length;
        // alert(JSON.stringify(this.state.image))
        // alert(index)
        return (
            // <View style={{ alignItems: 'center', paddingTop: width * 0.05 }}>
            //     <View style={[styles.imgContainer, { width: width * 0.4 }]}>
            //         <Image source={{ uri: item.uri }} style={styles.image} />
            //     </View>
            // </View>
            <View style={[styles.imgContainer, index == 0 ? { borderStyle: "dashed" } : { borderStyle: 'solid', borderColor: Color.grey_5 }]}>
                {index == 0 ?
                    <TouchableHighlight underlayColor="transparent" onPress={() => this.addImage()}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={item.uri} style={styles.img} />
                            <Text style={styles.txt}> Take Image and Upload </Text>
                        </View>
                    </TouchableHighlight>
                    :
                    <Image source={{ uri: item.uri }} style={styles.image} />}
            </View>
        );
    }

    _navigate() {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.pickupimages;

            var reqJson = {
                orderid: this.state.orderid,
            };

            var formData = new FormData();
            if (this.state.pickupImage.length == 0) {
                // formData.append('pickup_images', []);
            } else {
                //console.log(this.state.pickupImage)
                for (var i = 0; i < this.state.pickupImage.length; i++) {
                    formData.append('pickup_images[]', this.state.pickupImage[i]);
                }
                //console.log(formData)
            }
            formData.append('jsonstring', JSON.stringify(reqJson));
            console.log('formdata', formData)

            apiService.executeFormApi(
                url,
                "POST",
                formData,
                async (error, response) => {

                    if (error !== "") {
                        this.setState({ isLoading: false });
                        viewUtils.showToast(error);
                    }

                    if (response !== null && response !== "") {
                        this.setState({ isLoading: false });
                        if (response.status == "true") {
                            try {
                                //console.log('response', response)
                                viewUtils.showToast(response.message.trim());
                                this.props.navigation.navigate('DropOff', {
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
                                    time: this.state.time,
                                    pickup_contact_number: this.state.pickup_contact_number,
                                    drop_contact_number: this.state.drop_contact_number
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
    }

    render() {
        const { region, pulse, locationName } = this.state
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    // status={"Online"}
                    // switchOn={true}
                    goBack={() => this.props.navigation.navigate('Pickup')}
                    onPress={() => this.toggle()}
                />
                <View style={styles.mainContainer}>
                    <Text style={styles.title}> Pick up Images </Text>
                </View>
                <View style={styles.imgcontainerView}>
                    {/* <View style={{ flexDirection: 'row' }}>
                            <View style={styles.imgContainer}>
                                <TouchableWithoutFeedback underlayColor="transparent" onPress={() => this.addImage()}>
                                    <Image source={require("../../../assets/img/upload_icon.png")} style={styles.img} />
                                </TouchableWithoutFeedback>
                                <Text style={styles.txt}> Take Image and Upload </Text>
                            </View>
                        </View> */}

                    <FlatList
                        refreshing={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.image}
                        extraData={this.state}
                        numColumns={2}
                        renderItem={this.renderItem.bind(this)}
                        scrollEnabled={true}
                        style={{ paddingBottom: width * 0.05 }}
                        showsVerticalScrollIndicator={false}
                    //onRefresh={this.onRefresh}
                    //refreshing={this.state.isLoading}
                    //showsHorizontalScrollIndicator={false}
                    />
                </View>
                <Button
                    title="Parcel Pick Up"
                    titleStyle={styles.buttonTitle}
                    buttonStyle={styles.button}
                    onPress={() => this._navigate()}
                />
            </View>
        );
    }
}