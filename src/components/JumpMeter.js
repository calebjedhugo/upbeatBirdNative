import React, {Component} from 'react'
import {Text, View, Dimensions} from 'react-native'
import styles from '../styles.js'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const maxHeight = windowHeight / 3

export default class JumpMeter extends Component{

  render(){
    const {jumpPerc} = this.props
    return (
      <View style={[styles.absoluteInFront, {
          left: 20,
          bottom: 2,
          width: 20,
          transform: [{rotate: '270deg'}]
        }]}>
        <View style={[ {
          overflow: 'hidden',
          height: .06 * windowWidth,
          width: (jumpPerc || 1) * maxHeight,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'black',
          backgroundColor: 'red',
        }]}>
          <Text numberOfLines={1} style={{
            fontSize: 16,
            paddingLeft: 15,
          }}>Jump Meter</Text>
        </View>
      </View>
    )
  }
}
