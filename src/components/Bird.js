//This file defines how the bird moves and is animated. It is its own module outside
//of jsx since everything is based on the dom frame rate directly.

// import {soundManager} from "./soundManager";
import React, {Component} from 'react'
import {Dimensions, Image, View} from 'react-native'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default class Bird extends Component {
  componentDidUpdate(prevProps){
    if(this.props.frame !== prevProps.frame){
      this.advanceBirdFrame()
    }
  }

  ratios = {
    birdStart: {
      y: windowHeight / 3
    },
    birdRadius: windowWidth / 27,
    gravityAccel: windowHeight / 1100, //added to falling speed each frame if game has started.
    maxVelocity: windowHeight / 32,
    jumpStrength: 0, //cyberBird.fallingSpeed is hard set to this amount in jump(). A different value is set each frame
    jumpStrengthRead: - windowHeight / 34, //The strength of a max jump.
    jumpPerc: 1,
    cyberBirdClip: windowWidth * .12
  }

  state = {
    nearestPosts: [],
    birdTop: this.ratios.birdStart.y,
    birdCenter: {y: 0, x: 0},
    postLeft: 0,
    postRight: 0,
    gapTop: 0,
    gapBottom: 0,
    fallingSpeed: 0,
    flapping: true,
    framesPerFlap: 72,
    currentImg: 2,
    flapIdx: 0
  }

  newBird(){
      this.scoreDom = document.getElementById("score");
      this.jumpMeterDom = document.getElementById("jumpMeter");
      this.cyberBirdDom = document.getElementById("cyberBird");
      this.bpmDom = document.getElementById("bpm");
      this.bpmDom.min = 56

      //we will use an invisible circle for collision detection.
      let cyberBirdDom = this.cyberBirdDom;

      //initialized at not falling. Bird's y pos will be adjusted by this many pixels each frame.
      cyberBirdDom.fallingSpeed = 0;
      this.nearestPosts = []; //We do take care of this during endGame. This is just to be safe.

      //reset perfect Object
      let perfect = this.soundLogic.perfect;
      perfect.count = 0;
      perfect.record = [];
      perfect.postsCleared = 0;
      perfect.streak = 0;
      perfect.score = 0;

      this.scoreDom.textContent = 0;

      //reset the starting tempo and jump meter direction. bpm.current is set in bpm.update()
      let bpmDom = this.bpmDom;
      bpmDom.nextBeat = (bpmDom.current / 60) * 1000;
      bpmDom.lastTime = Date.now();
      bpmDom.fullBeat = (bpmDom.current / 60) * 1000;
      this.jumpMeterDom.direction = true;

      let highScore = document.getElementById("highScore");
      if(!sessionsAndMenus.options.practice){
          highScore.textContent = perfect.history[sessionsAndMenus.options.difficulty]["Score"][2];
      }
      else {
          highScore.textContent = "";
      }
      highScore.style.color = "";
  }

  newPost(){
      const randomNumber = Math.random();
      const ratios = this.ratios;

      var topPost = document.createElement("div");
      topPost.placement = randomNumber
      topPost.className = "ingamePost";
      topPost.role = "topPost";
      topPost.style.left = ratios.post.left;
      topPost.style.width = ratios.post.width;
      topPost.style.height = ratios.post.height;
      topPost.style.top = ((windowHeight - ratios.post.gap) * topPost.placement) - ratios.post.height;

      var bottomPost = document.createElement("div");
      bottomPost.placement = randomNumber
      bottomPost.className = "ingamePost";
      bottomPost.role = "bottomPost";
      bottomPost.style.left = ratios.post.left;
      bottomPost.style.width = ratios.post.width;
      bottomPost.style.height = ratios.post.height;
      bottomPost.style.top = ((windowHeight - ratios.post.gap) * bottomPost.placement) + ratios.post.gap;

      //append our new charactors to the document.
      document.getElementById("inGameElements").appendChild(topPost);
      document.getElementById("inGameElements").appendChild(bottomPost);

      //set up when the next one will happen
      this.ratios.post.space.current = ((ratios.post.space.max - ratios.post.space.min) * Math.random()) + ratios.post.space.min;

      if(!this.nearestPosts[0]) this.nearestPosts = [topPost, bottomPost];
  }

  updatePostGap(currentPost){
      let currentPlacement, increment;
      let cssPos = this.cssPos;
      if(currentPost.role === "topPost"){
          if(Math.floor(cssPos(currentPost, "top")) !== Math.floor(currentPost.goalPlacement)){
              currentPlacement = cssPos(currentPost, "top");
              increment = currentPlacement > currentPost.goalPlacement ? 1 : - 1
              currentPost.style.top = cssPos(currentPost, "top") - increment;
          }
      }
      else if(currentPost.role === "bottomPost"){
          if(Math.floor(cssPos(currentPost, "top")) !== Math.floor(currentPost.goalPlacement)){
              currentPlacement = cssPos(currentPost, "top");
              increment = currentPlacement > currentPost.goalPlacement ? 1 : - 1
              currentPost.style.top = cssPos(currentPost, "top") - increment;
          }
      }
      else console.log("updatePostGap(currentPost) requires the property 'role' of 'currentPost'")
  }

  updateGoalPlacements(){
      var currentPost
      const ratios = this.ratios;
      ratios.post.gap = ratios.post.minGap + ((windowHeight - ratios.post.minGap) * this.soundLogic.perfect.gapBonus());
      for(var idx = 0; idx < document.getElementsByClassName("ingamePost").length; idx ++){
          currentPost = document.getElementsByClassName("ingamePost")[idx]
          currentPost.goalPlacement = currentPost.role === "topPost" ?
              ((windowHeight - ratios.post.gap) * currentPost.placement) - ratios.post.height :
              ((windowHeight - ratios.post.gap) * currentPost.placement) + ratios.post.gap;
      }
  }

  jump(){
    const {start, started} = this.props
    if(!started) start()
    let cyberBirdDom = this.cyberBirdDom;
    let imgBirdDom = this.imgBirdDom
    const ratios = this.ratios;
    // soundManager.piano.play(this.soundLogic.birdLogic()); //add dynamic volume level, plz!.
    cyberBirdDom.fallingSpeed = ratios.jumpStrength; //this is the actual jumping part.
    cyberBirdDom.jumpPrimed = true;
    this.setState({
      flapping: true,
      framesPerFlap: 24,
      flapIdx: 0,
      currentImg: 1,
      flapDown: true,
    })
  }

  //this.soundLogic.drumLogic takes care of this since sounds are fired on the meter's
  //change of direction.
  setJumpMeterDomDirection(jumpBool){
    this.jumpMeterDom.direction = jumpBool;
  }

  advanceBirdFrame = () => {
    const {flapping, flapIdx, flapDown, currentImg, framesPerFlap} = this.state
    const {started} = this.props
    if(flapping || !started){
      let newFlapIdx = flapIdx + 1
      let newCurrentImg = currentImg
      let newFlapDown
      if(newFlapIdx % Math.floor(framesPerFlap/12) === 0){
        newCurrentImg += (flapDown ? 1 : -1)
        if(newCurrentImg === 8) newFlapDown = false;
        if(newCurrentImg === 1) newFlapDown = true;
      }
      this.setState({
        flapIdx: newFlapIdx,
        currentImg: newCurrentImg,
        flapDown: newFlapDown === undefined ? flapDown : newFlapDown
      })
      if(flapIdx >= framesPerFlap){
        this.setState({
          flapping: false,
          flapIdx: 0,
          currentImg: 2,
          flapDown: true
        })
      }
    }
  }

  //returns the position of an element.
  cssPos(elementNode, attribute){
      if(!elementNode) return;
      switch(attribute){
          case "top": return Number(elementNode.style.top.replace("px", ""));
          case "left": return Number(elementNode.style.left.replace("px", ""));
          case "bottom": return Number(elementNode.style.top.replace("px", "")) + elementNode.clientHeight;
          case "right": return Number(elementNode.style.left.replace("px", "")) + elementNode.clientWidth;
          case "center.x": return Number(elementNode.style.left.replace("px", "")) + (elementNode.clientWidth/2);
          case "center.y": return Number(elementNode.style.top.replace("px", "")) + (elementNode.clientHeight/2);
          case "height": return Number(elementNode.style.height.replace("px", ""));
          case "width": return Number(elementNode.style.height.replace("px", ""));
          default: console.log("Please add \"" + attribute + "\"to cssPos.")
      }
  }

  render() {
    const sq = this.ratios.birdRadius * 4
    const {currentImg} = this.state
    return (
      <View style={{
        width: sq,
        height: sq,
        position: 'absolute',
        top: this.state.birdTop,
        left: windowWidth / 8,
        overflow: 'hidden'
      }}>
        <View style={{
          position: 'absolute',
        }}>
          <Image source={require('../../assets/backgrounds/bird.png')} style={{
            height: sq,
            width: sq * 7,
            transform: [{translateX: (-sq) * (currentImg - 2)}]
          }}/>
        </View>
      </View>
    )
  }
}
