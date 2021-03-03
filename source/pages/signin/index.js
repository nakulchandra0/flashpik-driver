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
    BackHandler
} from 'react-native';

import { Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StackActions, NavigationActions } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import RNExitApp from 'react-native-exit-app';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase, { notifications } from 'react-native-firebase';
import { BoxShadow } from 'react-native-shadow';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font'
import styles from './styles';
import Config from '../../config/config';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";

var { width, height } = Dimensions.get('window');

import {
    LoginManager,
    LoginButton,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
} from 'react-native-fbsdk';

import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from 'react-native-google-signin';

export default class Signup extends React.PureComponent {
    static navigationOptions = {
        headerMode: 'none',
        header: null
    }

    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
            email: null,
            password: null,
        }
    }

    backHandler = null;
    async componentDidMount() {
        this.setState({ fcmToken: await firebase.messaging().getToken() });
        GoogleSignin.configure({
            //It is mandatory to call this method before attempting to call signIn()
            scopes: ["https://www.googleapis.com/auth/user.birthday.read"],
            //discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"],
            // Repleace with your webClientId generated from Firebase console
            //scopes: [ 'https://www.googleapis.com/auth/drive.readonly' ],
            webClientId: Config.webClientId,
        });

        this._isSignedIn();

        // const { navigation } = this.props;
        // this.focusListener = navigation.addListener("didFocus", () => {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            RNExitApp.exitApp();
            return false;
        });
        // });
    }

    componentWillUnmount() {
        // this.setState = (state,callback)=>{
        //     return;
        // };
        // Remove the event listener
        this.backHandler.remove();
        // BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
    }

    _isSignedIn = async () => {

        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
            console.log('User is already signed in');
            //Get the User details as user is already signed in
            this._getCurrentUserInfo();
        } else {
            console.log('Please Login');
        }
        this.setState({ gettingLoginStatus: false });
    };

    _getCurrentUserInfo = async () => {
        try {
            const userInfo = await GoogleSignin.signInSilently()
            console.log('User Info --> ', userInfo);
            this.setState({ userInfo: userInfo });
            this.social_login(userInfo.user.id, userInfo.user.email, userInfo.user.name, userInfo.user.photo, "google");

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                console.log('User has not signed in yet');
            } else {
                console.log("Something went wrong. Unable to get user's info");
            }
        }
    };


    /* google sign in */
    handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices({
                showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signIn()

            // console.log('User Info --> ', userInfo);
            this.social_login(userInfo.user.id, userInfo.user.email, userInfo.user.name, userInfo.user.photo, "google");
        } catch (error) {
            console.log('Message', error.message);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('User Cancelled the Login Flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Signing In');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play Services Not Available or Outdated');
            } else {
                console.log('Some Other Error Happened');
            }
        }
    };

    /* facebook sign in */
    handleFacebookLogin = () => {
        LoginManager.logInWithPermissions(['public_profile', 'email', 'user_birthday']).then(result => {
            if (result.isCancelled) {
                console.log('Login cancelled');
            } else {
                console.log('Login success with permissions: ' + result.grantedPermissions.toString());

                AccessToken.getCurrentAccessToken().then(data => {
                    console.log('data--->', data)
                    const token = data.accessToken.toString();
                    //console.log('facebook initialLogin');
                    //console.log(token);

                    const req = new GraphRequest(
                        '/me', {
                        httpMethod: 'GET',
                        version: 'v2.5',
                        parameters: {
                            fields: {
                                string: 'email,name,picture.width(720).height(720),birthday',
                            },
                        },
                    },
                        (err, res) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('fb', res)
                                this.social_login(res.id, res.email, res.name, res.picture.data.url, "facebook");
                            }
                        });
                    new GraphRequestManager().addRequest(req).start();
                });
            }
        })
            .catch(error => {
                console.log('Login fail with error: ' + error);
            });
    }

    /* social login */
    async social_login(id, email, name, profile, type) {
        // console.log(id, email, name, profile, type)
        console.log('auth key',id)
        console.log('device id',this.state.fcmToken)
        console.log('email',email)
        console.log('name',name)
        console.log('profile',profile)
        console.log('provider',type)

        this.setState({ isLoading: true }, () => {
            var url = Config.baseUrl + Config.sociallogin;
            var reqJson = {
                auth_key: id,
                auth_provider: type,
                device_id: this.state.fcmToken ? this.state.fcmToken : NULL,
                email: email,
                name: name
                // profile: profile
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
                        if (response.status == "true") {
                            try {
                                console.log('response--->', response)
                                await AsyncStorage.setItem('@userid', response.data.id)
                                await AsyncStorage.setItem('@name', response.data.name)
                                await AsyncStorage.setItem('@email', response.data.email)
                                await AsyncStorage.setItem('@phone', response.data.phone_number)
                                await AsyncStorage.setItem('@profile', response.data.profile_image)
                                await AsyncStorage.setItem('@date_of_birth', response.data.date_of_birth)
                                await AsyncStorage.setItem('@gender', response.data.gender)
                                await AsyncStorage.setItem('@login', type)
                                await AsyncStorage.setItem('@status', "Offline")
                            } catch (e) {
                                console.log(e)
                            }
                            if (response.data.firsttime_login == 'no') {
                                this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Main' })], 0)
                            }
                            if (response.data.firsttime_login == 'yes') {
                                this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Profile' })], 0)
                            }

                        } else {
                            viewUtils.showToast(response.message.trim());
                        }
                        this.setState({ isLoading: false })
                    }
                });
        });
    }

    /* email validation check */
    validateEmail = email => {
        let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    };

    /* sign api call */
    signin = () => {
        const { email, password } = this.state;
        !this.validateEmail(email) ? this.setState({ emailError: "Ex: name@domain.com" }) : "";
        !email ? this.setState({ emailError: "Email required" }) : "";
        !password ? this.setState({ passwordError: "Password required" }) : "";

        if (email && password && this.validateEmail(email))
            this.setState({ isLoading: true }, () => {
                var url = Config.baseUrl + Config.signin;
                var reqJson = {
                    email: this.state.email,
                    password: this.state.password,
                    device_id: this.state.fcmToken ? this.state.fcmToken : NULL
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
                                try {
                                    console.log('response--->', response)
                                    await AsyncStorage.setItem('@userid', response.data.id)
                                    await AsyncStorage.setItem('@name', response.data.name)
                                    await AsyncStorage.setItem('@email', response.data.email)
                                    await AsyncStorage.setItem('@phone', response.data.phone_number)
                                    await AsyncStorage.setItem('@profile', response.data.profile_image)
                                    await AsyncStorage.setItem('@date_of_birth', response.data.date_of_birth)
                                    await AsyncStorage.setItem('@gender', response.data.gender)
                                    await AsyncStorage.setItem('@login', "normal")
                                    await AsyncStorage.setItem('@status', "Offline")

                                } catch (e) {
                                    console.log(e)
                                }
                                this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Main' })], 0)
                                //this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Profile' })], 0)
                            } else {
                                viewUtils.showToast(response.message.trim());
                            }
                        }
                    });
            })
    }

    render() {
        const shadowOpt = {
            width: width - width * 0.1,
            height: width - width * 0.33,
            color: Color.dark_blue,
            border: 15,
            radius: 12,
            opacity: 0.4,
            x: 0,
            y: 0,
            style: {
                marginVertical: 1,
            }
        }
        return (
            <View style={styles.container}>
                <Image source={require('../../../assets/img/screen_bg.png')} style={styles.imgBg} />
                <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />
                <View style={[styles.overlay, { width: width, justifyContent: 'center', alignItems: 'center' }]}>

                    <ScrollView style={{ width: width, paddingHorizontal: width * 0.05 }}>
                        <View style={{ height: height * (32 / 100) }} />
                        {/* <BoxShadow setting={shadowOpt}> */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.title}>Login</Text>
                            <View style={[styles.textContainer, { marginTop: width * 0.03 }]}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.textBox}
                                    autoCapitalize="none"
                                    placeholder="Enter Email"
                                    keyboardType="default"
                                    placeholderTextColor={Color.black}
                                    value={this.state.email}
                                    onChangeText={(value) => this.setState({ email: value })}
                                    ref={input => { this.email = input }}
                                    onFocus={() => this.setState({ emailError: null })}
                                />
                                {this.state.emailError &&
                                    <Text style={styles.error}>{this.state.emailError}</Text>
                                }
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.textBox}
                                    keyboardType="default"
                                    placeholder="Enter Password"
                                    secureTextEntry={true}
                                    placeholderTextColor={Color.black}
                                    value={this.state.password}
                                    onChangeText={(value) => this.setState({ password: value })}
                                    ref={input => { this.password = input }}
                                    onFocus={() => this.setState({ passwordError: null })}
                                />
                                {this.state.passwordError &&
                                    <Text style={styles.error}>{this.state.passwordError}</Text>
                                }
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <TouchableHighlight underlayColor="transparent" onPress={() => this.props.navigation.navigate('Reset')}>
                                    <Text style={[styles.socialTitle, { color: Color.dark_blue, paddingRight: 0, paddingVertical: 5 }]}>Forget Password?</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                        {/* </BoxShadow>  */}

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Login"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.button}
                                onPress={() => this.signin()}
                            />
                        </View>

                        <View style={styles.bottomContainer}>
                            <View style={styles.seprate}>
                                <View style={styles.line} />
                                <Text style={[styles.socialTitle, { color: Color.black }]}>Social Login</Text>
                                <View style={styles.line} />
                            </View>
                            <View style={styles.logoContainer}>
                                <View style={styles.lLeft}>
                                    <TouchableHighlight underlayColor="transparent" onPress={() => this.handleFacebookLogin()}>
                                        <Image source={require('../../../assets/img/facebook.png')} style={styles.logo} />
                                    </TouchableHighlight>
                                </View>
                                <View style={styles.lRight}>
                                    <TouchableHighlight underlayColor="transparent" onPress={() => this.handleGoogleLogin()}>
                                        <Image source={require('../../../assets/img/google.png')} style={styles.logo} />
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.alreadyTitle}>New User?</Text>
                                <TouchableHighlight underlayColor="transparent"
                                    style={{ paddingRight: 10, padding: 5, alignItems: 'flex-start' }}
                                    onPress={() => this.props.navigation.navigate('Signup')} >
                                    <Text style={{ color: Color.dark_blue, fontFamily: Font.bold, fontSize: width * 0.03 }}>Signup</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </ScrollView>

                </View>
            </View>
        );
    }
}



