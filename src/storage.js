import {AsyncStorage} from 'react-native'

export default class LocalStorageManager {

  //difficulty
  set difficulty (difficulty){
    return this.setItem('difficulty', difficulty)
  }

  get difficulty () {
    return this.getItem('difficulty')
  };

  //practice mode
  set practice (practice){
    return this.setItem('practice', practice.toString())
  }

  get practice () {
    return this.getItem('practice') === 'true'
  };

  //history
  set history(history){
    return this.setItem('history', history)
  }

  get history(){
    return this.getItem('history')
  };

  //mode (straight, triplets, or swing)
  set mode(mode){
    return this.setItem('mode', mode)
  }

  get mode(){
    return this.getItem('mode')
  }

  //util
  setItem = async (key, value) => {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.setItem(`@${key}:key`, value);
        resolve('success')
      } catch (error) {
        reject(error)
      }
    })
  }

  getItem = async (key) => {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await AsyncStorage.getItem(key))
      } catch (error) {
        reject(error)
      }
    })
  }
}
