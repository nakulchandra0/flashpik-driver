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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';

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
            listItem: [],
            isLoading: false,

            latitude: null,
            longitude: null,
        };
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true }, async() => {
            var url = Config.baseUrl + Config.mydocumentlist;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid')
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
                        this.setState({ listItem: response.data });
                    } else {
                        viewUtils.showToast(response.message.trim());
                    }
                }
            });
        })

        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", async() => {
            this.documentList()
        });

    }

    documentList = async() => {
        var url = Config.baseUrl + Config.mydocumentlist;
        var reqJson = {
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
                    this.setState({ listItem: response.data });
                } else {
                    viewUtils.showToast(response.message.trim());
                }
            }
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
    }

    _navigate = (document_type, document_file, card_number, expiration_date, bank_name, account_number, bank_ifsc) => {
        if (document_type == "driving_licence") {
            this.setState({ listItem: [] });
            this.props.navigation.navigate('UploadLicence', {
                visible: false,
                selectedDocument: "driving_licence",
                document_file: document_file,
                card_number: card_number,
                expiration_date: expiration_date
            })
        }
        else if (document_type == "identification_card") {
            this.setState({ listItem: [] });
            this.props.navigation.navigate('UploadAdharCard', {
                visible: false,
                selectedDocument: "identification_card",
                document_file: document_file,
                card_number: card_number,
            })
        }
        else {
            this.setState({ listItem: [] });
            this.props.navigation.navigate('UploadBankDetail', {
                visible: false,
                selectedDocument: "bank_details",
                document_file: document_file,
                bank_name: bank_name,
                account_number: account_number,
                bank_ifsc: bank_ifsc,
            })

        }
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.listItem.length;
        return (
            <TouchableWithoutFeedback underlayColor="transparent" onPress={() => this._navigate(item.document_type, item.document_file, item.card_number, item.expiration_date, item.bank_name, item.account_number, item.bank_ifsc)}>
                <View style={lengthArray - 1 == index ? [styles.orderBox, { marginBottom: width * 0.03 }] : styles.orderBox} >
                    <Image source={{ uri: item.document_file }} style={styles.img} />
                    <Text style={styles.name}>{item.document_type == 'driving_licence' ? 'Driving Licence' : item.document_type == 'identification_card' ? 'Identification Card' : 'Bank Detail'}</Text>
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
                    <Text style={styles.title}>Document Management</Text>
                </View>

                <ScrollView>
                    <FlatList
                        refreshing={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.listItem}
                        extraData={this.state}
                        numColumns={1}
                        renderItem={this.renderItem.bind(this)}
                    />
                </ScrollView>
            </View>
        );
    }
}

