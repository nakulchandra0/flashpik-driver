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
    TouchableWithoutFeedback,
    useFocusEffect
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/goBack';
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';

var { width, height } = Dimensions.get('window');

export default class Orders extends Component {
    constructor() {
        super();
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            Default_Rating: 2,
            Max_Rating: 5,
            // orders: [
            //     {
            //         "name": "Activa",
            //         "number": "GJ-01-NC-2020",
            //         "state": 3,
            //         "icon": require('../../../assets/img/activa.png'),
            //         "selected": true
            //     },
            //     {
            //         "name": "Tata Ace",
            //         "number": "GJ-27-NC-2020",
            //         "rate": 3,
            //         "icon": require('../../../assets/img/truck.png'),
            //         "selected": false
            //     },
            // ],
            isLoading: false,
            vehicleList: [],
            driverId: null,

            selectedIndex: null,
            vehicle_type: null,
            vehicle_brand: null,
            vehicle_model: null,
            vehicle_year: null,
            vehicle_number: null,
            vehicle_color: null,
            vehicle_rcbook: null,

            latitude: null,
            longitude: null,
        };

        this.Star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
        this.Star_With_Border = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    }

    componentDidMount = async () => {
        //alert('hi')
        this.setState({ isLoading: true }, async() => {
            var url = Config.baseUrl + Config.myvehiclelist;
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
                    this.setState({ isLoading: false });
                    if (response.status == "true") {
                        response.data.length > 0 
                            ? this.setState({ vehicleList: response.data })
                            : this.setState({ vehicleList: [] }); 
                    } else {
                        response.data.length > 0 
                            ? this.setState({ vehicleList: response.data })
                            : this.setState({ vehicleList: [] });  
                                //console.log('response--->',response.message)
                        }
                    }
                        
            });
        })

        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async() => {
            this.vehicleList()
        })

    }
  
    vehicleList = async() =>{
        //alert()
        var url = Config.baseUrl + Config.myvehiclelist;
        var reqJson = {
            driverid: await AsyncStorage.getItem('@userid'),
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
                    response.data.length > 0 
                        ? this.setState({ vehicleList: response.data })
                        : this.setState({ vehicleList: [] }); 
                } else {
                    response.data.length > 0 
                        ? this.setState({ vehicleList: response.data })
                        : this.setState({ vehicleList: [] });  
                    }
                }
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    UpdateRating(key) {
        this.setState({ Default_Rating: key });
    }

    _navigateToAdd = index => {
        this.setState({ vehicleList: []})
        this.props.navigation.navigate('AddVehicle', {
            visible: false,
        })
    }

    _selectOption = async(id, vehicle_type, vehicle_brand, vehicle_model, vehicle_year, vehicle_number, vehicle_color, vehicle_rcbook) => {
        //this.setState({ isLoading: true }, async() => {
        this.setState({selectedIndex: id})

        var url = Config.baseUrl + Config.defaultvehicle;
            var reqJson = {
                driverid : await AsyncStorage.getItem('@userid'),
                vehicleid: id
            };
            apiService.executeFormApi(
                url,
                "POST",
                JSON.stringify(reqJson),
                async (error, response) => {
                
                    //this.setState({selectedIndex: id, isLoading: true})
                
                    if (error !== "") {
                        this.setState({ isLoading: false });
                        viewUtils.showToast(error);
                    }
                    if (response !== null && response !== "") {
                        if (response.status == "true") {
                            //console.log('data===>',response.data)
                            viewUtils.showToast(response.message.trim());
                            this.setState({ isLoading: false });
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
            });
        //})
        
        // var data = this.state.orders;
        // data.map(function (value, i) {
        //     data[i].selected = false;
        // })
        // data[index].selected = true;


        this.setState({
            enable: true,
            selectedIndex: id,
            vehicle_type: vehicle_type,
            vehicle_brand: vehicle_brand,
            vehicle_model: vehicle_model,
            vehicle_year: vehicle_year,
            vehicle_number: vehicle_number,
            vehicle_color: vehicle_color,
            vehicle_rcbook: vehicle_rcbook,
        });
    }

    editOption = (id, vehicle_type, vehicle_brand, vehicle_model, vehicle_year, vehicle_number, vehicle_color, vehicle_rcbook) => {
        this.setState({ vehicleList: []})
        this.props.navigation.navigate('EditVehicle', {
            visible: false,
            vehicle_id: id,
            vehicle_type: vehicle_type,
            vehicle_brand: vehicle_brand,
            vehicle_model: vehicle_model,
            vehicle_year: vehicle_year,
            vehicle_number: vehicle_number,
            vehicle_color: vehicle_color,
            vehicle_rcbook: vehicle_rcbook,
        })
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.vehicleList.length;
        //console.log('Array====>',lengthArray) 
        return (
                <TouchableWithoutFeedback underlayColor="transparent"
                    onPress={() => this.editOption(item.id, item.vehicle_type, item.vehicle_brand, item.vehicle_model, item.vehicle_year, item.vehicle_number, item.vehicle_color, item.vehicle_rcbook)}
                >
                    <View style={lengthArray - 1 == index ? [styles.orderBox, { marginBottom: width * 0.035 }] : styles.orderBox} >
                        <View style={styles.leftNavigation}>
                            <Image source={{ uri: item.vehicle_type_icon }} style={styles.menuIcon} />
                        </View>
                        <View style={styles.centerNavigation}>
                            <Text style={styles.name}>{item.vehicle_type}</Text>
                            <Text style={styles.number}>{item.vehicle_number}</Text>
                        </View>
                        <View style={styles.rightNavigation}>
                            <TouchableHighlight underlayColor="transparent"
                                onPress={() => this._selectOption(item.id, item.vehicle_type, item.vehicle_brand, item.vehicle_model, item.vehicle_year, item.vehicle_number, item.vehicle_color, item.vehicle_rcbook)}>
                                <View style={[styles.radioBorder]}>
                                    {this.state.selectedIndex == null 
                                        ? item.is_default == 'yes'  && 
                                        <View style={styles.innerRadio}>
                                            <Icon name='check' style={styles.checkIcon} />
                                        </View>
                                        : item.id == this.state.selectedIndex && 
                                        <View style={styles.innerRadio}>
                                            <Icon name='check' style={styles.checkIcon} />
                                        </View>
                                    }
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View> 
                </TouchableWithoutFeedback>
        ) 
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {
                    await AsyncStorage.getItem('@status') == "Offline" || await AsyncStorage.getItem('@status') == null ? await AsyncStorage.setItem('@status', "Online") : await AsyncStorage.setItem('@status', "Offline")

                    // console.log('latitude', position.coords.latitude);
                    // console.log('longitude', position.coords.longitude);
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
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
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 }
        );
    }

    render() {
        return (
            <View style={styles.container}>
                    <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                    <Spinner visible={this.state.isLoading} textContent={''} />

                    <Header
                        // status={"Online"}
                        // switchOn={true}
                        goBack={() => this.props.navigation.navigate('Setting')}
                        onPress={() => this.toggle()}
                    />

                    <View style={styles.mainContainer}>
                        <Text style={styles.title}>Vehicle Management</Text>
                        
                        <ScrollView>
                            <View style={styles.vehicleContainer}>
                                <FlatList
                                    refreshing={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    data={this.state.vehicleList}
                                    extraData={this.state}
                                    numColumns={1}
                                    renderItem={this.renderItem.bind(this)}
                                />
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.footerNav}>
                        <TouchableWithoutFeedback underlayColor="transparent" onPress={() => this._navigateToAdd()}>
                            <Image source={require('../../../assets/img/add_icon.png')} style={styles.addIcon} />
                        </TouchableWithoutFeedback>
                    </View>
            </View>
        );
    }
}

