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
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';

import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/header';
import styles from './styles';
import Config from '../../config/config';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";

var { width, height } = Dimensions.get('window');

export default class Orders extends Component {
    constructor() {
        super();
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
            Default_Rating: 2,
            Max_Rating: 5,
            orders: [
                {
                    "id": "#ABC123456DEF789",
                    "date": "Fri 08 Nov 2020",
                    "name": "Jigar Amin",
                    "rate": 3,
                    "reviews": "It is long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It is a long established fact tht a reader will be distracted by the"
                },
                {
                    "id": "#ABC123456DEF789",
                    "date": "Fri 08 Nov 2020",
                    "name": "Jigar Amin",
                    "rate": 3,
                    "reviews": "It is long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It is a long established fact tht a reader will be distracted by the"
                },
                {
                    "id": "#ABC123456DEF789",
                    "date": "Fri 08 Nov 2020",
                    "name": "Jigar Amin",
                    "rate": 3,
                    "reviews": "It is long established fact that a reader will be distracted by the readable content of a page when looking at its layout. It is a long established fact tht a reader will be distracted by the"
                },
            ],
            latitude: null,
            longitude: null,

            listItem: [],
        };

        this.Star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
        this.Star_With_Border = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    }

    async componentDidMount() {
        this.setState({ status: await AsyncStorage.getItem('@status') }) 
            //alert(await AsyncStorage.getItem('@userid'))
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.reviewslist;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid')
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
                            this.setState({ listItem: response.data });
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
    }

    UpdateRating(key) {
        this.setState({ Default_Rating: key });
    }

    _navigate = index => {
        this.props.navigation.navigate('DetailsTrack', {
            visible: false,
        })
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.listItem.length;
        let React_Native_Rating_Bar = [];
        for (var i = 1; i <= this.state.Max_Rating; i++) {
            React_Native_Rating_Bar.push(
                // <TouchableOpacity
                //     activeOpacity={0.7}
                //     key={i}
                //     onPress={this.UpdateRating.bind(this, i)}>
                    <Image
                        style={styles.starImage}
                        source={
                            i <= item.review_rating
                                ? { uri: this.Star }
                                : { uri: this.Star_With_Border }
                        }
                    />
                // </TouchableOpacity>
            );
        }
        return (
            <TouchableWithoutFeedback underlayColor="transparent" onPress={() => this._navigate()}>
                <View style={lengthArray - 1 == index ? [styles.orderBox, { marginBottom: width * 0.035 }] : styles.orderBox} >
                    <View style={[styles.navigation, { borderBottomWidth: 1 }]}>
                        <View style={styles.leftNavigation}>
                            <Text style={styles.id}>#{item.order_id}</Text>
                            <Text style={styles.date}>{item.review_date.split(' ')[0].trim()}</Text>
                        </View>
                        <View style={styles.rightNavigation}>
                            <View style={styles.rightNav}>
                                <Text style={styles.name}>{item.customer_name}</Text>
                                <View style={styles.childView}>{React_Native_Rating_Bar}</View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.contentNav}>
                        <Text style={styles.content}>{item.review}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    toggle = async (value) => {
        //console.log('value--->',value)
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
                                    this.setState({ isLoading: false, status: "Online" });
                                    //this.setState(prevState => ({ switchOn: prevState.switchOn })) 
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
                    <Text style={styles.title}>Reviews</Text>
                </View>

                <FlatList
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.listItem}
                    extraData={this.state}
                    numColumns={1}
                    renderItem={this.renderItem.bind(this)}
                />

            </View>
        );
    }
}

