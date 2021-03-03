import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Color from '../../component/color';
import Font from '../../component/font';

var { width, height } = Dimensions.get('window');

export default class RadioButtons extends Component {
	state = {
		value: null,
	};

	render() {
		const { options } = this.props;
		const { value } = this.state;

		return (
			<View style={styles.container}>
				{options.map(item => {
					return (
						<View key={item.key} style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.circle}
								onPress={() => {
									this.setState({
										value: item.key,
									});
								}}
							>
								{value === item.key && <View style={styles.checkedCircle} />}
							</TouchableOpacity>
                            <Text style={styles.txt}>{item.text}</Text>
						</View>
					);
				})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: width * 0.9,
        paddingTop: width * 0.02
    },

	buttonContainer: {
        flexDirection: 'row',
        width: width * 0.3,
        alignItems: 'center',
	},

    txt: {
        fontFamily: Font.Bold,
        fontSize: width * 0.05,
        paddingLeft: width * 0.03,
    },

	circle: {
		height: width * 0.06,
		width:  width * 0.06,
		borderRadius: width * 1,
		borderWidth: 1,
		borderColor: Color.dark_blue,
		alignItems: 'center',
		justifyContent: 'center',
	},
  
	checkedCircle: {
		width: width * 0.04,
		height: width * 0.04,
		borderRadius: width * 1,
		backgroundColor: Color.dark_blue,
	},
});
