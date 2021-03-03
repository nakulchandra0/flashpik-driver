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
} from 'react-native';
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

export default class Notification extends React.Component {

    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            options: [
                { "title": "Notification Title", "date": "Dec 25" },
                { "title": "Notification Title", "date": "Dec 25" },
                { "title": "Notification Title", "date": "Dec 25" },
                { "title": "Notification Title", "date": "Dec 25" },
                { "title": "Notification Title", "date": "Dec 25" },
                { "title": "Notification Title", "date": "Dec 25" },
                { "title": "Notification Title", "date": "Dec 25" },
            ],
            latitude: null,
            longitude: null,
        };
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.options.length;
        //alert(parseInt(lengthArray / 4 + 1))
        return (
            <TouchableHighlight underlayColor="transparent">
                {/* <View style={lengthArray - 1 == index ? [styles.navbar, { borderBottomWidth: 1, marginBottom: width * 0.1 }] : styles.navbar}> */}
                <View style={ lengthArray - 1 == index ? [styles.navbar, { borderTopWidth: 1, borderTopColor: Color.dark_blue, borderBottomWidth: 1.3, borderBottomColor: Color.dark_blue, }] : [styles.navbar, { borderTopWidth: 1,
                    borderTopColor:
                        index -1 <= parseInt(lengthArray / 4 + 1)
                            ? Color.grey_7 : [(index - 1) > parseInt(lengthArray / 4 + 1) && (index - 1) <= parseInt(lengthArray)]
                                ? Color.dark_blue : Color.grey_7, 
                }]}>
                    <View style={styles.leftContainer}>
                        <Image source={require('../../../assets/img/notificationIcon.png')} style={styles.icon} />
                    </View>
                    <View style={styles.centerContainer}>
                        <Text style={styles.notTitle}>{item.title}</Text>
                        <Text style={[styles.notTitle, styles.date]}>{item.date}</Text>
                    </View>
                    <View style={styles.rightContainer}></View>
                </View>
            </TouchableHighlight>
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
        const { region, pulse, locationName } = this.state
        return (
            <View style={[styles.container, styles.dltContainer]}>
                <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    // status={"Online"}
                    //switchOn={this.props.switchOn}
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onPress={() => this.toggle()}
                />

                <View style={styles.mainContainer}>
                    <Text style={styles.title}>Notification</Text>
                </View>

                <ScrollView>
                    {/* <View style={styles.optionContainer}> */}
                    <FlatList
                        refreshing={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.options}
                        extraData={this.state}
                        numColumns={1}
                        renderItem={this.renderItem.bind(this)}
                        showsVerticalScrollIndicator={false}
                    />
                    {/* </View> */}
                </ScrollView>
            </View>
        );
    }
}
