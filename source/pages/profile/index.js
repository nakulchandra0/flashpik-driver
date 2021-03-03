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
} from 'react-native';
import moment from 'moment';
import { Button, Input, CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-datepicker';
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
import Config from '../../config/config';
import ApiService from '../../config/ApiService';
import Utility from '../../config/utility';

var { width, height } = Dimensions.get('window');

export default class Orders extends Component {
    constructor() {
        super();
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
            options: [{
                key: 'Male',
                text: 'Male',
            },
            {
                key: 'Female',
                text: 'Female',
            },
            ],
            isLoading: false,

            profile_image: [],
            driverid: null,
            name: null,
            email: null,
            phone_number: null,
            dob: null,
            currentDate: null,
            gender: null,
            password: null,
            newPassword: null,
            retypePassword: null,

            latitude: null,
            longitude: null,
        };

        this.Star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
        this.Star_With_Border = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';

    }

    componentDidMount = async () => {
        // setInterval(async()=> {
        console.log('Profile===>', await AsyncStorage.getItem('@profile'))
        //console.log('id', await AsyncStorage.getItem('@status'))
        this.setState({
            currentDate: new Date(),
            driverid: await AsyncStorage.getItem('@userid'),
            name: await AsyncStorage.getItem('@name'),
            email: await AsyncStorage.getItem('@email'),
            phone_number: await AsyncStorage.getItem('@phone'),
            dob: await AsyncStorage.getItem('@date_of_birth'),
            gender: await AsyncStorage.getItem('@gender'),
            profile_image: { uri: await AsyncStorage.getItem('@profile'), type: 'image/jpg', name: 'image.jpg' },
        });
        // },100)
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.options.length;
        return (
            <View key={item.key} style={styles.radioButtonContainer}>
                <TouchableOpacity style={styles.circle}
                    onPress={
                        () => {
                            this.setState({
                                gender: item.key,
                                genderError: null
                            });
                        }
                    }>
                    {this.state.gender === item.key &&
                        <View style={styles.checkedCircle} />
                    }
                </TouchableOpacity>
                <Text style={styles.txt}>{item.text} </Text>
            </View >
        )
    }

    editProfile = () => {
        ImagePicker.openPicker({
            width: width,
            height: width,
            cropping: true,
            includeExif: true
        }).then(image => {
            console.log('image', image);
            this.setState({
                profile_image: {
                    uri: image.path,
                    type: image.mime,
                    name: Platform.OS === 'ios' ? image.filename : 'image.jpg'
                }
            });
        }).catch(e => alert('User cancelled image selection.'));
    }

    /* email validation check */
    validateEmail = email => {
        let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    };

    /* mobile number formate */
    validateNumber = phone_number => {
        let re = /^[0]?[6789]\d{9}$/;
        return re.test(phone_number);
    };

    profile_api_call = async () => {
        // console.log('id->',this.state.driverid,
        //     'name->',this.state.name,
        //     'email->',this.state.email,
        //     'number->',this.state.phone_number,
        //     'dob->',this.state.dob,
        //     'gender->',this.state.gender,
        //     )
        const { name, email, phone_number, dob, gender, newPassword, retypePassword, profile_image } = this.state;
        // profile_image.uri == null ? viewUtils.showToast('Set profile image') : '';
        !name ? this.setState({ nameError: "Name required" }) : "";
        !email ? this.setState({ emailError: "Email required" }) : "";
        !this.validateEmail(email) ? this.setState({ emailError: "Ex: name@domain.com" }) : "";
        !phone_number ? this.setState({ phoneError: "Phone number required" }) : "";
        !this.validateNumber(phone_number) ? this.setState({ phoneError: "Valide phone number required" }) : "";
        !dob ? this.setState({ dobError: "Date of birth required" }) : "";
        !gender ? this.setState({ genderError: "Select gender" }) : this.setState({ genderError: null });
        //newPassword == null ? this.setState({ newPasswordError: "New password required" }) : "" : ""
        //profile_image==null ? alert(profile_image) : alert(profile_image);
        //this.setState({ profileError: "Set your profile" }) : this.setState({ profileError: null });

        if (name && email && phone_number && dob && gender && this.validateEmail(email) && this.validateNumber(phone_number)) {
            if (newPassword == null) {
                this.setState({ isLoading: true }, async () => {
                    var url = Config.baseUrl + Config.editprofile;

                    var reqJson = {
                        driverid: this.state.driverid,
                        name: this.state.name,
                        email: this.state.email,
                        phone_number: this.state.phone_number,
                        date_of_birth: this.state.dob,
                        gender: this.state.gender,
                        //current_password: this.state.password,
                        new_password: this.state.newPassword,
                    };

                    var formData = new FormData();
                    if (this.state.profile_image.uri !== null) {
                        //alert(JSON.stringify(this.state.profile_image))
                        formData.append('profile_image', this.state.profile_image);
                    } else {
                        //alert(JSON.stringify(this.state.profile_image))
                        formData.append('profile_image', '');
                    }

                    formData.append('jsonstring', JSON.stringify(reqJson));
                    //console.log('profile', formData)

                    apiService.executeFormApi(
                        url,
                        "POST",
                        formData,
                        async (error, response) => {

                            if (error !== "") {
                                //alert()
                                this.setState({ isLoading: false });
                                viewUtils.showToast(error);
                                // viewUtils.showToast("Set profile image");
                            }

                            if (response !== null && response !== "") {
                                this.setState({ isLoading: false });
                                if (response.status == "true") {
                                    try {
                                        console.log('response', response)
                                        await AsyncStorage.setItem('@name', response.data.name)
                                        await AsyncStorage.setItem('@email', response.data.email)
                                        await AsyncStorage.setItem('@phone', response.data.phone_number)
                                        await AsyncStorage.setItem('@date_of_birth', response.data.date_of_birth)
                                        await AsyncStorage.setItem('@gender', response.data.gender)
                                        await AsyncStorage.setItem('@profile', response.data.profile_image)
                                        viewUtils.showToast(response.message.trim());
                                        this.props.navigation.navigate('Setting')
                                    } catch (e) {
                                        console.log(e)
                                    }
                                } else {
                                    viewUtils.showToast(response.message.trim());
                                }
                            }
                        });
                })
            } else {
                retypePassword == null ? this.setState({ retypePasswordError: 'Re-type password' }) :
                    retypePassword !== newPassword ? this.setState({ retypePasswordError: "Password doesn't match" }) : ""

                if (newPassword && retypePassword && newPassword == retypePassword) {
                    this.setState({ isLoading: true }, async () => {
                        var url = Config.baseUrl + Config.editprofile;
                        var reqJson = {
                            driverid: this.state.driverid,
                            name: this.state.name,
                            email: this.state.email,
                            phone_number: this.state.phone_number,
                            date_of_birth: this.state.dob,
                            gender: this.state.gender,
                            //current_password: this.state.password,
                            new_password: this.state.newPassword,
                        };

                        var formData = new FormData();
                        if (this.state.profile_image.uri != null) {
                            formData.append('profile_image', this.state.profile_image);
                        } else {
                            //alert('')
                            formData.append('profile_image', '');
                        }
                        formData.append('jsonstring', JSON.stringify(reqJson));
                        console.log(formData)

                        apiService.executeFormApi(
                            url,
                            "POST",
                            formData,
                            async (error, response) => {

                                if (error !== "") {
                                    this.setState({ isLoading: false });
                                    //viewUtils.showToast('Password not changed. Current password did not match records.');
                                    viewUtils.showToast(error);
                                }

                                if (response !== null && response !== "") {
                                    this.setState({ isLoading: false });
                                    if (response.status == "true") {
                                        try {
                                            await AsyncStorage.setItem('@name', response.data.name)
                                            await AsyncStorage.setItem('@email', response.data.email)
                                            await AsyncStorage.setItem('@phone', response.data.phone_number)
                                            await AsyncStorage.setItem('@date_of_birth', response.data.date_of_birth)
                                            await AsyncStorage.setItem('@gender', response.data.gender)
                                            await AsyncStorage.setItem('@profile', response.data.profile_image)
                                            viewUtils.showToast(response.message.trim());
                                            this.props.navigation.navigate('Setting')
                                        } catch (e) {
                                            console.log(e)
                                        }
                                        //viewUtils.showToast(response.message.trim());
                                    } else {
                                        viewUtils.showToast(response.message.trim());
                                    }
                                }
                            });
                    })
                }
            }
        }
    }

    toggle = async () => {
        Geolocation.getCurrentPosition(
            async position => {
                this.setState({ isLoading: true }, async () => {
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        marker: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                    })
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
                    goBack={() => this.props.navigation.navigate('Setting')}
                    onPress={() => this.toggle()}
                />
                <KeyboardAwareScrollView>
                    <View style={styles.mainContainer}>
                        <Text style={styles.title}> Profile Setting </Text>

                        <View style={styles.imageContainer}>
                            <View style={styles.imageDiv}>
                                {this.state.profile_image.uri == null ?
                                    <Image source={require('./../../../assets/img/user.png')}
                                        style={styles.userImage} /> :
                                    <Image source={this.state.profile_image} style={styles.userImage} />
                                }
                            </View>
                            <TouchableOpacity onPress={() => this.editProfile()} >
                                <Text style={styles.editText}> Edit Profile Image </Text>
                            </TouchableOpacity>

                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Name </Text>
                            <TextInput
                                style={styles.textBox}
                                autoCapitalize="words"
                                placeholder="Enter Name"
                                keyboardType="default"
                                value={this.state.name}
                                onChangeText={
                                    (value) => this.setState({ name: value })
                                }
                                ref={input => { this.name = input }}
                                onFocus={
                                    () => this.setState({ nameError: null })
                                }
                            />
                            {this.state.nameError &&
                                <Text style={styles.error} > {this.state.nameError} </Text>}
                        </View>

                        <View style={styles.textContainer} >
                            <Text style={styles.label}>Email </Text>
                            <TextInput style={styles.textBox}
                                autoCapitalize="none"
                                placeholder="Enter Email"
                                keyboardType="email-address"
                                value={this.state.email}
                                onChangeText={
                                    (value) => this.setState({ email: value })
                                }
                                ref={input => { this.email = input }}
                                onFocus={
                                    () => this.setState({ emailError: null })
                                }
                            />
                            {this.state.emailError &&
                                <Text style={styles.error} > {this.state.emailError} </Text>}
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Phone </Text>
                            <TextInput
                                style={styles.textBox}
                                autoCapitalize="none"
                                placeholder="Enter Phone"
                                keyboardType="phone-pad"
                                value={this.state.phone_number}
                                onChangeText={
                                    (value) => this.setState({ phone_number: value })
                                }
                                ref={input => { this.phone_number = input }}
                                onFocus={
                                    () => this.setState({ phoneError: null })
                                }
                            />
                            {this.state.phoneError &&
                                <Text style={styles.error} > {this.state.phoneError} </Text>}
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Date of Birth </Text>
                            <DatePicker
                                style={styles.textBox}
                                date={this.state.dob} //initial date from state
                                mode="date" //The enum of date, datetime and time
                                placeholder="Enter Date of Birth"
                                format="DD-MM-YYYY"
                                minDate="01-01-1950"
                                maxDate={this.state.currentDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={
                                    {
                                        dateIcon: {
                                            // position: 'absolute',
                                            // left: 0,
                                            // top: 4,
                                            // marginLeft: 0
                                            display: 'none'
                                        },
                                        dateInput: {
                                            // width: width,
                                            // fontFamily: Font.regular, 
                                            // fontSize: width * 0.25,
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                        },
                                        placeholderText: {
                                            fontFamily: Font.regular,
                                            fontSize: width * 0.055,

                                          },
                                        dateText: {
                                            fontFamily: Font.regular,
                                            fontSize: width * 0.055,
                                        }
                                    }
                                }
                                onDateChange={
                                    (date) => { this.setState({ dob: date, dobError: null }) }
                                }
                            />
                            {this.state.dobError &&
                                <Text style={styles.error} > {this.state.dobError} </Text>}
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Gender </Text>
                            <FlatList
                                refreshing={this.state.options}
                                keyExtractor={
                                    (item, index) => index.toString()
                                }
                                data={this.state.options}
                                extraData={this.state}
                                numColumns={2}
                                renderItem={this.renderItem.bind(this)}
                                scrollEnabled={false}
                            />
                            {this.state.genderError &&
                                <Text style={styles.error} > {this.state.genderError} </Text>}
                        </View>

                        {/* <View style = { styles.textContainer } >
                                <Text style = { styles.label } > Current Password </Text> 
                                <TextInput
                                    style = { styles.textBox }
                                    autoCapitalize = "none"
                                    placeholder = "Enter Current Password"
                                    keyboardType = "default"
                                    secureTextEntry = { true }
                                    value = { this.state.password }
                                    onChangeText = {
                                        (value) => this.setState({ password: value })
                                    }
                                    ref = { input => { this.password = input } }
                                    onFocus = {
                                        () => this.setState({ passwordError: null })
                                    }
                                /> 
                                {this.state.passwordError &&
                                <Text style = { styles.error } > { this.state.passwordError } </Text> } 
                            </View>
 */}
                        <View style={styles.textContainer} >
                            <Text style={styles.label}>New Password </Text>
                            <TextInput
                                style={styles.textBox}
                                autoCapitalize="none"
                                placeholder="Enter New Password"
                                keyboardType="default"
                                secureTextEntry={true}
                                value={this.state.newPassword}
                                onChangeText={
                                    (value) => this.setState({ newPassword: value })
                                }
                                ref={input => { this.newPassword = input }}
                                onFocus={
                                    () => this.setState({ newPasswordError: null })
                                }
                            />
                            {this.state.newPasswordError &&
                                <Text style={styles.error} > {this.state.newPasswordError} </Text>}
                        </View>

                        <View style={styles.textContainer} >
                            <Text style={styles.label}>Re - type New Password </Text>
                            <TextInput
                                style={styles.textBox}
                                autoCapitalize="none"
                                placeholder="Enter Re-type New Password"
                                keyboardType="default"
                                secureTextEntry={true}
                                value={this.state.retypePassword}
                                onChangeText={
                                    (value) => this.setState({ retypePassword: value })
                                }
                                ref={input => { this.retypePassword = input }}
                                onFocus={
                                    () => this.setState({ retypePasswordError: null })
                                }
                            />
                            {this.state.retypePasswordError &&
                                <Text style={styles.error} > {this.state.retypePasswordError} </Text>}
                        </View>

                        <View style={styles.buttonContainer} >
                            <Button
                                title="Save Changes"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.button}
                                onPress={
                                    () => this.profile_api_call()
                                }
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}