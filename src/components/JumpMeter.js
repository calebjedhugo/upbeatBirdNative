import React, {Component} from 'react'
import {Text, View, Dimensions} from 'react-native'
import styles from '../styles.js'

export default class JumpMeter extends Component{
  render(){
    return (
      <View style={[styles.jumpMeter]} nativeId="jumpMeter" style={[styles.absoluteInFront, styles.jumpMeter]}>
        <Text style={[styles.jumpMeterText]}>Jump Meter</Text>
      </View>
    )
  }
}
