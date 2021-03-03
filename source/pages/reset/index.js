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
    ScrollView
} from 'react-native';

import { Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { BoxShadow } from 'react-native-shadow';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font'
import styles from './styles';
import ApiService from "../../config/ApiService";
import Utility from "../../config/utility";
import Config from '../../config/config';

var { width, height } = Dimensions.get('window');

export default class Signup extends React.PureComponent {
    constructor(props) {
        super(props);
        apiService = new ApiService();
        viewUtils = new Utility();
        this.state = {
            email: null,
            isLoading: false
        }
    }

    _navigate = () => {

        const { email } = this.state;

        !email ? this.setState({ emailError: "Email required" }) : "";

        this.setState({ isLoading: true }, async () => {
            var url = Config.baseUrl + Config.reset;
            var reqJson = {
                email: this.state.email,
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
                        viewUtils.showToast(response.message.trim());
                    }
                });
        })

    }

    render() {
        const shadowOpt = {
            width: width - width * 0.1,
            height: width * 0.47,
            color: Color.dark_blue,
            border: 15,
            radius: 12,
            opacity: 0.4,
            x: 0,
            y: 0,
            style: {
                marginTop: width * 0.6,
                marginBottom: width * 0.001,
            }
        }
        return (
            <View style={styles.container}>
                <Image source={require('../../../assets/img/screen_bg.png')} style={styles.imgBg} />
                <GeneralStatusBar backgroundColor={Color.transparent} barStyle="light-content" />
                <Spinner visible={this.state.isLoading} textContent={''} />

                <View style={styles.overlay}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={{
                            width: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                        showsVerticalScrollIndicator={false}
                    >

                        <BoxShadow setting={shadowOpt}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.title}>Forget Password</Text>
                                <Text style={styles.info}>Please enter your email to receive a link to create a new password via email.</Text>
                                <View style={styles.textContainer}>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        style={styles.textBox}
                                        autoCapitalize="none"
                                        placeholder="Enter Email"
                                        placeholderTextColor={Color.black}
                                        keyboardType="email-address"
                                        value={this.state.email}
                                        onChangeText={(value) => this.setState({ email: value })}
                                        ref={input => { this.email = input }}
                                        onFocus={() => this.setState({ emailError: null })}
                                        
                                        //removeClippedSubviews={false}
                                        caretHidden
                                        autoCorrect={false}
                                    />
                                    {this.state.emailError &&
                                        <Text style={styles.error}>{this.state.emailError}</Text>
                                    }
                                </View>
                            </View>
                        </BoxShadow>

                        <View style={styles.buttonContainer}>
                            <Button
                                title="Send"
                                titleStyle={styles.buttonTitle}
                                buttonStyle={styles.button}
                                onPress={() => this._navigate()}
                            />
                        </View>

                        <View style={styles.bottomContainer}>
                            <Text style={styles.alreadyTitle}>Back to
                                <Text style={{ color: Color.dark_blue }} onPress={() => this.props.navigation.navigate('Signin')}> Login</Text>
                            </Text>
                        </View>

                    </KeyboardAwareScrollView>
                </View>
            </View>
        );
    }
}



