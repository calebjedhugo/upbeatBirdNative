import {Audio} from 'expo-av'

export default class BassLogic{
  constructor(props){
    this.bassNote = 5;
    this.offset = this.randomIdx([0,1,2,3,4,5,6])
    this.primed = false
    this.sounds = {
      bass1: undefined, bass2: undefined, bass3: undefined, bass4: undefined,
      bass5: undefined, bass6: undefined, bass7: undefined, bass8: undefined,
      bass9: undefined, bass10: undefined, bass11: undefined, bass12: undefined,
      bass13: undefined, bass14: undefined, bass15: undefined, bass16: undefined,
      bass17: undefined, bass18: undefined, bass19: undefined, bass20: undefined,
      bass21: undefined
    }
    this.primeSounds()
  }

  play = () => {
    this.sounds[this.bassLogic()].replayAsync()
  }

  // returns the name of a file that will sound nice based on what came before.
  bassLogic = () => {
      //translate the last note played to a scale degree
      let bassNote = this.bassNote;
      let currentScaleDegree = ((bassNote + 1 + this.offset) % 7) + 1
      let newScaleDegree;
      let randomIdx = this.randomIdx;
      switch(currentScaleDegree){
          case 1:
              newScaleDegree = randomIdx([1,2,3,4,5,6,7]);
              break;
          case 2:
              newScaleDegree = randomIdx([4,5,6]);
              break;
          case 3:
              newScaleDegree = randomIdx([1,5,7]);
              break;
          case 4:
              newScaleDegree = randomIdx([2,5,6]);
              break;
          case 5:
              newScaleDegree = randomIdx([1,7,2]);
              break;
          case 6:
              newScaleDegree = randomIdx([1,2,3,4,5,7]);
              break;
          case 7:
              newScaleDegree = randomIdx([1,2,5,6]);
              break;
          default:
              newScaleDegree = randomIdx([1,2,3,4,5,6,7]);
              break;
      }

      var changeAmounts = [newScaleDegree - currentScaleDegree,
                          newScaleDegree - currentScaleDegree + 7,
                          newScaleDegree - currentScaleDegree - 7];
      var finalAmount

      //find the shortest distance without simply making the number positive!
      //(I bet there's a better way to do this, I'm just not seeing it right now)
      if(Math.min(Math.abs(changeAmounts[0]), Math.abs(changeAmounts[1])) === Math.abs(changeAmounts[0]))
          finalAmount = changeAmounts[0]
      else
          finalAmount = changeAmounts[1]

      if(Math.min(Math.abs(finalAmount), Math.abs(changeAmounts[2])) === Math.abs(changeAmounts[2]))
          finalAmount = changeAmounts[2];

      bassNote += finalAmount;

      //make sure we're within the range of the instrument.
      if(bassNote < 1) bassNote += randomIdx([7,14]);
      else if(bassNote > 21) bassNote -= randomIdx([7,14]);
      return "bass" + bassNote;
  }

  randomIdx(theArray){
      return theArray[Math.floor(theArray.length * Math.random())];
  }

  primeSounds = async () => {
    for(let sound in this.sounds){
      this.sounds[sound] = await new Audio.Sound()
    }

    //require does not work with variables.
    await this.sounds.bass1.loadAsync(require(`../../assets/sounds/bass1.mp3`))
    await this.sounds.bass2.loadAsync(require(`../../assets/sounds/bass2.mp3`))
    await this.sounds.bass3.loadAsync(require(`../../assets/sounds/bass3.mp3`))
    await this.sounds.bass4.loadAsync(require(`../../assets/sounds/bass4.mp3`))
    await this.sounds.bass5.loadAsync(require(`../../assets/sounds/bass5.mp3`))
    await this.sounds.bass6.loadAsync(require(`../../assets/sounds/bass6.mp3`))
    await this.sounds.bass7.loadAsync(require(`../../assets/sounds/bass7.mp3`))
    await this.sounds.bass8.loadAsync(require(`../../assets/sounds/bass8.mp3`))
    await this.sounds.bass9.loadAsync(require(`../../assets/sounds/bass9.mp3`))
    await this.sounds.bass10.loadAsync(require(`../../assets/sounds/bass10.mp3`))
    await this.sounds.bass11.loadAsync(require(`../../assets/sounds/bass11.mp3`))
    await this.sounds.bass12.loadAsync(require(`../../assets/sounds/bass12.mp3`))
    await this.sounds.bass13.loadAsync(require(`../../assets/sounds/bass13.mp3`))
    await this.sounds.bass14.loadAsync(require(`../../assets/sounds/bass14.mp3`))
    await this.sounds.bass15.loadAsync(require(`../../assets/sounds/bass15.mp3`))
    await this.sounds.bass16.loadAsync(require(`../../assets/sounds/bass16.mp3`))
    await this.sounds.bass17.loadAsync(require(`../../assets/sounds/bass17.mp3`))
    await this.sounds.bass18.loadAsync(require(`../../assets/sounds/bass18.mp3`))
    await this.sounds.bass19.loadAsync(require(`../../assets/sounds/bass19.mp3`))
    await this.sounds.bass20.loadAsync(require(`../../assets/sounds/bass20.mp3`))
    await this.sounds.bass21.loadAsync(require(`../../assets/sounds/bass21.mp3`))

    for(let sound in this.sounds){
      this.sounds[sound].setStatusAsync({progressUpdateIntervalMillis: 100})
    }

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
