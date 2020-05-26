import React, {Component} from 'react'
import {Text} from 'react-native'
import styles from '../styles.js'

export default class NewGameButton extends Component {
  render(){
    const {beefBorderWidth, inGameScreen} = this.props
    return (
      <Text onPress={inGameScreen} style={[
          {borderWidth: beefBorderWidth},
          styles.menuElement,
          styles.switchScreenButton
        ]}>
        {'Start New Game'}
      </Text>
    )
  }
}
