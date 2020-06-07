import React, {Component} from 'react'
import {Text, View, Dimensions, Image, Button, ImageBackground} from 'react-native'
import LocalStorageManager from "./src/storage"
import StatsTable from "./src/components/StatsTable"
import InGameUI from './src/components/InGameUI'
import MainMenu from './src/components/MainMenu'
import BassLogic from './src/soundLogic/bassLogic'
import DrumLogic from './src/soundLogic/drumLogic'
import styles from './src/styles.js'

import {Audio} from 'expo-av'
Audio.setAudioModeAsync({playsInSilentModeIOS: true})
Sound.setCategory('Playback');

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default class App extends Component {
  constructor(props){
    super(props);
    this.storage = new LocalStorageManager()
    this.state = {
      practice: false,
      difficulty: 'easy',
      mode: 'straight',
      screen: 'menu'
    }
    this.bass = new BassLogic()
    this.drum = new DrumLogic({mode: 'straight'})
    this.switchScreenTimeout = undefined;
    this.waitCount = 0;
  }

  componentDidUpdate(prevProps){
    const {mode} = this.state
    if(prevProps.mode !== mode){
      this.drum = new DrumLogic({mode: mode})
    }
  }

  initFromStorage = async () => {
    //Load last selected mode.
    let mode = await this.storage.mode
    mode = mode || 'straight'
    this.setState({mode: mode})

    //Load last selected difficulty.
    let difficulty = await this.storage.difficulty
    difficulty = difficulty || 'easy'
    this.setState({difficulty: difficulty})

    this.practice = this.storage.practice
    this.practice = this.practice || false
  }

  preventDefault(e){e.preventDefault()}

  setDifficulty = (newDifficulty) => {
      //Setting practice mode is here so that we can throttle it with difficulty.
      //The user clicking through too quickly was causing the css transition to skip.
      if(newDifficulty === 'practice'){
          this.togglePractice();
      }
      else{
        this.setState({difficulty: newDifficulty}); //tell the display
        this.storage.difficulty = newDifficulty //persist this
      }
  }

  togglePractice = (practice) => {
    practice = practice !== undefined ? practice : !this.state.practice;
    this.setState({
      practice: practice,
      highScoreLabelText: practice ? "Practice Mode" : "High Score: "
    })
    this.storage.practice = practice //persist this
  }

  toggleStats = () => {
      let difficultyArray = ["easy", "normal", "hard"], newIdx;
      newIdx = (difficultyArray.indexOf(this.state.difficulty) + 1) % difficultyArray.length;
      let newDifficulty = difficultyArray[newIdx]
      this.setState({difficulty: newDifficulty});
      this.storage.difficulty = newDifficulty
  }

  setMode = (newMode) => {
      this.setState({mode: newMode}); //tell the display
      this.storage.mode = newMode //persist it
  }

  get background(){
    if(!this.state.practice){
      switch(this.state.difficulty){
        case "easy":
          return require("./assets/backgrounds/daytime.png");
        case "normal":
          return require("./assets/backgrounds/sunset.png");
        case "hard":
          return require("./assets/backgrounds/nighttime.png");
        default: console.error(this.state.difficulty + " is not a valid difficulty.");
      }
    } else {
      return require("./assets/backgrounds/sunrise.png");
    }
  }

  get titleColor(){
    if(!this.state.practice){
      switch(this.state.difficulty){
        case "easy":
        case "normal":
          return 'black';
        case "hard":
          return 'lightblue';
        default: console.error(this.state.difficulty + " is not a valid difficulty.");
      }
    } else {
      return '#000000';
    }
  }

  get tryAgainText(){
      if(this.state.practice) return "Start a Non-Practice Round";
      else return 'Try Again';
  }

  inGameScreen = async () => {
    await this.bass.ready()
    this.setState({screen: 'inGame'})
  }

  render() {
    const {mode, highScoreLabelText, cyberBirdClip, birdDiameter, inGameDisplay, scoreLabel2Class, dataFontSize, difficulty, menuFontSize, tableFontSize, screen} = this.state;
    const beefBorderWidth = 3
    const leanBorderWidth = 1

    return (
      <View
        nativeId="gameWindow"
        style={{
          height: windowHeight,
          width: windowWidth,
        }}
        onContextMenu={this.preventDefault}
        onTouchMove={this.preventDefault}>
        <ImageBackground source={this.background} style={{alignItems: 'center', height: Dimensions.get('window').height, width: Dimensions.get('window').width}}>
          {screen === 'menu' ?
            <MainMenu
              {...this.state}
              statsScreen={() => this.setState({screen: 'stats'})}
              inGameScreen={this.inGameScreen}
              setDifficulty={this.setDifficulty}
              setMode={this.setMode}
              titleColor={this.titleColor}
              beefBorderWidth={beefBorderWidth}
              leanBorderWidth={leanBorderWidth}
            /> : null}
          {screen === 'stats' ? <View nativeId="stats" className="centered" style={[styles.absoluteInFront, styles.upperMidMenu, {fontSize: menuFontSize,
                                                      opacity: statsMenuOpacity}, {transition: 'opacity 1s'}]}>
              <Text style={{fontSize: windowHeight / 12, color: this.titleColor}}>Upbeat Stats</Text>
              <StatsTable soundLogic={this.soundLogic} difficulty={difficulty}
                          beefBorderWidth={beefBorderWidth}
                          leanBorderWidth={leanBorderWidth}
                          toggleStats={this.toggleStats}
                          fontSize={tableFontSize} />
              <Button title={'Main Menu'} nativeId="menuButton" onPress={() => this.setState({screen: 'menu'})}
                  className="menuElement switchScreenButton"
                  style={{borderWidth: beefBorderWidth, margin: '3% 0'}} />
              <Button title={this.tryAgainText} nativeId="tryAgain"
                onPress={() => {
                  this.togglePractice(false)
                  this.setState({screen: 'inGame'})}}
                style={[{borderWidth: beefBorderWidth, margin: '3% 0'}, style.menuElement, styles.switchScreenButton]}>
              </Button>
          </View> : null}
          {screen === 'inGame' ?
            <InGameUI
              titleColor={this.titleColor}
              statsScreen={() => this.setState({screen: 'stats'})}
              {...this.state}
              bass={this.bass}
              drum={this.drum} /> :
            null}
        </ImageBackground>
      </View>
    )
  }
}
