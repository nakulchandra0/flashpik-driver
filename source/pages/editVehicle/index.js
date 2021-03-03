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
    ScrollView,
    TouchableHighlight,
    TextInput,
    ImageBackground,
    Picker
} from 'react-native';
import moment from 'moment';
import { Button, Input, CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import RNPickerSelect from 'react-native-picker-select';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/goBack';
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
            // name: "Activa",
            // brand: "Honda",
            // model: "5G",
            // year: "2017",
            // licensePlate: "GJ-01-NC-2020",
            // color: "Black",
            // PickupType: "Activa 10Kgs.",
            // img: require('../../../assets/img/rcBook.jpeg'),
            selectedVehicle: null,

            vehicle_id: null,
            vehicle_type: null,
            vehicle_brand: null,
            vehicle_model: null,
            vehicle_year: null,
            vehicle_number: null,
            vehicle_color: null,
            vehicle_rcbook: [],

            VehicleList: [],

            latitude: null,
            longitude: null,
        };
    }

    componentDidMount = async () => {
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

                            response.data.map((item, index) => (
                                this.props.navigation.state.params.vehicle_type == item.vehicle_name 
                                && this.setState({ selectedVehicle: item.id })
                                //alert(item.id)
                            ))
                                            
                            console.log(response.data)
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
        this.setState({
            vehicle_id: this.props.navigation.state.params.vehicle_id,
            vehicle_type: this.props.navigation.state.params.vehicle_type,
            vehicle_brand: this.props.navigation.state.params.vehicle_brand,
            vehicle_model: this.props.navigation.state.params.vehicle_model,
            vehicle_year: this.props.navigation.state.params.vehicle_year,
            vehicle_number: this.props.navigation.state.params.vehicle_number,
            vehicle_color: this.props.navigation.state.params.vehicle_color,
            vehicle_rcbook: { uri: this.props.navigation.state.params.vehicle_rcbook, type: 'image/jpg', name: 'image.jpg' },
            //selectedVehicle: 
        })
    }

    _navigate = () => {
        // console.log('vehicle id', this.state.vehicle_id)
        // console.log('vehicle_type', this.state.vehicle_type)
        // console.log('vehicle_brand', this.state.vehicle_brand)
        // console.log('vehicle_model', this.state.vehicle_model)
        // console.log('vehicle_year', this.state.vehicle_year)
        // console.log('vehicle_number_plate', this.state.vehicle_number)
        // console.log('vehicle_color', this.state.vehicle_color)
        // console.log('rc_book',this.state.vehicle_rcbook)
        // console.log('type_id',this.state.selectedVehicle)
        const { vehicle_type, vehicle_brand, vehicle_model, vehicle_year, vehicle_number, vehicle_color, vehicle_rcbook } = this.state;

        vehicle_type==null || vehicle_type==0 ? this.setState({ vehicle_typeError: "Select vehicle type" }) : "";
        !vehicle_brand ? this.setState({ vehicle_brandError: "Vehicle brand required" }) : "";
        !vehicle_model ? this.setState({ vehicle_modelError: "Vehicle model required" }) : "";
        !vehicle_year ? this.setState({ vehicle_yearError: "Vehicle year required" }) : "";
        !vehicle_number ? this.setState({ vehicle_number_plateError: "Vehicle number plate required" }) : "";
        !vehicle_color ? this.setState({ vehicle_colorError: "Vehicle color required" }) : "";
        //vehicle_rc_book.uri == null ? alert(profile_image) : alert(profile_image);
        vehicle_rcbook.uri == null ? viewUtils.showToast('Set vehicle rc book image') : '';

        if (vehicle_type && vehicle_brand && vehicle_model && vehicle_year && vehicle_number && vehicle_color && vehicle_rcbook.uri) {
            this.setState({ isLoading: true }, async () => {
                var url = Config.baseUrl + Config.editvehicle;

                var reqJson = {
                    vehicleid: this.state.vehicle_id,
                    vehicle_type: this.state.selectedVehicle,
                    vehicle_brand: this.state.vehicle_brand,
                    vehicle_model: this.state.vehicle_model,
                    vehicle_year: this.state.vehicle_year,
                    vehicle_number_plate: this.state.vehicle_number,
                    vehicle_color: this.state.vehicle_color,
                };

                var formData = new FormData();
                if (this.state.vehicle_rcbook.uri != null) {
                    formData.append('vehicle_rc_book', this.state.vehicle_rcbook);
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
                                    //console.log('response==>', response)
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

    _delete = async() => {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.deletevehicle;

            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
                vehicleid: this.state.vehicle_id
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
                            //this.setState({ VehicleList: response.data });
                            viewUtils.showToast(response.message.trim());
                            this.props.navigation.navigate('VehicleManagement')
                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                    }
                });
        })
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

    deleteImage = () => {
        this.setState({ vehicle_rcbook: { uri: null, type: 'image/jpg', name: 'image.jpg' } })
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
                vehicle_rcbook: {
                    uri: image.path,
                    type: image.mime,
                    name: Platform.OS === 'ios' ? image.filename : 'image.jpg'
                }
            });
        }).catch(e => alert('User cancelled image selection'));
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
                    <Text style={styles.title}>Edit Vehicle</Text>
                </View>
                <ScrollView>
                    <View style={styles.mainContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Vehicle Type</Text>
                            <RNPickerSelect
                                value={this.state.vehicle_type}
                                onValueChange={(value, index) =>
                                    this.setState({ selectedVehicle: index, vehicle_type: value, vehicle_typeError: null })}
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
                                    //itemStyle={styles.pickerLable}
                                    mode="dropdown"
                                    style={styles.pickerStyle}
                                    selectedValue={this.state.vehicle_type}
                                    onValueChange={(itemValue, index) =>
                                        this.setState({ vehicle_type: itemValue, selectedVehicle: index+1, vehicle_typeError: null })}
                                >
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
                            {this.state.vehicle_typeError &&
                                <Text style={styles.error}>{this.state.vehicle_typeError}</Text>
                            }
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Vehicle Brand</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize="none"
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
                                    autoCapitalize="none"
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
                                    keyboardType="default"
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
                                    value={this.state.vehicle_number}
                                    onChangeText={(value) => this.setState({ vehicle_number: value })}
                                    ref={input => { this.vehicle_number = input }}
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
                                    autoCapitalize="none"
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
                                {this.state.vehicle_rcbook.uri == null ? 
                                    <TouchableHighlight underlayColor="transparent" onPress={() => this.addImage()}>
                                        <View style={styles.uploadImageDiv}>
                                            <Image source={require('../../../assets/img/upload_icon.png')} style={styles.uploadIcon} />
                                            <Text style={styles.uploadTxt}> Upload Your RC Book</Text>
                                        </View>
                                    </TouchableHighlight>
                                : 
                                    <TouchableHighlight underlayColor="transparent" onPress={() => this.deleteImage()}>
                                        <View style={styles.imageDiv}>
                                            <Image source={{uri: this.state.vehicle_rcbook.uri}} style={styles.image} />
                                            <Image source={require('../../../assets/img/delete_icon.png')} style={styles.deleteIcon} />
                                            <Text style={styles.deleteTxt}> Delete</Text>
                                        </View>
                                    </TouchableHighlight>
                                } 
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Save Changes"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.button}
                                onPress={() => this._navigate()}
                            />

                            <Button
                                title="Delete Vehicle"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.deleteButton}
                                onPress={() => this._delete()}
                            />
                        </View>
                        </View>
                    </ScrollView>
            </View>
        );
    }
}

