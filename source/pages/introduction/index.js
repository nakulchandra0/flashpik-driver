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
    PermissionsAndroid
} from 'react-native';

import { Button } from 'react-native-elements';
import ViewPager from '@react-native-community/viewpager';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions, createKeyboardAwareNavigator } from 'react-navigation';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font'
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import { TouchableOpacity } from 'react-native-gesture-handler';

var { width, height } = Dimensions.get('window');
/* map lat long */
const ASPECT_RATIO = width / height;
const LATITUDE = 23.026157;
const LONGITUDE = 72.597413;
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Introduction extends React.PureComponent {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
        }
    }

    _navigate = async () => {
        // Geolocation.getCurrentPosition(
        //     async position => {
        //         // await AsyncStorage.setItem('@latitude',JSON.stringify(position.coords.latitude));
        //         // await AsyncStorage.setItem('@longitude',JSON.stringify(position.coords.longitude)); 
        //     },
        //     error => viewUtils.showToast(error.message),
        //     //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        // );
        // if (await AsyncStorage.getItem('email') == null) {
            this.props.navigation.reset([NavigationActions.navigate({ routeName: 'Signin' })], 0)
        // }
    }

    render() {

        return (

            <ViewPager style={{ flex: 1 }} initialPage={0} scrollEnabled={false} ref={viewPager => { this.viewPager = viewPager }}>
                <View style={styles.container}>
                    <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                    <TouchableHighlight underlayColor={'transparent'} style={styles.skipContainer} onPress={() => this._navigate()}>
                        <Text style={styles.skipText}> SKIP </Text>
                    </TouchableHighlight>
                    <View style={styles.topContainer}>
                        <Image source={require('../../../assets/img/slide_1.png')} style={styles.slideImage} />
                    </View>

                    <View style={styles.middleContainer}>
                        <Text style={styles.title}>ACCEPT A JOB</Text>
                        <Text style={styles.content}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </Text>
                    </View>
                    <View style={styles.btnBtnContainer}>
                        <Button
                            title="Next"
                            titleStyle={styles.buttonTitle}
                            buttonStyle={styles.button}
                            onPress={() => this.viewPager.setPage(1)}
                        />
                    </View>
                    <ImageBackground source={require('../../../assets/img/bottom_layer.png')} style={styles.bottom_view} />
                </View>

                <View style={styles.container}>
                    <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                    <TouchableHighlight underlayColor={'transparent'} style={styles.skipContainer} onPress={() => this._navigate()}>
                        <Text style={styles.skipText}> SKIP </Text>
                    </TouchableHighlight>
                    <View style={styles.topContainer}>
                        <Image source={require('../../../assets/img/slide_2.png')} style={[styles.slideImage,{width: width * 0.8, height: width * 0.7, resizeMode: 'contain', alignItems: 'center'}]} />
                    </View>
                    <View style={styles.middleContainer}>
                        <Text style={styles.title}>REAL TIME TRACKING</Text>
                        <Text style={styles.content}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </Text>
                    </View>

                    <View style={styles.btnBtnContainer}>
                        <Button
                            title="Next"
                            titleStyle={styles.buttonTitle}
                            buttonStyle={styles.button}
                            onPress={() => this.viewPager.setPage(2)}
                        />
                    </View>
                    <ImageBackground source={require('../../../assets/img/bottom_layer.png')} style={styles.bottom_view} />
                </View>

                <View style={styles.container}>
                    <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                    <TouchableHighlight underlayColor={'transparent'} style={styles.skipContainer} onPress={() => this._navigate()}>
                        <Text style={styles.skipText}> SKIP </Text>
                    </TouchableHighlight>
                    <View style={[styles.topContainer]}>
                        <Image source={require('../../../assets/img/slide_3.png')} style={styles.slideImage} />
                    </View>
                    <View style={[styles.middleContaine]}>
                        <Text style={styles.title}>EARN MONEY</Text>
                        <Text style={styles.content}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </Text>
                    </View>
                    <View style={[styles.btnBtnContainer]}>
                        <Button
                            title="Get Start"
                            titleStyle={styles.buttonTitle}
                            buttonStyle={styles.button}
                            onPress={() => this.viewPager.setPage(3)}
                        />
                    </View>
                    <ImageBackground source={require('../../../assets/img/bottom_layer.png')} style={styles.bottom_view} />
                </View>

                <View style={styles.container}>
                    <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                    <TouchableHighlight underlayColor={'transparent'} style={styles.skipContainer} onPress={() => this._navigate()}>
                        <Text style={styles.skipText}> SKIP </Text>
                    </TouchableHighlight>
                    <View style={[styles.topContainer]}>
                        <Image source={require('../../../assets/img/slide_4.png')} style={[styles.slideImage,{width: width * 0.8, height: width * 0.7, resizeMode: 'contain', alignItems: 'center'}]} />
                    </View>
                    <View style={styles.middleContainer}>
                        <Text style={styles.title}>ENABLE YOUR LOCATION</Text>
                        <Text style={styles.content}>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </Text>
                    </View>
                    <View style={styles.btnBtnContainer}>
                        <Button
                            title="USE MY LOCATION"
                            titleStyle={styles.buttonTitle}
                            buttonStyle={styles.button}
                            onPress={() => this._navigate()}
                        />
                    </View>
                    <ImageBackground source={require('../../../assets/img/bottom_layer.png')} style={styles.bottom_view} />
                </View>
            </ViewPager>
        );
    }
}



