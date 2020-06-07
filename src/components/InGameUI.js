import React, {Component} from 'react'
import {Text, View, Dimensions, ImageBackground} from 'react-native'
import Bird from './Bird'
import JumpMeter from './JumpMeter'
import Posts from './Posts'
import styles from '../styles.js'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default class InGameUI extends Component {
  constructor(props){
    super(props)
    this.bpmMin = 56
    this.goingUp = false
    this.state = {
      frame: 0, // ++ every animation frame.
      perfectUpbeats: 0,
      postsCleared: 0,
      nextBeat: 0,
      jumpPerc: 0
    }
  }

  async componentDidMount(){
    requestAnimationFrame(this.advanceFrame)
  }

  advanceFrame = () => {
    const {nextBeat, jumpPerc, frame} = this.state
    const {bass, drum} = this.props
    let newState = {}

    newState.frame = frame + 1
    newState.jumpPerc = Math.abs(Math.abs((this.fullBeatMS - this.beatRemainderMS) - (this.fullBeatMS / 2)) / (this.fullBeatMS / 2) - 1).toFixed(2)
    if(nextBeat <= Date.now()){
      newState.nextBeat = Date.now() + this.fullBeatMS
      bass.play()
    }
    drum.play(jumpPerc)

    this.setState(newState)
    requestAnimationFrame(this.advanceFrame)
  }

  get bpm(){
    const {perfectUpbeats, postsCleared} = this.state
    return this.bpmMin + Math.floor((perfectUpbeats * (postsCleared / 3)) / 10)
  }

  get fullBeatMS(){
    return ((60 / this.bpm) * 1000)
  }

  get beatRemainderMS(){
    const {nextBeat} = this.state
    return nextBeat ? nextBeat - Date.now() : this.fullBeatMS
  }

  updateAnimation = () => {
      // let currentPos = this.currentPos;
      // let cssPos = this.cssPos;
      // let cyberBirdDom = this.cyberBirdDom;
      // let imgBirdDom = this.imgBirdDom;
      // let bpmDom = this.bpmDom;
      // let jumpMeterDom = this.jumpMeterDom;
      // let scoreDom = this.scoreDom;
      // let ratios = this.ratios;
      //
      // currentPos.cyberBird.top = Math.max(cssPos(cyberBirdDom, "top") + cyberBirdDom.fallingSpeed, 0); //Can't go higher than the top!
      // cyberBirdDom.style.top = currentPos.cyberBird.top;
      // currentPos.cyberBird.center.y = cssPos(cyberBirdDom, "center.y");
      //
      // //We're floating until the first jump. Else update the falling speed.
      // if(this.props.started){
      //     if(cyberBirdDom.fallingSpeed < ratios.maxVelocity)
      //         cyberBirdDom.fallingSpeed = Math.min(cyberBirdDom.fallingSpeed + ratios.gravityAccel, ratios.maxVelocity);
      // }
      // else{
      //     //This fixs a stupid stupid bug in mobile and Safari. The animation freezes
      //     //after a second until you add something to the dom. I don't know why, but this worked
      //     //and I'm really sick of debugging this glitch.
      //     this.soundLogic.perfect.fallingText("");
      //     cyberBirdDom.style.left = ratios.birdStart.x; //These shouldn't have to be here.
      //     cyberBirdDom.style.top = ratios.birdStart.y; //I'm a little annoyed that I had to do it.
      // }
      //
      //     //               *****Perfect upbeat rules*****
      // if(cyberBirdDom.jumpPrimed){
      //     this.soundLogic.perfect.subdivisions()
      //     cyberBirdDom.jumpPrimed = false;
      //     this.updateGoalPlacements();
      // }
      //
      // //               *****post rules*****
      // var currentPost, posts
      // posts = document.getElementsByClassName("ingamePost")
      // for(var idx = 0; idx < posts.length; idx ++){
      //     currentPost = posts[idx];
      //     currentPost.style.left = Number(currentPost.style.left.replace("px", "")) - ratios.post.speed;
      //     if(Number(currentPost.style.left.replace("px", "")) + ratios.post.width <= 0){
      //         currentPost.parentNode.removeChild(currentPost);
      //         idx --;
      //     }
      //     //animate gap changes
      //     else this.updatePostGap(currentPost);
      // }
      // currentPost = document.getElementsByClassName("ingamePost")[idx - 1];//The last post that was made.
      // if(currentPost){
      //     if(Math.abs(Number(currentPost.style.left.replace("px", "")) - windowWidth) >= ratios.post.space.current){
      //         //if the latest post has reached its destination toward the middle of the screen.
      //         this.newPost();
      //     }
      // }
      //
      // if(this.nearestPosts[0]){ //We don't want to attempt any of this if we don't have this.nearestPosts established.
      //     currentPos.post.right = cssPos(this.nearestPosts[0], "right"); //update nearestPostPos
      //     if(currentPos.post.right < ratios.birdStart.x){ //If the nearest posts are no longer relevant, set up the new ones.
      //         this.nearestPosts = [document.getElementsByClassName("ingamePost")[2],
      //                             document.getElementsByClassName("ingamePost")[3]];
      //         currentPos.post.right = cssPos(this.nearestPosts[0], "right");
      //         this.soundLogic.perfect.postsCleared ++; //Give credit for clearing the post.
      //         this.soundLogic.perfect.updateScore();
      //     }
      //     //update the post position for collision detection in postCollisionCheck() in sessionsAndMenus.js
      //     //currentPos.post.right is already set
      //     currentPos.post.left = cssPos(this.nearestPosts[0], "left");
      //     currentPos.gap = {"top": cssPos(this.nearestPosts[0], "bottom"),
      //                     "bottom": cssPos(this.nearestPosts[1], "top")}
      // }
      //
      // //               *****jump meter rules*****
      // if(bpmDom.nextBeat < 0){
      //     // soundManager.piano.play(this.soundLogic.bassLogic());
      //     bpmDom.nextBeat = (60 / bpmDom.current) * 1000;
      //     bpmDom.fullBeat = bpmDom.nextBeat;
      // }
      // jumpMeterDom.lastJumpPerc = ratios.jumpPerc; //we need this for the drum logic.
      // ratios.jumpPerc = Math.abs(Math.abs((bpmDom.fullBeat - bpmDom.nextBeat) - (bpmDom.fullBeat / 2)) / (bpmDom.fullBeat / 2) - 1);
      //
      // //We can now use ratios.jumpPerc for the drum sounds.
      // this.soundLogic.drumTracking.current = this.soundLogic.drumLogic();
      // // if(this.soundLogic.drumTracking.current) soundManager.piano.play(this.soundLogic.drumTracking.current);
      //
      // ratios.jumpStrength = ratios.jumpStrengthRead * ratios.jumpPerc;
      // jumpMeterDom.style.height = Math.floor(ratios.jumpPerc * ratios.jumpMeterHeight);
      // //jumpMeterDom.style.top = windowHeight - jumpMeterDom.clientHeight;
      // bpmDom.nextBeat -= Date.now() - bpmDom.lastTime;
      // bpmDom.lastTime = Date.now();
      //
      // let fallingTextArray = document.getElementsByClassName("gameFallingText");
      // for(let idx = 0; idx < fallingTextArray.length; idx ++){
      //     fallingTextArray[idx].fallingSpeed = fallingTextArray[idx].fallingSpeed === undefined ? 0 : fallingTextArray[idx].fallingSpeed + ratios.gravityAccel;
      //     fallingTextArray[idx].style.top = cssPos(fallingTextArray[idx], "top") + fallingTextArray[idx].fallingSpeed;
      //     if(cssPos(fallingTextArray[idx], "top") > windowHeight){
      //         //This was originally writting without jsx. It doesn't hurt to leave this in.
      //         fallingTextArray[idx].parentNode.removeChild(fallingTextArray[idx]);
      //         idx --;
      //     }
      // }
      //
      // //animate the score to make it look more satisfying.
      // if(Number(scoreDom.textContent) < this.soundLogic.perfect.score){
      //     scoreDom.textContent = Number(scoreDom.textContent) + Math.ceil((this.soundLogic.perfect.score - Number(scoreDom.textContent)) / 10);
      // }
      // //Check for game over and recursively call next frame if it's not over.
      /*if(!sessionsAndMenus.gameOver()) */requestAnimationFrame(this.updateAnimation);
      // else requestAnimationFrame(this.endGame);
  }

  state = {
    started: false
  }

  render() {
    const {started, frame, jumpPerc} = this.state
    const {score, highScore, inGameOpacity, highScoreLabelText, cyberBirdClip, birdDiameter, scoreLabel2Class, titleColor} = this.props
    return (
      <View style={{
        opacity: inGameOpacity,
        width: windowWidth,
        height: windowHeight
      }}>
        <Bird {...this.state} start={() => this.setState({started: true})}/>
        <View style={[styles.absoluteInFront, {right: '1.5%', marginTop: 20}]}>
          <Text style={[
            styles.absoluteInFront, {
              color: titleColor,
              width: .6 * windowWidth,
              right: 0
            }]
          }>
            {'BPM: '}
            <Text style={[styles.inlineBlock]}>{this.bpm}</Text>
          </Text>
          <Text style={[{color: titleColor}]}>
            {highScoreLabelText}
            <Text style={[styles.inlineBlock, {
              color: highScore < score ? '#000000' : '#D4AF37'
            }]}>{highScore}</Text>
          </Text>
          <Text style={[{color: titleColor}, styles[scoreLabel2Class]]}>
            {'Score: '}
            <Text style={[styles.inlineBlock]}>{score}</Text>
          </Text>
        </View>
        <JumpMeter jumpPerc={jumpPerc}/>
      </View>
    )
  }
}
// endGame(){
  //   let posts;
  //   let cyberBirdDom = this.cyberBirdDom;
  //   const ratios = this.ratios;
  //
  //   //Posts will move into the floor and ceiling and disappear.
  //   posts = document.getElementsByClassName("ingamePost")
  //   for(let idx = 0; idx < posts.length; idx ++){
    //       if(posts[idx].fallingSpeed) posts[idx].fallingSpeed += ratios.gravityAccel;
    //       else posts[idx].fallingSpeed = ratios.gravityAccel;
    //       if(posts[idx].role === "topPost"){
      //           posts[idx].style.top = this.cssPos(posts[idx], "top") - posts[idx].fallingSpeed;
      //           if(this.cssPos(posts[idx], "top") + posts[idx].clientHeight < 0){
        //               posts[idx].parentNode.removeChild(posts[idx]);
        //               idx--;
        //           }
        //       }
        //       else{
          //           posts[idx].style.top = this.cssPos(posts[idx], "top") + posts[idx].fallingSpeed;
          //           if(this.cssPos(posts[idx], "top") > windowHeight){
            //               posts[idx].parentNode.removeChild(posts[idx]);
            //               idx--;
            //           }
            //       }
            //   }
            //   if(cyberBirdDom.style.display !== "none"){
              //       if(this.cssPos(cyberBirdDom, "top") > windowHeight){
                //           cyberBirdDom.style.display = "none";
                //       }
                //       else{
                  //           cyberBirdDom.rotation += 5;
                  //           cyberBirdDom.style.transform = "rotate(" + cyberBirdDom.rotation + "deg)";
                  //           cyberBirdDom.fallingSpeed = cyberBirdDom.fallingSpeed + ratios.gravityAccel;
                  //           cyberBirdDom.style.top = this.cssPos(cyberBirdDom, "top") + cyberBirdDom.fallingSpeed;
                  //       }
                  //   }
                  //
                  //   var fallingTextNodes = document.getElementsByClassName("gameFallingText")
                  //   for(let idx = 0; idx < fallingTextNodes.length; idx ++){
                    //       fallingTextNodes[idx].style.top = this.cssPos(fallingTextNodes[idx], "top") + fallingTextNodes[idx].fallingSpeed;
                    //       fallingTextNodes[idx].fallingSpeed += ratios.gravityAccel;
                    //       if(this.cssPos(fallingTextNodes[idx], "top") > windowHeight){
                      //           fallingTextNodes[idx].parentNode.removeChild(fallingTextNodes[idx])
                      //           idx--;
                      //       }
                      //   }
                      //
                      //   if(cyberBirdDom.style.display !== "none" || posts[0] || fallingTextNodes[0]) requestAnimationFrame(this.endGame);
                      //   else{
                        //       this.nearestPosts = [];
                        //       setTimeout(function(){this.gameJustEnded = false}.bind(this), 500);
                        //   }
                        // }
