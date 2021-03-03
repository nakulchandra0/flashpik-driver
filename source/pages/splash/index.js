import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    StatusBar,
    Alert,
    AppState
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import firebase, { notifications } from 'react-native-firebase';
import Geolocation from '@react-native-community/geolocation';
//import PushNotificationAndroid from 'react-native-push-notification';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font'
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";

var { width, height } = Dimensions.get('window');

export default class Splash extends React.PureComponent {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
            appState: AppState.currentState,
            fcmToken: null,
            status: '',

            notification: []
        }
    }

    async componentWillMount() {
        //this.createNotificationListeners();
    }

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
        AppState.addEventListener('change', this._handleAppStateChange);
        //console.log('component',this.state.notification)

        this.timeoutHandle = setTimeout(async () => {
            //console.log('notification',await AsyncStorage.getItem('@userid'))
            if (!await AsyncStorage.getItem('@userid')) {
                //console.log(await AsyncStorage.getItem('@status'))

                this.props.navigation.reset([ NavigationActions.navigate({routeName: 'Intro',})], 0)
                // await AsyncStorage.getItem('@status') == "Online"
                //     ? this.props.navigation.reset([NavigationActions.navigate({routeName: 'Job',})], 0)
                //     : this.props.navigation.reset([ NavigationActions.navigate({routeName: 'Main',})], 0)
                
            } else {

                await AsyncStorage.getItem('@status') == "Online"
                    ? this.props.navigation.reset([NavigationActions.navigate({routeName: 'Job',})], 0)
                    : this.props.navigation.reset([NavigationActions.navigate({routeName: 'Main',})], 0)
                // this.props.navigation.reset([NavigationActions.navigate({routeName: 'PickUpImage',})], 0)
            }
        }, 2000);
    }

    // componentWillUnmount() {
    //     AppState.removeEventListener('change', this._handleAppStateChange);
    // }

    _handleAppStateChange = nextAppState => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
        }

        console.log('app state--->',nextAppState)
        this.setState({ appState: nextAppState });
    };
    /* chaeck the user has messaging permission for this app */
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        console.log('enable-->',enabled )
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    /* Returns an FCM token for this device. Optionally you can specify a custom authorized entity or scope to tailor tokens to your own use-case. */
    async getToken() {
        //console.log(await AsyncStorage.getItem('@fcmToken'))
        let fcmToken = await AsyncStorage.getItem('@fcmToken');
        this.setState({ fcmToken: fcmToken });
        console.log("fcmToken ===", fcmToken)
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                this.setState({ fcmToken: fcmToken });
                await AsyncStorage.setItem('@fcmToken', fcmToken);
            }
            console.log("fcmToken ===", fcmToken)
        }
    }

    /* On iOS, messaging permission must be requested by the current application before messages can be received or sent. */
    async requestPermission() {
        console.log("asking for permission");
        try {
          await firebase.messaging().requestPermission();
          console.log("permission granted")
        //   this.getFcmToken();
          this.getToken();
        } 
        catch (error) {
            console.log('permission rejected');
        }
    }

    async createNotificationListeners() {
        console.log('createNotificationListeners called')

        /* Triggered when a particular notification has been received in foreground */
        this.notificationfListener = firebase.notifications().onNotification((notification) => {               
              if (Platform.OS == 'ios') {  
                var notificationTitle = notification.title;
                const customObject = JSON.parse(notification.data['gcm.notification.category']); 
                this.notificationWhenAppInForegroundIos(notification);
            } 
        });

        /* If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows: */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            console.log("notificationListener called for background application:", notificationOpen);
            
            if (Platform.OS == "android") {
                console.log('notification')
                if(notificationOpen.notification._data.type === 'driver_order_request') {
                    let notification = notificationOpen.notification._data
                    this.props.navigation.navigate('Job',{ notification: notification})
                } else {
                    let notification = notificationOpen.notification._data
                    this.props.navigation.navigate('Notification',{ notification: notification})
                }
                //this.setState({ notification: notification._data })
                //this.props.navigation.navigate('Job',{ notification: notification._data })
                //Actions.Job(notification._data)
            } else {
                let notification = notificationOpen.notification
                const customObject = JSON.parse(notification.data['gcm.notification.category']);
                //Actions.jobDetail(customObject.job)
            }
        });

        /* If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows: */
        
        // const notificationOpen = await firebase.notifications().getInitialNotification();

        // if (notificationOpen) {
        //     let notification = notificationOpen.notification
        //     if (Platform.OS == "android") {
        //         console.log("notificationOpen closed", notificationOpen.notification)
        //         //this.setState({ notification: notificationOpen.notification._data })
        //         this.props.navigation.push('Job',{ notification: notification._data })
        //         //Actions.jobDetail(notification.data.job)
        //     } else {
        //         const customObject = JSON.parse(notification.data['gcm.notification.category']);
        //         var type = customObject.type;
        //         //Actions.jobDetail(customObject.job)
        //     }
        // }

        /* Triggered for data only payload in foreground for android only */
        this.messageListener = firebase.messaging().onMessage(async (message) => {
            console.log('message listener', message._data)
            this.props.navigation.navigate('Job',{ notification: message._data })

            if (Platform.OS == 'android') {
                const { appState } = this.state;
                //console.log('app state 1 --->',appState)
                if (appState === "active") {
                    const channel = new firebase.notifications.Android.Channel('ALL', 'Flashpik', firebase.notifications.Android.Importance.Max)
                        .setDescription('Flashpik Notification');
                    const badgeCount = await firebase.notifications().getBadge();
                    //alert(JSON.stringify(badgeCount))
                    const localNotification = new firebase.notifications.Notification()
                        .setNotificationId(message.messageId)
                        .setTitle(message.data.title)
                        .setBody(message.data.message)
                        .setData(message.data)

                        .android.setChannelId(channel.channelId)
                        .android.setAutoCancel(true)
                        .android.setSmallIcon('ic_launcher')
                        .android.setCategory(firebase.notifications.Android.Category.Alarm)
                        .android.setPriority(firebase.notifications.Android.Priority.High);
                        //.android.setTimeout(60);

                    firebase.notifications().android.createChannel(channel);
                    //firebase.notifications().displayNotification(localNotification);
                    firebase.notifications().setBadge(badgeCount);
                }
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                <Image source={require('../../../assets/img/app_logo.png')} style={styles.logo} />
                <Image source={require('../../../assets/img/flashpik.png')} style={styles.flashpik} />
                <View style={styles.bottom_view}>
                    <Image source={require('../../../assets/img/bottom_layer.png')} style={styles.bottom_image} />
                </View>
            </View>
        );
    }
}



