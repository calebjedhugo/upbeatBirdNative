import React, {Component} from 'react'
import {Text, View, Dimensions, Button} from 'react-native'
import ModeSelector from "./ModeSelector"
import NewGameButton from './NewGameButton'
import styles from '../styles.js'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default class MainMenu extends Component {
  render() {
    const {inGameScreen, statsScreen, beefBorderWidth, leanBorderWidth, difficulty, practice, mode, setDifficulty, setMode, titleColor} = this.props

    return (
      <View style={[styles.centered, styles.upperMidMenu, {alignItems: 'center'}]}>
        <Text style={[{
            fontSize: windowHeight / 12,
            color: titleColor
          }, styles.gameMenuTitle]}>
          {'Upbeat Bird'}
        </Text>
        <View style={[styles.generalMenu]}>
          <View style={[styles.inlineBlock]}>
            <ModeSelector select={() => setDifficulty('easy')} selected={difficulty === 'easy'} name="Easy"
                className="difficultySelectors"/>
            <ModeSelector select={() => setDifficulty('normal')} selected={difficulty === 'normal'} name="Normal"
                className="difficultySelectors"/>
            <ModeSelector select={() => setDifficulty('hard')} selected={difficulty === 'hard'} name="Hard"
                className="difficultySelectors"/>
          </View>
          <View style={[styles.inlineBlock]}>
            <Text onPress={() => setDifficulty('practice')} style={[{backgroundColor: practice ? '#16b516a3' : '#ffffff6b'}, styles.menuElement]}>
              {'Practice Mode'}
            </Text>
          </View>
        </View>
        <View style={[styles.inlineBlock]}>
          <View nativeId='modemenu' style={[{display: 'flex', borderWidth: leanBorderWidth}, styles.inlineBlock, styles.modemenu]}>
            <ModeSelector select={() => setMode('straight')} selected={mode === 'straight'} name="Straight"
                className="modeSelectors"/>
            <ModeSelector select={() => setMode('triplets')} selected={mode === 'triplets'} name="Triplets"
                className="modeSelectors"/>
            <ModeSelector select={() => setMode('swing')} selected={mode === 'swing'} name="Swing"
                className="modeSelectors"/>
          </View>
        </View>
        <View>
          <NewGameButton inGameScreen={inGameScreen} beefBorderWidth={beefBorderWidth}/>
          <Text onPress={statsScreen}
              className="menuElement switchScreenButton"
              style={[{borderWidth: beefBorderWidth}, styles.menuElement, styles.switchScreenButton]}>{'Stats'}
          </Text>
        </View>
      </View>
    )
  }
}
