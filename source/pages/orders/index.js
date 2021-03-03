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
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';

import moment from 'moment';

/* common components */
import GeneralStatusBar from '../../component/statusbar/index';
import Color from '../../component/color';
import Font from '../../component/font';
import Header from '../../component/header';
import styles  from './styles';

var { width, height } = Dimensions.get('window');

export default class Orders extends Component {
    constructor() {
        super();
        this.state = {
            Default_Rating: 2,
            Max_Rating: 5,
            orders: [
                {
                    "date": "03/02/2020",
                    "status": "On the way",
                    "name": "Nakul Chandra",
                    "rate": 4,
                    "profile": require('../../../assets/img/user.png'),
                    "pick": "46, Angle Arcade, Opp Kalupur Com Bank, Sold Rd",
                    "drop": "46, ABC Tower, Gurukul road, Ghatlodia"
                },
                {
                    "date": "01/02/2020",
                    "status": "Delivered",
                    "name": "Nakul Chandra",
                    "rate": 3,
                    "profile": require('../../../assets/img/user.png'),
                    "pick": "46, Angle Arcade, Opp Kalupur Com Bank, Sold Rd",
                    "drop": "46, ABC Tower, Gurukul road, Ghatlodia"
                },
                {
                    "date": "31/01/2020",
                    "status": "Cancelled",
                    "name": "Nakul Chandra",
                    "rate": 2,
                    "profile": require('../../../assets/img/user.png'),
                    "pick": "46, Angle Arcade, Opp Kalupur Com Bank, Sold Rd",
                    "drop": "46, ABC Tower, Gurukul road, Ghatlodia"
                },
              
             
            ]
        };
        
        this.Star = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
        this.Star_With_Border = 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';
    }
    
    UpdateRating(key) {
        this.setState({ Default_Rating: key });
    }
    
    _navigate = index => { 
        this.props.navigation.navigate('DetailsTrack', {
            visible: false,
        })  
    }

    renderItem({ item, index }) {
        const lengthArray = this.state.orders.length;
        let React_Native_Rating_Bar = [];
        for (var i = 1; i <= this.state.Max_Rating; i++) {
            React_Native_Rating_Bar.push(
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={i}
                    onPress={this.UpdateRating.bind(this, i)}>
                    <Image
                        style={styles.starImage}
                        source={
                            i <= item.rate
                            ? { uri: this.Star }
                            : { uri: this.Star_With_Border }
                        }
                    />
                </TouchableOpacity>
            );
        }
        return (
            <TouchableWithoutFeedback underlayColor="transparent" onPress={()=>this._navigate()}>
                <View style={lengthArray -1 == index ? [styles.orderBox, { marginBottom: width * 0.035}] : styles.orderBox } >
                    <View style={[styles.navigation, { borderBottomWidth: 1 } ]}>
                        <View style={styles.leftNavigation}>
                            <Text style={styles.date}>Today</Text>
                            <Text style={[styles.orderStatus, { color: item.status == "Cancelled" ? Color.red : item.status == "Delivered" ? Color.green : 'orange'}]}>{item.status}</Text>
                        </View>
                        <View style={styles.rightNavigation}>
                            
                            <View style={styles.rightNav}>
                                <Text style={styles.name}>Nakul Chandra</Text>
                                <View style={styles.childView}>{React_Native_Rating_Bar}</View>   
                            </View>
                            <Image source={require('../../../assets/img/user.png')} style={styles.userImage}/> 
                        </View>
                    </View>  
                    <View style={[styles.locationNav, { marginTop: 5 }]}>
                        <View style={styles.timeline}>
                            <View style={styles.line}>
                                <View style={[styles.topLine, styles.hiddenLine]} />
                                <View style={styles.bottomLine}  />
                            </View>
                            <View style={[styles.dot, { backgroundColor: Color.green }]} />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.locationTitle}>{item.pick}</Text>    
                        </View>
                    </View>
                    <View style={[styles.locationNav, { marginBottom: 5 }]}>
                        <View style={styles.timeline}>
                            <View style={styles.line}>
                                <View style={styles.topLine} />
                                <View style={[styles.bottomLine, styles.hiddenLine]}  />
                            </View>
                            <View style={[styles.dot, { backgroundColor: Color.red }]} />
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.locationTitle}>{item.drop}</Text>    
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }   

    render() {
        return (
            <View style={styles.container}>
                <GeneralStatusBar backgroundColor={Color.white} barStyle="dark-content" />
                <Header 
                    onMenu={() => this.props.navigation.toggleDrawer()}
                    onNotification={() => this.props.navigation.navigate('Notification')}
                /> 
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>My Orders</Text> 
                </View>

                 
                <FlatList
                    refreshing={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.orders}
                    extraData={this.state}
                    numColumns={1}
                    renderItem={this.renderItem.bind(this)}
                />
            
            </View>
        );
    }
}
 
