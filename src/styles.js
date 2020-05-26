import { StyleSheet } from 'react-native'
import {Dimensions} from 'react-native'
const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default StyleSheet.create({
  centered: {
    position: 'absolute'
  },
  left: {
    position: 'absolute',
    left: 0,
  },
  right: {
    position: 'absolute',
    right: 0,
  },
  gameWindow: {
      borderWidth: 3,
      borderColor: 'darkred',
      borderStyle: 'solid',
      backgroundColor: 'lightblue',
      overflow: 'hidden',
      // backgroundSize: 'cover',
      // backgroundRepeat: 'no-repeat',
      // transition: 'background-image .5s',
  },
  gameWindowMain: {
      backgroundColor: 990000,
  },
  loadScreen: {
      backgroundColor: 'black',
  },
  cyberBird: {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderRadius: 100,
      // clip: 'rect(auto, auto, auto, auto)',
  },
  imgBird: {
      position: 'absolute',
      height: '200%',
      width: '1400%',
      top: '-40%',
      left: '-65%',
      // backgroundImage: 'url("./bird.png")',
      // backgroundPosition: '0px 0px',
      // backgroundSize: '100%',
  },
  ingamePost: {
      backgroundColor: 'brown',
      position: 'absolute',
  },
  absoluteInFront: {
      position: 'absolute',
      zIndex: 1,
  },
  bpmLabel: {
      right: 0,
      width: '60%', /*The normal trick wasnt working. I don't know why.*/
      marginTop: '4%',
  },
  scoreLabel: {
      right: '1.5%',
  },
  upperMidMenu: {
    top: '15%',
    width: '85%',
  },
  highScoreLabel: {
      // whiteSpace: 'nowrap',
  },
  jumpMeter: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: 'black',
      backgroundColor: 'red',
      // whiteSpace: 'nowrap',
      transform: [{rotate: '180deg'}],
      // clip: 'rect(auto, auto, auto, auto)',
      left: '1%',
      width: '5%',
      fontSize: windowHeight / 41,
      bottom: 0
  },
  jumpMeterText: {
      transform: [{rotate: '90deg'}],
      position: 'relative',
      top: 5,
  },
  gameFallingText: {
      position: 'absolute',
      color: '#D4AF37',
      // whiteSpace: 'nowrap',
      color: 'white',
      // textShadow:
      // `-1px -1px 0 000,
      // 1px -1px 0 000,
      // -1px 1px 0 000,
      //  1px 1px 0 000,`
  },
  gameMenuTitle: {
    textAlign: 'center',
    paddingBottom: '10%',
  },
  generalMenu: {
    borderColor: '#A9A9A9',
    opacity: .9,
    alignItems: 'center'
  },
  switchScreenButton: {
      backgroundColor: '#e6e600',
      borderRadius: 25,
      borderColor: 'darkgreen',

  },
  menuElement: {
      textAlign: 'center',
      fontSize: 20,
      padding: 10,
      borderRadius: 10,
      overflow: 'hidden',
      margin: 3
  },
  tableCentered: {
      textAlign: 'center',
  },
  tableLabel: {
      textAlign: 'left',
  },
  statDifficulty: {
      backgroundColor: '#90EE90',
      borderColor: '#A9A9A9',
      opacity: .8,
  },
  modemenu: {
      textAlign: 'center',
      backgroundColor: '#fff5ee',
      borderColor: '#A9A9A9',
      borderRadius: 20,
      position: 'relative',
      marginTop: 20,
      padding: 5,
      backgroundColor: '#ffffff4f'
  },
  modeSelectors: {
      borderColor: '#D3D3D3',
      borderWidth: 1,
      padding: '2%',
  },
  difficultySelectors: {
    fontSize: 20      // display: 'block',
  },
  inlineBlock: {
    flexDirection:'row'
  },
  newHighScore: {
      color: '#D4AF37',
      // textShadow:
      // `-1px -1px 0 000,
      // 1px -1px 0 000,
      // -1px 1px 0 000,
      //  1px 1px 0 000,`
  },
})
