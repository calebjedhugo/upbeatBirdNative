import React, {Component} from 'react'
import {Text, View, Dimensions, ImageBackground} from 'react-native'
import Bird from './Bird'
import JumpMeter from './JumpMeter'
import styles from '../styles.js'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default class InGameUI extends Component {
  state = {
    started: false
  }

  render() {
    const {started} = this.state
    const {inGameOpacity, highScoreLabelText, cyberBirdClip, birdDiameter, scoreLabel2Class, titleColor} = this.props
    return (
      <View nativeId="inGameElements" style={{
        opacity: inGameOpacity,
        width: windowWidth,
        height: windowHeight,
        transition: 'opacity 1s'
      }}>
        <Bird started={started} start={() => this.setState({started: true})}/>
        <JumpMeter />
        <View nativeId="scoreLabel" style={[styles.absoluteInFront]}>
          <Text nativeId="highScoreLabel" style={[{color: titleColor}]}>{highScoreLabelText}<Text style={[styles.inlineBlock]}>0</Text></Text>
          <Text nativeId="scoreLabel2" className={scoreLabel2Class} style={[{color: titleColor}]}>Score: <Text style={[styles.inlineBlock]}>0</Text></Text>
        </View>
        <Text nativeId="bpmLabel" style={[styles.absoluteInFront, {color: titleColor}]}>BPM: <Text style={[styles.inlineBlock]}>56</Text></Text>
      </View>
    )
  }
}
