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
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    SafeAreaView,
    BackHandler
} from 'react-native';

import moment from 'moment';
import { Button, Input, CheckBox } from 'react-native-elements';
// import { GiftedChat, Actions, IMessage, Feather, MessageImage } from 'react-native-gifted-chat';
import { GiftedChat, Actions } from 'react-native-gifted-chat';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/goBack';
import styles from './chatStyle';
import Config from '../../config/config';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import { Send } from "../../../node_modules/react-native-gifted-chat/lib/Send";
import { addItem } from '../../config/disputeFirebase';
import { db } from '../../config/db';

var { width, height } = Dimensions.get('window');

export default class Orders extends React.Component {

    // state = {
    //     messages: [],
    // }

    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.params = this.props.navigation.state.params;
        this.state = {
            /* messages: [
                {
                    _id: 2,
                    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                    //image: 'https://facebook.github.io/react/img/logo_og.png',
                },
                {
                    _id: 3,
                    text: 'It is a long established fact',
                    createdAt: new Date(),
                    user: {
                        _id: 1,
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                    //image: 'https://facebook.github.io/react/img/logo_og.png',
                },
                {
                    _id: 3,
                    //text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://facebook.github.io/react/img/logo_og.png',
                    },
                    image: 'https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg',
                },
            ], */

            // {
            //     "adminid": "",
            //     "created": "2020-12-18 06:14:39",
            //     "disputeid": "10081104A2E0873E",
            //     "driverid": "",
            //     "message": "Hello vishal bhau",
            //     "profilename": "Gautam Prajapati",
            //     "profilepic": "http://cipherbrainstest.com/flashpik/uploads/customer_icon/1602061296_image.jpg",
            //     "user": {
            //       "_id": 1,
            //       "name": "Gautam Prajapati",
            //       "type": "user"
            //     },
            //     "userid": "55"
            //   }

            date: null,
            time: null,
            dispute_id: null,
            status: null,
            order_id: null,
            reason: null,
            userid: null,

            messages: [],
            messageList: []
        };
    }

    // refOn = callback => {
    //     this.ref
    //       .limitToLast(20)
    //       .on('child_added', snapshot => callback(this.parse(snapshot)));
    //   }

    async componentDidMount() {
        console.log(await AsyncStorage.getItem('@userid'))
        this.setState({
            date: this.props.navigation.state.params.date,
            time: this.props.navigation.state.params.time,
            dispute_id: this.props.navigation.state.params.dispute_id,
            status: this.props.navigation.state.params.status,
            order_id: this.props.navigation.state.params.order_id,
            reason: this.props.navigation.state.params.reason,

            userid: await AsyncStorage.getItem('@userid'),
        })


        db.ref(`/dispute_chat/${this.props.navigation.state.params.dispute_id}`).limitToLast(20).on('child_added', (snapshot) => {

            console.log("snapshot--->", snapshot.val().message);
             this.state.messages.unshift(
             // this.setState(previousState => ({
                 // messages: GiftedChat.append(previousState.messages,
                     {
                         _id: snapshot.val().adminid == "" ? snapshot.val().driverid == "" ? 0 : snapshot.val().driverid : snapshot.val().adminid,
                         text: snapshot.val().message,
                         createdAt: snapshot.val().created,
                         user: {
                             _id: snapshot.val().user._id,
                             name: snapshot.val().user.name,
                             avatar: snapshot.val().profilepic,
                         },
                         //image: 'https://facebook.github.io/react/img/logo_og.png',
                     }
                 )
             // }))
            // var joined = this.state.messages.concat({
            //     _id: snapshot.val().adminid == "" ? snapshot.val().driverid == "" ? 0 : snapshot.val().driverid : snapshot.val().adminid,
            //     text: snapshot.val().message,
            //     createdAt: snapshot.val().created,
            //     user: {
            //         _id: snapshot.val().user._id,
            //         name: snapshot.val().user.name,
            //         avatar: snapshot.val().profilepic,
            //     },
            //     //image: 'https://facebook.github.io/react/img/logo_og.png',
            // });
            // this.setState({ messages: joined })

        
        });


        // Get Data from firebase
        // db.ref(`/dispute_chat/${this.props.navigation.state.params.dispute_id}`).on('value', (snapshot) => {

        //     snapshot.forEach((childSnap) => {
        //         //this.state.messages.unshift(childSnap.val())
        //         this.state.messages.unshift(
        //             {
        //                 _id: childSnap.val().adminid == "" ? childSnap.val().driverid == "" ? 0 : childSnap.val().driverid : childSnap.val().adminid,
        //                 text: childSnap.val().message,
        //                 createdAt: childSnap.val().created,
        //                 user: {
        //                     _id: childSnap.val().user._id,
        //                     name: childSnap.val().user.name,
        //                     avatar: childSnap.val().profilepic,
        //                 },
        //                 //image: 'https://facebook.github.io/react/img/logo_og.png',
        //             }
        //         )
        //     });
        // });

    }

    componentWillUnmount() {
        db.ref(`/dispute_chat/${this.props.navigation.state.params.dispute_id}`).off();
    }

    async onSend(messages = []) {

        addItem(
            this.state.dispute_id,
            await AsyncStorage.getItem('@userid'),
            new Date(),
            await AsyncStorage.getItem('@name'),
            await AsyncStorage.getItem('@profile'),
            messages[0].text
        )
        /* this.setState({ messages: [] })
        db.ref(`/dispute_chat/${this.props.navigation.state.params.dispute_id}`).once('value', (snapshot) => {
            // console.log('data---->', snapshot.val())
            snapshot.forEach((childSnap) => {
                // this.state.messageList.unshift(childSnap.val())
                this.state.messageList.unshift(
                    {
                        _id: childSnap.val().adminid == "" ? childSnap.val().driverid : childSnap.val().adminid,
                        text: childSnap.val().message,
                        createdAt: childSnap.val().created,
                        user: {
                            _id: childSnap.val().user._id,
                            name: childSnap.val().user.name,
                            avatar: childSnap.val().profilepic,
                        },
                        //image: 'https://facebook.github.io/react/img/logo_og.png',
                    }
                )
            });

            this.setState({
                messages: this.state.messageList,
                messageList: []
            })


        }); */

    }

    // onPressActionButton = (messages = []) => {
    //     this.setState(previousState => ({
    //         messages: GiftedChat.append(previousState.messages, messages),
    //     }))
    // }

    renderCustomActions = props =>
        Platform.OS === 'web' ? null : (
            <Actions {...props} onSend={this.onSend} />
        )

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
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 }
        );
        //alert('2')
    }

    render() {
        console.log("messageList--> ", this.state.messages);
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <Header
                    // status={"Online"}
                    // switchOn={true}
                    goBack={() => this.props.navigation.navigate('Dispute')}
                    onPress={() => this.toggle()}
                />
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>Dispute Detail</Text>
                </View>

                <View style={styles.orderBox}>
                    <View style={styles.topNavigation}>
                        <View style={styles.leftNavigation}>
                            <Text style={styles.subTitle}>{this.state.date}</Text>
                            <Text style={styles.subTitle}>{this.state.time}</Text>
                        </View>
                        <View style={styles.rightNavigation}>
                            <Text style={[styles.subTitle, { fontFamily: Font.semi_bold }]}>{this.state.dispute_id}</Text>
                            <Text style={[styles.subTitle, { color: 'orange', fontFamily: Font.semi_bold, textTransform: 'capitalize' }]}>{this.state.status}</Text>
                        </View>
                    </View>

                    <View style={styles.nav}>
                        <View style={[styles.leftNav]}>
                            <Text style={styles.heading}>Order Id</Text>
                        </View>
                        <Text>:   </Text>
                        <View style={styles.rightNav}>
                            <Text style={[styles.reason, { color: Color.dark_blue, fontSize: width * 0.04, fontFamily: Font.semi_bold }]}>{this.state.order_id}</Text>
                        </View>
                    </View>

                    <View style={[styles.nav, { paddingBottom: width * 0.03 }]}>
                        <View style={[styles.leftNav]}>
                            <Text style={styles.heading}>Reason</Text>
                        </View>
                        <Text>:   </Text>
                        <View style={[styles.rightNav]}>
                            <Text style={styles.reason}>{this.state.reason}</Text>
                        </View>
                    </View>
                </View>
 
                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={this.state.messages.reverse()}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 1
                        }}
                    // renderActions={messages => this.renderCustomActions(messages)}
                    // renderActions={this.renderCustomActions}
                    // onPressActionButton={message => this.onPressActionButton(message)}
                    />
                    {/* {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />} */}
                </View>
            </View>
        );
    }
}