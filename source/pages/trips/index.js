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
    Keyboard
} from 'react-native';

import PropsTypes from 'prop-types';
import moment from 'moment';
import { Button, Input, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import CalendarStrip from 'react-native-calendar-strip';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
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
import { getDate } from 'date-fns';

var { width, height } = Dimensions.get('window');

// let datesWhitelist = [
//     {
//         start: moment(),
//         end: moment(), // total 4 days enabled
//     },
// ];
// let datesBlacklist = [moment().add(1, 'days')]; // 1 

let customDatesStyles = [];
let startDate = moment();
let endDate = moment();
for (var i = 0; i < 10; i++) {
    customDatesStyles.push({
        startDate: startDate, // Single date since no endDate provided
        dateNameStyle: styles.dateNameStyle,
        dateNumberStyle: styles.dateNumberStyle,
        dateContainerStyle: { backgroundColor: Color.light_blue, borderRadius: 5, marginHorizontal: 1, },
    });
}

export default class Trips extends React.Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            banner: [
                {
                    "id": "1",
                    "img": require('../../../assets/img/user.png'),
                    "name": "Love Chauhan",
                    "paymentMethod": "Google Pay",
                    "rate": "₹ 200.00",
                    "distance": "5.5Km",
                    "pick": "46, Angle Arcade, Opp Kalupur Co-Operative Bank, Sold Rd, Ahmedabad, Gujrat 380061",
                    "drop": "46, ABC Tower, Gurukul road, Ghatlodia, Ahmedabad, Gujrat 380061"
                },
                {
                    "id": "2",
                    "img": require('../../../assets/img/user.png'),
                    "name": "Nakul Chandra",
                    "paymentMethod": "Paytm",
                    "rate": "₹ 300.00",
                    "distance": "7.5Km",
                    "pick": "46, Angle Arcade, Opp Kalupur Co-Operative Bank, Sold Rd, Ahmedabad, Gujrat 380061",
                    "drop": "46, ABC Tower, Gurukul road, Ghatlodia, Ahmedabad, Gujrat 380061"
                },
                {
                    "id": "3",
                    "img": require('../../../assets/img/user.png'),
                    "name": "Jigar Amin",
                    "paymentMethod": "Cash",
                    "rate": "₹ 300.00",
                    "distance": "7.5Km",
                    "pick": "46, Angle Arcade, Opp Kalupur Co-Operative Bank, Sold Rd, Ahmedabad, Gujrat 380061",
                    "drop": "46, ABC Tower, Gurukul road, Ghatlodia, Ahmedabad, Gujrat 380061"
                },
            ],
            start: (moment()),
            end: (moment()),

            latitude: null,
            longitude: null,

            listData: [],
            trips: [],

            totalTrips: null,
            totalEarned: null,
            selectedDate: null,
        }
    }

    componentDidMount = async () => {
        //alert(this.state.selectedDate)
        var year = new Date().getFullYear()
        var month = ((new Date().getMonth() + 1) < 10 ? '0' : '') + (new Date().getMonth() + 1)
        var date = (new Date().getDate() < 10 ? '0' : '') + new Date().getDate()

        this.setState({ selectedDate: year + '-' + month + '-' + date })
        //console.log(year+'-'+ month+'-'+ date)

        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.tripshistory;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
                date: this.state.selectedDate
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
                        this.setState({ isLoading: false });
                        if (response.status == "true") {
                            this.setState({
                                listData: response.data,
                                totalTrips: response.total_trip,
                                totalEarned: response.total_earned,
                                //date: response.order_place_date
                            });
                        } else {
                            this.setState({
                                listData: [],
                                totalTrips: "0",
                                totalEarned: "0",
                                //date: response.order_place_date
                            });
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
    }

    componentWillUpdate() {
        // this.state.listData.order_place_date.split(' ')[0].trim()
    }

    onDateSelected = date => {
        //alert(date.format('YYYY-MM-DD'))
        this.setState({ selectedDate: date.format('YYYY-MM-DD') });

        //alert(this.state.selectedDate)
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.tripshistory;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
                date: this.state.selectedDate
            };

            //console.log('reqJson ===> ', reqJson)
            apiService.executeFormApi(
                url,
                "POST",
                JSON.stringify(reqJson),
                async (error, response) => {
                    console.log(response);

                    if (error !== "") {
                        this.setState({ isLoading: false });
                        viewUtils.showToast(error);
                    }

                    if (response !== null && response !== "") {
                        this.setState({ isLoading: false });
                        if (response.status == "true") {
                            this.setState({
                                listData: response.data,
                                totalTrips: response.total_trip,
                                totalEarned: response.total_earned,
                                //date: response.order_place_date
                            });
                        } else {
                            this.setState({
                                listData: [],
                                totalTrips: "0",
                                totalEarned: "0",
                                //date: response.order_place_date
                            });

                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })

    }

    renderItem({ item, index }) {
        const lengthArray = this.state.banner.length;
        const shadowOpt = {
            width: width * 0.85,
            height: width * 0.41,
            color: Color.black,
            border: 7,
            radius: 20,
            opacity: 0.4,
            x: 0,
            y: 0,
            style: {
                marginTop: 1,
                marginBottom: width * 0.01,
                marginHorizontal: width * 0.01,
            }
        }
        const date = item.order_place_date.split(' ')[0].trim();
        // this.state.selectedDate === date && this.state.trips.push(item[index]);
        //console.log('Date===>',this.state.trips);
        return (
            <View>
                {/* {this.state.selectedDate === date &&  */}
                <View style={lengthArray - 1 == index ? [styles.orderBox, { marginBottom: width * 0.035 }] : styles.orderBox} >
                    <View style={styles.jobContainer}>
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
                                <Text style={styles.distance}>{item.total_distance_km}</Text>
                            </View>
                        </View>
                        <View style={styles.detailDiv}>
                            <View style={[styles.locationNav, { marginTop: 5 }]}>
                                <View style={styles.timeline}>
                                    <View style={styles.line}>
                                        <View style={[styles.topLine, styles.hiddenLine]} />
                                        <View style={styles.bottomLine} />
                                    </View>
                                    <View style={[styles.dot, { backgroundColor: Color.light_green }]} />
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
                    </View>
                </View>
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
                    //switchOn={this.props.switchOn}
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onPress={() => this.toggle()}
                />

                <View style={styles.statusContainer}>
                    <Text style={styles.statusHeading}>Trips History</Text>
                </View>

                <CalendarStrip
                    scrollable
                    calendarAnimation={{ type: 'parallel', duration: 20 }}
                    daySelectionAnimation={{
                        type: 'border',
                        //duration: 200,
                        //borderHighlightColor: Color.black,
                        //borderRadius: 18,
                        borderWidth: 1,
                        backgroundColor: Color.white,
                        fontSize: width * 0.03,
                    }}
                    style={{ height: width * 0.17 }}
                    calendarHeaderStyle={{ color: Color.black }}
                    // calendarColor={'#3343CE'}
                    dateNumberStyle={{ color: Color.black, fontSize: width * 0.03 }}
                    dateNameStyle={{ color: Color.black, fontSize: width * 0.025, }}
                    iconContainer={{ flex: 0.1 }}
                    highlightDateNumberStyle={{
                        color: Color.black,
                        fontSize: width * 0.04,
                    }} 
                    highlightDateNameStyle={{
                        color: Color.black,
                        fontSize: width * 0.025,
                    }}
                    onDateSelected={this.onDateSelected}
                    // useIsoWeekday={false}
                    selectedDate={new Date}
                    // startingDate={moment()}

                />

                <ScrollView>
                    <View style={styles.detailContainer}>
                        <View style={styles.detail}>
                            <Image source={require('../../../assets/img/scooter_active.png')} style={styles.iconImg1} />
                            <View style={[styles.totalContainer, { paddingLeft: width * 0.03 }]}>
                                <Text style={styles.totalHeader}>Total Trips</Text>
                                <Text style={styles.total}>{this.state.totalTrips} </Text>
                            </View>
                        </View>
                        <View style={styles.detail}>
                            <Image source={require('../../../assets/img/earned.png')} style={styles.iconImg2} />
                            <View style={[styles.totalContainer, { paddingLeft: width * 0.03 }]}>
                                <Text style={styles.totalHeader}>Earned</Text>
                                {this.state.totalEarned == "0" ?
                                    <Text style={styles.total}>₹ 0 </Text>
                                    : <Text style={styles.total}>₹ {this.state.totalEarned} </Text>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={styles.tripsDiv}>
                        <FlatList
                            refreshing={true}
                            keyExtractor={(item, index) => index.toString()}
                            data={this.state.listData}
                            extraData={this.state}
                            numColumns={1}
                            renderItem={this.renderItem.bind(this)}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}
