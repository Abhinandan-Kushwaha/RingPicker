import React from 'react';
import {
  View,
} from 'react-native';
import RingPicker from './src/RingPicker';
import STYLES from './src/styles';
export default class App extends React.PureComponent {
  render() {
    return (
      <View style={STYLES.appContainer}>
        <RingPicker />
      </View>
    )
  }
}