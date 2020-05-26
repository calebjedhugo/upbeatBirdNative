import React, {Component} from 'react'
import {Text, View} from 'react-native'
import styles from '../styles.js'

export default class ModeSelector extends Component {
  render(){
    const {selected, className} = this.props

    return (
      <Text
        style={[styles[className], styles.menuElement, {backgroundColor: selected ? '#16b516a3' : '#ffffff6b'}]}
        onPress={this.props.select}>
          {this.props.name}
      </Text>
    )
  }
}
