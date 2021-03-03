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
    TextInput,
} from 'react-native';

import moment from 'moment';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/goBack';
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Input, CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import DatePicker from 'react-native-datepicker';

var { width, height } = Dimensions.get('window');

export default class Orders extends Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            isLoading: false,

            document_type: null,
            document_image: [],
            card_number: null,
            expiration_date: null,

            bank_name: null,
            account_number: null,
            bank_ifsc: null,
            //currentDate: null,
            latitude: null,
            longitude: null,
        }
    }

    componentDidMount = async () => {
        //alert(this.props.navigation.state.params.selectedDocument)
        this.setState({
            //currentDate: new Date(),
            selectedDocument: this.props.navigation.state.params.selectedDocument,
            document_image: { uri: this.props.navigation.state.params.document_file, type: 'image/jpg', name: 'image.jpg' },
            card_number: this.props.navigation.state.params.card_number == "000000" ? null : this.props.navigation.state.params.card_number,
            expiration_date: this.props.navigation.state.params.expiration_date == "000000" ? null : this.props.navigation.state.params.expiration_date,
        })
    }

    addImage = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            cropping: true,
            includeExif: true
        }).then(image => {
            console.log('image', image);
            this.setState({
                document_image: {
                    uri: image.path,
                    type: image.mime,
                    name: Platform.OS === 'ios' ? image.filename : 'image.jpg'
                }
            });
        }).catch(e => alert('User cancelled image selection'));
    }

    _addDocument = () => {
        //this.props.navigation.navigate('DocumentManagement')
        const { card_number, expiration_date, document_image } = this.state;

        if (document_image.uri == "http://cipherbrainstest.com/flashpik/assets/images/doc/license.png") {
            viewUtils.showToast('Set identification card image')
        }
        else {
            !card_number ? this.setState({ card_numberError: "Card number required" }) : "";
            !expiration_date ? this.setState({ expiration_dateError: "Expiration date required" }) : "";

            if (card_number && expiration_date && document_image.uri) {
                this.setState({ isLoading: true }, async () => {
                    var url = Config.baseUrl + Config.adddocument;

                    var reqJson = {
                        driverid: await AsyncStorage.getItem('@userid'),
                        doc_type: this.state.selectedDocument,
                        card_number: this.state.card_number,
                        expiration_date: this.state.expiration_date,
                        bank_name: this.state.bank_name,
                        account_number: this.state.account_number,
                        bank_ifsc: this.state.bank_ifsc
                    };

                    console.log(reqJson)
                    var formData = new FormData();
                    if (this.state.document_image.uri != null) {
                        formData.append('document_file', this.state.document_image);
                    } else {
                        formData.append('document_file', []);
                    }

                    formData.append('jsonstring', JSON.stringify(reqJson));

                    apiService.executeFormApi(
                        url,
                        "POST",
                        formData,
                        async (error, response) => {

                            if (error !== "") {
                                //alert()
                                this.setState({ isLoading: false });
                                viewUtils.showToast(error);
                            }

                            if (response !== null && response !== "") {
                                this.setState({ isLoading: false });
                                if (response.status == "true") {
                                    try {
                                        console.log('response', response)
                                        viewUtils.showToast(response.message.trim());
                                        this.props.navigation.navigate('DocumentManagement')
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
        }
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
        //alert('2')
    }

    render() {
        return (
            <View style={styles.container} >
                <ScrollView>
                    <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                    <Spinner visible={this.state.isLoading} textContent={''} />

                    <Header
                        // status={"Online"}
                        // switchOn={true}
                        goBack={() => this.props.navigation.navigate('DocumentManagement')}
                        onPress={() => this.toggle()}
                    />
                    <View style={styles.mainContainer}>
                        <Text style={styles.title}>Upload Driving Licence</Text>
                    </View>

                    <View style={styles.orderBox} >
                        <TouchableHighlight underlayColor="transparent" onPress={() => this.addImage()}>
                            {this.state.document_image.uri == null ?
                                <Image source={require('../../../assets/img/d_licence.png')} style={styles.img} />
                                : <Image source={this.state.document_image} style={styles.img} />}
                        </TouchableHighlight>

                        <Text style={styles.name}>Upload Image</Text>
                    </View>

                    <KeyboardAwareScrollView>

                        <View style={styles.mainContainer}>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Card Number</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize="words"
                                    placeholder="GJ1220190000001"
                                    keyboardType="default"
                                    value={this.state.card_number}
                                    onChangeText={(value) => this.setState({ card_number: value })}
                                    ref={input => { this.card_number = input }}
                                    onFocus={() => this.setState({ card_numberError: null })}
                                />
                                {this.state.card_numberError &&
                                    <Text style={styles.error}>{this.state.card_numberError}</Text>
                                }
                            </View>

                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Expiration Date</Text>
                                <DatePicker
                                    style={styles.textBox}
                                    date={this.state.expiration_date} //initial date from state
                                    mode="date" //The enum of date, datetime and time
                                    placeholder="DD/MM/YYYY"
                                    format="DD-MM-YYYY"
                                    minDate="01-01-1950"
                                    maxDate="31-12-2080"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        // dateIcon: {
                                        //     position: 'absolute',
                                        //     left: 0,
                                        //     top: 4,
                                        //     marginLeft: 0
                                        // },
                                        dateInput: {
                                            //width: width,
                                            // fontFamily: Font.regular, 
                                            // fontSize: width * 0.25,
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ expiration_date: date, expiration_dateError: null }) }}
                                />
                                {this.state.expiration_dateError &&
                                    <Text style={styles.error}>{this.state.expiration_dateError}</Text>
                                }
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button
                                    title="Add Driving Licence"
                                    titleStyle={styles.buttonTitle}
                                    buttonStyle={styles.button}
                                    onPress={() => this._addDocument()}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                </ScrollView>
            </View>
        );
    }
}

