import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View, Dimensions } from 'react-native';
import Color from './color';
import Font from './font';
var { width, height } = Dimensions.get('window');

const propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

class CustomCallout extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.bubble}>
          <View style={styles.amount}>{this.props.children}</View>
        </View>
       
       
      </View>
    );
  }
}

CustomCallout.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },

  bubble: {
    //width: width - 50,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: Color.light_blue,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: Color.light_blue,
    borderWidth: 0.5,
    marginBottom:25,
  },
  amount: {
    flex: 1,
    fontFamily: Font.regular
  },
   
});

export default CustomCallout;