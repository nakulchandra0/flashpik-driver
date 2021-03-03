import * as React from 'react';
import { 
    Alert, 
    Image, 
    StyleSheet, 
    Text, 
    Button, 
    View, 
    Dimensions 
} from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';
 
var { width, height } = Dimensions.get('window');
 
export default class Utility extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    showAlert(title, message, showDialog ) {  
        Alert.alert(
            title,
            message,
            [
                { text: 'Ok', onPress: () => console.log('Ok Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    showToast(message) {
        Toast.show(message);
    }

    isInternetConnected(callBack) { 
        NetInfo.fetch().then(state => {  
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (callBack != null) {
                callBack(state.isConnected);
            } else {
                alert()
            }
        });
    }
}

 