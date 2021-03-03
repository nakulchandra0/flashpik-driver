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
    Keyboard,
    TouchableWithoutFeedback,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import Spinner from 'react-native-loading-spinner-overlay';
import { Button, Input, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
// import RNUpiPayment from 'react-native-upi-payment';
import paytm from 'react-native-paytm';

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
var paytmEvent = null;

const paytmConfig = {
    MID: Config.mid_key,
    WEBSITE: 'DEFAULT',
    CHANNEL_ID: 'WAP',
    INDUSTRY_TYPE_ID: 'Retail',
    CALLBACK_URL: 'https://pguat.paytm.com/paytmchecksum/paytmCallback.jsp'
};
class Details extends React.Component {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();

        this.state = {
            // paymentList: [
            //     {
            //         "date": "Mon 17 Feb 2020",
            //         "payTo": "Pay to Admin",
            //         "transactionId": "#01234567890",
            //         "total": "300",
            //     },
            //     {
            //         "date": "Sun 16 Feb 2020",
            //         "payTo": "Admin Pay to You",
            //         "transactionId": "#01234567890",
            //         "total": "500",
            //     },
            //     {
            //         "date": "Fri 14 Feb 2020",
            //         "payTo": "Admin Pay to You",
            //         "transactionId": "#01234567890",
            //         "total": "500",
            //     },
            //     {
            //         "date": "Wed 12 Feb 2020",
            //         "payTo": "Pay to Admin",
            //         "transactionId": "#01234567890",
            //         "total": "500",
            //     },
            // ],
            latitude: null,
            longitude: null,

            buttonTitle: null,
            showBtn: false,
            paymentData: null,
            type: null,
            total: 0,
            driverIncome: 0,
            transactionInfo: null,

        }
    }

    async componentDidMount() {
        this.setState({ isLoading: true }, async () => {
            // Show button
            var url = Config.baseUrl + Config.payrequestbtn;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
            };
            apiService.executeFormApi(
                url,
                "POST",
                JSON.stringify(reqJson),
                async (error, response) => {

                    if (error !== "") {
                        this.setState({ isLoading: false })
                        viewUtils.showToast(error);
                    }
                    console.log('response---->', response)

                    if (response !== null && response !== "") {
                        this.setState({ isLoading: false })
                        if (response.status == "true") {
                            if (response.btn == 'payto_admin') {
                                this.setState({
                                    type: response.btn,
                                    paymentData: response.data,
                                    showBtn: true,
                                    buttonTitle: "Pay to Admin",
                                    total: response.data.request,
                                    driverIncome: response.data.driverIncome,
                                })
                            }
                            if (response.btn == 'request') {
                                this.setState({
                                    type: response.btn,
                                    paymentData: response.data,
                                    showBtn: true,
                                    buttonTitle: "Request",
                                    total: response.data.request,
                                    driverIncome: response.data.driverIncome,

                                })
                            }
                        } else {
                            viewUtils.showToast(response.message)
                        }
                    }
                });

            // Show list of payment transaction
            var url = Config.baseUrl + Config.paymentlist;
            var reqJson = {
                driverid: await AsyncStorage.getItem('@userid'),
            };
            apiService.executeFormApi(
                url,
                "POST",
                JSON.stringify(reqJson),
                async (error, response) => {

                    if (error !== "") {
                        this.setState({ isLoading: false })
                        viewUtils.showToast(error);
                    }

                    if (response !== null && response !== "") {
                        this.setState({ isLoading: false })
                        console.log('response-->', response)
                        if (response.status == "true") {
                            console.log('response -->', response)

                            if (response.status == 'true') {
                                this.setState({
                                    paymentList: response.data
                                })
                            }
                            // if(response.btn == 'payto_admin') {
                            //     this.setState({ 
                            //         type: response.btn,
                            //         paymentData: response.data,
                            //         showBtn: true, 
                            //         buttonTitle: "Pay to Admin",
                            //         total: response.data.request,
                            //     })
                            // }
                            // if(response.btn == 'request') {
                            //     this.setState({ 
                            //         type: response.btn,
                            //         paymentData: response.data,
                            //         showBtn: true, 
                            //         buttonTitle: "Request",
                            //         total: response.data.request,
                            //     })
                            // }
                        } else {
                            viewUtils.showToast(response.message)
                        }
                    }
                });

        });
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.paymentList.length;
        // return (
        //     <View>
        //         <View style={styles.dateContainer}>
        //             <Text style={styles.date}> {item.date} </Text>
        //         </View>
        //         <View style={styles.transactionDetailContainer}>
        //             <View style={styles.transactionDetail}>
        //                 <Text style={styles.detailTitle}> {item.payTo} </Text>
        //                 <Text style={styles.id}> Transaction Id : {item.transactionId} </Text>
        //             </View>
        //             <View style={styles.moneyContainer}>
        //                 <Text style={styles.money}>₹ {item.total} </Text>
        //             </View>
        //         </View>
        //     </View>
        // );

        return (
            <View>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}> {item.date} </Text>
                </View>
                <View style={styles.transactionDetailContainer}>
                    <View style={styles.transactionDetail}>
                        <Text style={styles.detailTitle}> {item.message} </Text>
                        <Text style={styles.id}> Transaction Id : {item.transaction_id} </Text>
                    </View>
                    <View style={styles.moneyContainer}>
                        <Text style={styles.money}>₹ {item.request_amount} </Text>
                    </View>
                </View>
            </View>
        );
    }

    // componentWillUnmount() {
    //     Geolocation.clearWatch(this.watcher);
    // }

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
                    // var location = {
                    //     lat: position.coords.latitude,
                    //     lng: position.coords.longitude,
                    // };

                    // Geocoder.geocodePosition(location).then(res => {
                    //     //console.log(res[0].formattedAddress)
                    //     this.setState({ locationName: res[0].subLocality })
                    // })
                    //     .catch(err => console.warn(err))

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

    payment = async () => {
        // console.log('data--->',this.state.paymentData)
        // alert('hi')
        if (this.state.type == "payto_admin") {
            this._startPayment()
        } else if (this.state.type == "request") {
            //this.callsuccessapi()
        }

    }

    async _startPayment() {

        this.setState({ isLoading: true});

        var url = 'http://cipherbrainstest.com/paytm/generate_checksum.php';
      
        var body = JSON.stringify({
            user: await AsyncStorage.getItem('@userid'),
            mid: paytmConfig.MID,
            orderId: 'ORDERID_98765',
            email: await AsyncStorage.getItem('@email'),
            mobile: await AsyncStorage.getItem('@phone'),
            amount: this.state.paymentData.request
        });

        fetch(url, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: body
        })
            .then((responseJson) => responseJson.json())
            .then((response) => {
                console.log('response =====>', response)

                if (response.responseCode == 401) {
                    this.setState({ isLoading: false });
                    console.log('RESPONSE', response);
                    viewUtils.showToast('Unauthorized REST API request');
                }
                else {
                    this.setState({ isLoading: false });
                    //this response from REST endpoint will contain all the required data to start payment
                    //please check php file for sample
                    // var data = response.paramList;
                    var data = response.data;
                    console.log('data =====>', data)
                    
                    var details = {
                        mode: 'Production', // 'Staging' or 'Production'
                        MID: data.MID,
                        INDUSTRY_TYPE_ID: data.INDUSTRY_TYPE_ID, //Prod
                        WEBSITE: data.WEBSITE, //prod
                        CHANNEL_ID: data.CHANNEL_ID,
                        TXN_AMOUNT: data.TXN_AMOUNT,
                        ORDER_ID: data.ORDER_ID,
                        EMAIL: data.EMAIL,
                        MOBILE_NO: data.MOBILE_NO,
                        CUST_ID: data.CUST_ID,
                        CHECKSUMHASH: data.CHECKSUMHASH,
                        CALLBACK_URL: data.CALLBACK_URL
                    };
                    console.log(details);
                    paytm.startPayment(details);
                }
            })
            .catch((error) => {
                alert(JSON.stringify(error.message))
                this.setState({ isLoading: false, processing: false });
                //Alert.alert('Error', 'Unable to initiate transaction, please try again');
            });
    }

    _handlePaytmResponse(body) {

        // {
        //     "BANKNAME": "WALLET",
        //     "BANKTXNID": "151045425568",
        //     "CHECKSUMHASH": "Zp/szo/usxuLgZ8Fj//LtOSNO8dqDXpaWJxryOW/dyexRebcWTMXI09PPGeoPdkbb/hx5mo3Eh7xpqJ466IDXCtrG02slzvkGsMp6hEjhCE=",
        //     "CURRENCY": "INR",
        //     "GATEWAYNAME": "WALLET",
        //     "MID": "ybXZbd37909828396443",
        //     "ORDERID": "ORDER802356049715621",
        //     "PAYMENTMODE": "PPI",
        //     "RESPCODE": "01",
        //     "RESPMSG": "Txn Success",
        //     "STATUS": "TXN_SUCCESS",
        //     "TXNAMOUNT": "1.00",
        //     "TXNDATE": "2021-01-12 14:54:07.0",
        //     "TXNID": "20210112111212800110168677374058969",
        //     "status": "Success"
        //   }
        //alert('paytm response')
        //console.log("CHECKSUMHASH ", body.CHECKSUMHASH);

        if (body.STATUS == "TXN_SUCCESS") {
            console.log(body);
            this.setState({ transactionInfo: body.TXNID })
            viewUtils.showToast('Transaction successful');
            this.callsuccessapi();
        } else {
            console.log(body); //check paytm response for any fail case message and details
            viewUtils.showToast('Paytm payment fail');
            //Alert.alert('Failed', result);
        }
        this.setState({ processing: false, payment_text: '' });

    }


    callsuccessapi = async () => {
        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.payrequest;
            var transactionInfo = this.state.transactionInfo == null ? "" : this.state.transactionInfo
            var reqJson = {
                type: this.state.type,
                driverid: await AsyncStorage.getItem('@userid'),
                order_ids: this.state.paymentData.total_order_ids,
                total_amount: this.state.paymentData.total_order_price,
                total_cash_amount: this.state.paymentData.total_order_cash_price,
                total_online_amount: this.state.paymentData.total_order_online_price,
                driver_income: this.state.paymentData.driverIncome,
                admin_income: this.state.paymentData.admin_income,
                request_amount: this.state.paymentData.request,
                transaction_id: transactionInfo,
            };
            // alert(JSON.stringify(reqJson))
            apiService.executeFormApi(
                url,
                "POST",
                JSON.stringify(reqJson),
                async (error, response) => {

                    if (error !== "") {
                        this.setState({ isLoading: false })
                        viewUtils.showToast(error);
                    }

                    if (response !== null && response !== "") {
                        this.setState({ isLoading: false })
                        //console.log('response-->',response)
                        if (response.status == "true") {
                            if (response.btn == 'payto_admin') {
                                this.setState({
                                    showBtn: true,
                                    buttonTitle: "Pay to Admin"
                                })
                            }
                            if (response.btn == 'request') {
                                this.setState({
                                    showBtn: true,
                                    buttonTitle: "Request"
                                })
                            }
                        } else {
                            viewUtils.showToast(response.message)
                        }
                    }
                });
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <GeneralStatusBar backgroundColor={this.state.isModalVisible ? Color.transparent : Color.white} barStyle="dark-content" />
                    <Spinner visible={this.state.isLoading} textContent={''} />

                    <Header
                        // status={"Online"}
                        // switchOn={true}
                        onMenu={() => this.props.navigation.toggleDrawer()}
                        onPress={() => this.toggle()}
                    />
                    <View style={styles.mainContainer}>
                        <Text style={styles.title}>Payment</Text>
                    </View>

                    {/* <View style={styles.totalPaymentContainer}>
                        <Text style={styles.totalTxt}> Total Balance</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.symbol}> ₹ </Text>
                            <Text style={styles.totalCount}>{this.state.total}</Text>
                        </View>
                    </View> */}
                    <View style={styles.totalPaymentContainer}>
                        <Text style={styles.totalTxt}> Total Driver Income</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.symbol}> ₹ </Text>
                            <Text style={styles.totalCount}>{this.state.driverIncome}</Text>
                        </View>
                    </View>

                    <View style={{ ...styles.totalPaymentContainer, marginTop: 1 }}>
                        <Text style={styles.totalTxt}> Ledger</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.symbol}> ₹ </Text>
                            <Text style={styles.totalCount}>{this.state.total}</Text>
                        </View>
                    </View>

                    {this.state.showBtn == true &&
                        <View style={styles.buttonContainer}>
                            <TouchableWithoutFeedback onPress={() => this.payment()} >
                                <View style={styles.btnContainer}>
                                    <Text style={styles.buttonTitle}>{this.state.buttonTitle}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    }
                    <FlatList
                        refreshing={true}
                        keyExtractor={(item, index) => index.toString()}
                        data={this.state.paymentList}
                        extraData={this.state}
                        numColumns={1}
                        renderItem={this.renderItem.bind(this)}
                    />

                </ScrollView>
            </View>
        );
    }
}

export default Details;