import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    Text,
    Image,
    Dimensions,
    ScrollView,
    TouchableHighlight,
    TextInput,
} from 'react-native';
import moment from 'moment';
import { Button, Input, CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-crop-picker';

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
            isLoading: false,

            VehicleList: [],
            selectedVehicle: null,
            vehicle_type: null,

            vehicle_rc_book: [],
            driverid: null,
            vehicle_brand: null,
            vehicle_model: null,
            vehicle_year: null,
            vehicle_number_plate: null,
            vehicle_color: null,

            latitude: null,
            longitude: null,
        };
    }

    componentWillMount = async () => {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.vehicletypelist;

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
                            this.setState({ VehicleList: response.data });
                            //console.log(response.data)
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
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
                vehicle_rc_book: {
                    uri: image.path,
                    type: image.mime,
                    name: Platform.OS === 'ios' ? image.filename : 'image.jpg'
                }
            });
        }).catch(e => alert('User cancelled image selection'));
    }

    _navigate = async () => {
        //console.log('profile', this.state.vehicle_type)
        //alert(this.state.vehicle_type + '=' + this.state.selectedVehicle )
        const { vehicle_type, vehicle_brand, vehicle_model, vehicle_year, vehicle_number_plate, vehicle_color, vehicle_rc_book } = this.state;

        vehicle_type==null || vehicle_type==0 ? this.setState({ vehicle_typeError: "Select vehicle type" }) : "";
        !vehicle_brand ? this.setState({ vehicle_brandError: "Vehicle brand required" }) : "";
        !vehicle_model ? this.setState({ vehicle_modelError: "Vehicle model required" }) : "";
        !vehicle_year ? this.setState({ vehicle_yearError: "Vehicle year required" }) : "";
        !vehicle_number_plate ? this.setState({ vehicle_number_plateError: "Vehicle number plate required" }) : "";
        !vehicle_color ? this.setState({ vehicle_colorError: "Vehicle color required" }) : "";
        //vehicle_rc_book.uri == null ? alert(profile_image) : alert(profile_image);
        vehicle_rc_book.uri == null ? viewUtils.showToast('Set vehicle rc book image') : '';

        if (vehicle_type && vehicle_brand && vehicle_model && vehicle_year && vehicle_number_plate && vehicle_color && vehicle_rc_book.uri) {
            this.setState({ isLoading: true }, async () => {
                var url = Config.baseUrl + Config.addvehicle;

                var reqJson = {
                    driverid: await AsyncStorage.getItem('@userid'),
                    vehicle_type: this.state.vehicle_type,
                    vehicle_brand: this.state.vehicle_brand,
                    vehicle_model: this.state.vehicle_model,
                    vehicle_year: this.state.vehicle_year,
                    vehicle_number_plate: this.state.vehicle_number_plate,
                    vehicle_color: this.state.vehicle_color,
                };

                var formData = new FormData();
                if (this.state.vehicle_rc_book.uri != null) {
                    formData.append('vehicle_rc_book', this.state.vehicle_rc_book);
                } else {
                    formData.append('vehicle_rc_book', []);
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
                                    //console.log('response', response)
                                    viewUtils.showToast(response.message.trim());
                                    this.props.navigation.navigate('VehicleManagement')                        
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

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {

                    console.log('latitude', position.coords.latitude);
                    console.log('longitude', position.coords.longitude);
                    this.setState({
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
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    // status={"Online"}
                    // switchOn={true}
                    goBack={() => this.props.navigation.navigate('VehicleManagement')}
                    onPress={() => this.toggle()}
                />
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>Add New Vehicle</Text>
                </View>

                <ScrollView>
                    <View style={{marginHorizontal: width * 0.05}}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Vehicle Type</Text>
                            <RNPickerSelect
                                value={this.state.selectedVehicle}
                                onValueChange={(value, index) =>
                                    this.setState({ selectedVehicle: value, vehicle_type: index, vehicle_typeError: null })}
                                items={this.state.VehicleList.map((item, index) => (
                                    {
                                        label: item.vehicle_name,
                                        value: item.vehicle_name 
                                    }
                                ))}
                                placeholder={{
                                    label: 'Select Vehicle Type',
                                    value: null,
                                    //color: '#9e9e9e'
                                }}
                                placeholderTextColor={Color.grey_5}
                                useNativeAndroidPickerStyle={false}
                                Icon={() => {
                                    return <Icon name='chevron-thin-down' color={Color.dark_blue} size={width * 0.07} />;
                                }}
                                textInputProps={{         
                                    fontFamily: Font.regular, 
                                    fontSize: width * 0.055,
                                    width: width * 0.9,
                                    padding: 0,  
                                    paddingTop: 1,  
                                    paddingBottom: 4, 
                                    borderBottomColor: Color.dark_blue, 
                                    borderBottomWidth: 2, 
                                }}
                                inputAndroidContainer={{
                                    borderWidth: 3
                                }}
                            /> 
                                {/* <Picker
                                    itemStyle={styles.pickerLable}
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.selectedVehicle}
                                    onValueChange={(itemValue, index) =>
                                        this.setState({ selectedVehicle: itemValue, vehicle_type: index, vehicle_typeError: null })}
                                >
                                    <Picker.Item
                                        color={Color.grey_5}
                                        label={'Select Vehicle Type'}
                                    />

                                    {this.state.VehicleList.map((item, index) => (
                                        <Picker.Item
                                            color='black'
                                            label={item.vehicle_name}
                                            value={item.vehicle_name}
                                            index={item.id}
                                            style={styles.picker}
                                        />
                                    ))}
                                </Picker> */}
                                {/* <TouchableHighlight style={{ borderBottomWidth: 2, borderBottomColor: Color.dark_blue }} onPress={() => this.selectVehicle()}>
                                    <Icon name='expand-more' color={Color.black} size={width * 0.07} />
                                </TouchableHighlight> */}
                            {this.state.vehicle_typeError &&
                                <Text style={styles.error}>{this.state.vehicle_typeError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Vehicle Brand</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize='sentences'
                                    placeholder="Enter Vehicle Brand"
                                    keyboardType="default"
                                    value={this.state.vehicle_brand}
                                    onChangeText={(value) => this.setState({ vehicle_brand: value })}
                                    ref={input => { this.vehicle_brand = input }}
                                    onFocus={() => this.setState({ vehicle_brandError: null })}
                                />
                                {/* <View style={{ borderBottomWidth: 2, borderBottomColor: Color.dark_blue }}>
                                    <Icon name='expand-more' color={Color.black} size={width * 0.07} />
                                </View> */}
                            {this.state.vehicle_brandError &&
                                <Text style={styles.error}>{this.state.vehicle_brandError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Vehicle Model</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize='sentences'
                                    placeholder="Enter Vehicle Model"
                                    keyboardType="default"
                                    value={this.state.vehicle_model}
                                    onChangeText={(value) => this.setState({ vehicle_model: value })}
                                    ref={input => { this.vehicle_model = input }}
                                    onFocus={() => this.setState({ vehicle_modelError: null })}
                                />
                                {/* <View style={{ borderBottomWidth: 2, borderBottomColor: Color.dark_blue }}>
                                    <Icon name='expand-more' color={Color.black} size={width * 0.07} />
                                </View> */}
                            {this.state.vehicle_modelError &&
                                <Text style={styles.error}>{this.state.vehicle_modelError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Year</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize="none"
                                    placeholder="Enter Year"
                                    keyboardType='default'
                                    value={this.state.vehicle_year}
                                    onChangeText={(value) => this.setState({ vehicle_year: value })}
                                    ref={input => { this.vehicle_year = input }}
                                    onFocus={() => this.setState({ vehicle_yearError: null })}
                                />
                                {/* <View style={{ borderBottomWidth: 2, borderBottomColor: Color.dark_blue }}>
                                    <Icon name='expand-more' color={Color.black} size={width * 0.07} />
                                </View> */}
                            {this.state.vehicle_yearError &&
                                <Text style={styles.error}>{this.state.vehicle_yearError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>License Plate</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize="none"
                                    placeholder="Enter Vehicle License Plate No."
                                    keyboardType="default"
                                    value={this.state.vehicle_number_plate}
                                    onChangeText={(value) => this.setState({ vehicle_number_plate: value })}
                                    ref={input => { this.vehicle_number_plate = input }}
                                    onFocus={() => this.setState({ vehicle_number_plateError: null })}
                                />
                                {/* <View style={{ borderBottomWidth: 2, borderBottomColor: Color.dark_blue }}>
                                    <Icon name='expand-more' color={Color.black} size={width * 0.07} />
                                </View> */}
                            {this.state.vehicle_number_plateError &&
                                <Text style={styles.error}>{this.state.vehicle_number_plateError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Color</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize='sentences'
                                    placeholder="Enter Vehicle Color"
                                    keyboardType="default"
                                    value={this.state.vehicle_color}
                                    onChangeText={(value) => this.setState({ vehicle_color: value })}
                                    ref={input => { this.vehicle_color = input }}
                                    onFocus={() => this.setState({ vehicle_colorError: null })}
                                />
                                {/* <View style={{ borderBottomWidth: 2, borderBottomColor: Color.dark_blue }}>
                                    <Icon name='expand-more' color={Color.black} size={width * 0.07} />
                                </View> */}
                            {this.state.vehicle_colorError &&
                                <Text style={styles.error}>{this.state.vehicle_colorError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Upload RC Book image</Text>
                            <View style={styles.imageDiv}>
                                {this.state.vehicle_rc_book.uri == null ?
                                    <TouchableHighlight underlayColor="transparent" onPress={() => this.addImage()}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Color.white, width: width * 0.85, height: width * 0.25, }}>
                                        {/* <Image source={this.state.img} style={styles.image} /> */}
                                            <Image source={require('../../../assets/img/upload_icon.png')} style={styles.uploadIcon} />
                                            <Text style={styles.uploadTxt}> Upload Your RC Book</Text>
                                        </View>
                                    </TouchableHighlight>
                                    : <TouchableHighlight underlayColor="transparent" onPress={() => this.addImage()}>
                                        <Image source={this.state.vehicle_rc_book} style={styles.finalImage} />
                                    </TouchableHighlight>}
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Add Vehicle"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.button}
                                onPress={() => this._navigate()}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

