import {Sound} from 'react-native-sound'

//We need to create a class that the drum, bass, and bird all extend.
export default class DrumLogic {
  constructor(props){
    this.mode = props.mode
    this.subDivTripper = {sixteenth: true, eighth: true}
    this.primed = false
    this.sounds = {drum16thbeat: [], drumupbeat: []}
    this.lastPerc = 0
    this.primeSounds()
    this.prevObj = {}
  }

  realPlay = sound => {
    let timer = Date()
    this.sounds[sound].play()
    console.log(Date() - timer)
  }

  play = async (jumpPerc) => {
    let mode = this.mode
    switch(mode){
      case "straight":
        if(jumpPerc >= 0.5 && this.subDivTripper.sixteenth){
          this.subDivTripper.sixteenth = false;
          this.realPlay('drum16thbeat')
        }
        else if(jumpPerc <= 0.5 && !this.subDivTripper.sixteenth){
          this.subDivTripper.sixteenth = true;
          this.realPlay('drum16thbeat')
        }
        break;
      case "triplets":
        if(jumpPerc >= 2/3 && this.subDivTripper.sixteenth){
          this.subDivTripper.sixteenth = false;
          this.realPlay('drumupbeat')
        }
        else if(jumpPerc <= 2/3 && !this.subDivTripper.sixteenth){
          this.subDivTripper.sixteenth = true;
          this.realPlay('drum16thbeat')
        }
        break;
      case "swing":
        if(jumpPerc >= 2/3 && this.subDivTripper.sixteenth){
          this.subDivTripper.sixteenth = false;
          this.realPlay('drumupbeat')
        }
        else if(jumpPerc <= 1/3 && !this.subDivTripper.sixteenth){
          this.subDivTripper.sixteenth = true;
          this.realPlay('drum16thbeat')
        }
        break;
      default:
        console.log("\"" + mode + "\" is not a valid option." )
    }
    if(jumpPerc < this.lastPerc && mode !== 'triplets' && this.subDivTripper.eighth){
      this.subDivTripper.eighth = false
      this.realPlay('drumupbeat')
    }
    if(jumpPerc > this.lastPerc){
      this.subDivTripper.eighth = true
    }
    this.lastPerc = jumpPerc
  }

  primeSounds = async () => {
    this.sounds.drum16thbeat = new Sound(`../../assets/sounds/drum16thbeat.mp3`, Sound.MAIN_BUNDLE, e => {
      if(e) console.log(e)
    })
    this.sounds.drumupbeat = new Sound(`../../assets/sounds/drumupbeat.mp3`, Sound.MAIN_BUNDLE, e => {
      if(e) console.log(e)
    })
    this.primed = true
  }

  ready = async () => {
    return new Promise(resolve => {
      if(this.primed) resolve()
      else{
        this.primedWait = setInterval(() => {
          if(this.primed){
            clearInterval(this.primedWait)
            resolve()
          }
        }, 500)
      }
    })
  }
}
