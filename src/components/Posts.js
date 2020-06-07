import React, {Component} from 'react'
import {Dimensions, Image, View} from 'react-native'

export default class Posts extends Component {
  ratios = {
    gap: windowHeight / 2.75,
    minGap: windowHeight / 2.75,
    width: windowWidth / 30,
    height: windowHeight * 0.75,
    left: windowWidth,
    speed: windowWidth / 250,
    space: {
      min: windowWidth * 0.75,
      max: windowWidth * 0.66,
      current: 0
    }
  }
}
