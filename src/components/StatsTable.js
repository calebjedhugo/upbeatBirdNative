import React, {Component} from 'react'
import {Text, View, Button} from 'react-native'
import styles from '../styles.js'

export default class StatsTable extends Component {
    render() {
      const {soundLogic} = this.props
      var h = soundLogic.perfect.history[this.props.difficulty];
      return (
        <View nativeId="statsTable" className="beefBorder centered" style={[{fontSize: this.props.fontSize, borderWidth: this.props.beefBorderWidth}, styles.generalMenu]}>
          <View className="statsRow">
          <StatDifficulty difficulty={this.props.difficulty}
              borderWidth={this.props.leanBorderWidth}
              toggleStats={this.props.toggleStats} />
          <Text className="statHeader">This Game</Text>
          <Text className="statHeader">Last Game</Text>
          <Text className="statHeader">Record</Text>
          </View>
          <View className="statsRow">
          <Text className="tableLabel">Perfect Upbeats</Text>
          <Text className="tableCentered">{h["Perfect Upbeats"][0]}</Text>
          <Text className="tableCentered">{h["Perfect Upbeats"][1]}</Text>
          <Text className="tableCentered">{h["Perfect Upbeats"][2]}</Text>
          </View>
          <View className="statsRow">
          <Text className="tableLabel">Posts Cleared</Text>
          <Text className="tableCentered">{h["Posts Cleared"][0]}</Text>
          <Text className="tableCentered">{h["Posts Cleared"][1]}</Text>
          <Text className="tableCentered">{h["Posts Cleared"][2]}</Text>
          </View>
          <View className="statsRow">
          <Text className="tableLabel">Max BPM</Text>
          <Text className="tableCentered">{h["Max BPM"][0]}</Text>
          <Text className="tableCentered">{h["Max BPM"][1]}</Text>
          <Text className="tableCentered">{h["Max BPM"][2]}</Text>
          </View>
          <View className="statsRow">
          <Text className="tableLabel">Score</Text>
          <Text className="tableCentered">{h["Score"][0]}</Text>
          <Text className="tableCentered">{h["Score"][1]}</Text>
          <Text className="tableCentered">{h["Score"][2]}</Text>
          </View>
          <View className="statsRow">
          <Text className="tableLabel">Best Streak</Text>
          <Text className="tableCentered">{h["Best Streak"][0]}</Text>
          <Text className="tableCentered">{h["Best Streak"][1]}</Text>
          <Text className="tableCentered">{h["Best Streak"][2]}</Text>
          </View>
        </View>
      )
    }
}

class StatDifficulty extends Component{
    render(){
        let difficulty = this.props.difficulty;
        difficulty = "Difficulty: " + difficulty[0].toUpperCase() + difficulty.slice(1)
        return (<Button className="statHeader"
            title={difficulty}
            style={{borderWidth: this.props.borderWidth}}
            nativeId="statDifficulty"
            onClick={this.props.toggleStats} />)
    }
}
