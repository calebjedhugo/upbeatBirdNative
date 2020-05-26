//This file defines how the bird moves and is animated. It is its own module outside
//of jsx since everything is based on the dom frame rate directly.

// import {soundManager} from "./soundManager";
import React, {Component} from 'react'
import {Dimensions, Image, View} from 'react-native'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export default class Bird extends Component {
    componentDidMount(){
      requestAnimationFrame(this.updateAnimation);
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
      jumpMeterHeight: windowHeight / 3,
      post: {
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
      },
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

        //This function is based on the above values so it has to go last.
        this.updateBPM();

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

    updateAnimation = () => {
      this.advanceBirdFrame();
      return requestAnimationFrame(this.updateAnimation)
        let currentPos = this.currentPos;
        let cssPos = this.cssPos;
        let cyberBirdDom = this.cyberBirdDom;
        let imgBirdDom = this.imgBirdDom;
        let bpmDom = this.bpmDom;
        let jumpMeterDom = this.jumpMeterDom;
        let scoreDom = this.scoreDom;
        let ratios = this.ratios;

        currentPos.cyberBird.top = Math.max(cssPos(cyberBirdDom, "top") + cyberBirdDom.fallingSpeed, 0); //Can't go higher than the top!
        cyberBirdDom.style.top = currentPos.cyberBird.top;
        currentPos.cyberBird.center.y = cssPos(cyberBirdDom, "center.y");

        //We're floating until the first jump. Else update the falling speed.
        if(this.props.started){
            if(cyberBirdDom.fallingSpeed < ratios.maxVelocity)
                cyberBirdDom.fallingSpeed = Math.min(cyberBirdDom.fallingSpeed + ratios.gravityAccel, ratios.maxVelocity);
        }
        else{
            //This fixs a stupid stupid bug in mobile and Safari. The animation freezes
            //after a second until you add something to the dom. I don't know why, but this worked
            //and I'm really sick of debugging this glitch.
            this.soundLogic.perfect.fallingText("");
            cyberBirdDom.style.left = ratios.birdStart.x; //These shouldn't have to be here.
            cyberBirdDom.style.top = ratios.birdStart.y; //I'm a little annoyed that I had to do it.
        }
        this.advanceBirdFrame();

            //               *****Perfect upbeat rules*****
        if(cyberBirdDom.jumpPrimed){
            this.soundLogic.perfect.subdivisions()
            cyberBirdDom.jumpPrimed = false;
            this.updateGoalPlacements();
        }

        //               *****post rules*****
        var currentPost, posts
        posts = document.getElementsByClassName("ingamePost")
        for(var idx = 0; idx < posts.length; idx ++){
            currentPost = posts[idx];
            currentPost.style.left = Number(currentPost.style.left.replace("px", "")) - ratios.post.speed;
            if(Number(currentPost.style.left.replace("px", "")) + ratios.post.width <= 0){
                currentPost.parentNode.removeChild(currentPost);
                idx --;
            }
            //animate gap changes
            else this.updatePostGap(currentPost);
        }
        currentPost = document.getElementsByClassName("ingamePost")[idx - 1];//The last post that was made.
        if(currentPost){
            if(Math.abs(Number(currentPost.style.left.replace("px", "")) - windowWidth) >= ratios.post.space.current){
                //if the latest post has reached its destination toward the middle of the screen.
                this.newPost();
            }
        }

        if(this.nearestPosts[0]){ //We don't want to attempt any of this if we don't have this.nearestPosts established.
            currentPos.post.right = cssPos(this.nearestPosts[0], "right"); //update nearestPostPos
            if(currentPos.post.right < ratios.birdStart.x){ //If the nearest posts are no longer relevant, set up the new ones.
                this.nearestPosts = [document.getElementsByClassName("ingamePost")[2],
                                    document.getElementsByClassName("ingamePost")[3]];
                currentPos.post.right = cssPos(this.nearestPosts[0], "right");
                this.soundLogic.perfect.postsCleared ++; //Give credit for clearing the post.
                this.soundLogic.perfect.updateScore();
            }
            //update the post position for collision detection in postCollisionCheck() in sessionsAndMenus.js
            //currentPos.post.right is already set
            currentPos.post.left = cssPos(this.nearestPosts[0], "left");
            currentPos.gap = {"top": cssPos(this.nearestPosts[0], "bottom"),
                            "bottom": cssPos(this.nearestPosts[1], "top")}
        }

        //               *****jump meter rules*****
        if(bpmDom.nextBeat < 0){
            // soundManager.piano.play(this.soundLogic.bassLogic());
            bpmDom.nextBeat = (60 / bpmDom.current) * 1000;
            bpmDom.fullBeat = bpmDom.nextBeat;
        }
        jumpMeterDom.lastJumpPerc = ratios.jumpPerc; //we need this for the drum logic.
        ratios.jumpPerc = Math.abs(Math.abs((bpmDom.fullBeat - bpmDom.nextBeat) - (bpmDom.fullBeat / 2)) / (bpmDom.fullBeat / 2) - 1);

        //We can now use ratios.jumpPerc for the drum sounds.
        this.soundLogic.drumTracking.current = this.soundLogic.drumLogic();
        // if(this.soundLogic.drumTracking.current) soundManager.piano.play(this.soundLogic.drumTracking.current);

        ratios.jumpStrength = ratios.jumpStrengthRead * ratios.jumpPerc;
        jumpMeterDom.style.height = Math.floor(ratios.jumpPerc * ratios.jumpMeterHeight);
        //jumpMeterDom.style.top = windowHeight - jumpMeterDom.clientHeight;
        bpmDom.nextBeat -= Date.now() - bpmDom.lastTime;
        bpmDom.lastTime = Date.now();

        let fallingTextArray = document.getElementsByClassName("gameFallingText");
        for(let idx = 0; idx < fallingTextArray.length; idx ++){
            fallingTextArray[idx].fallingSpeed = fallingTextArray[idx].fallingSpeed === undefined ? 0 : fallingTextArray[idx].fallingSpeed + ratios.gravityAccel;
            fallingTextArray[idx].style.top = cssPos(fallingTextArray[idx], "top") + fallingTextArray[idx].fallingSpeed;
            if(cssPos(fallingTextArray[idx], "top") > windowHeight){
                //This was originally writting without jsx. It doesn't hurt to leave this in.
                fallingTextArray[idx].parentNode.removeChild(fallingTextArray[idx]);
                idx --;
            }
        }

        //animate the score to make it look more satisfying.
        if(Number(scoreDom.textContent) < this.soundLogic.perfect.score){
            scoreDom.textContent = Number(scoreDom.textContent) + Math.ceil((this.soundLogic.perfect.score - Number(scoreDom.textContent)) / 10);
        }
        //Check for game over and recursively call next frame if it's not over.
        if(!sessionsAndMenus.gameOver()) requestAnimationFrame(this.updateAnimation);
        else requestAnimationFrame(this.endGame);
    }

    endGame(){
        let posts;
        let cyberBirdDom = this.cyberBirdDom;
        const ratios = this.ratios;

        //Posts will move into the floor and ceiling and disappear.
        posts = document.getElementsByClassName("ingamePost")
        for(let idx = 0; idx < posts.length; idx ++){
            if(posts[idx].fallingSpeed) posts[idx].fallingSpeed += ratios.gravityAccel;
            else posts[idx].fallingSpeed = ratios.gravityAccel;
            if(posts[idx].role === "topPost"){
                posts[idx].style.top = this.cssPos(posts[idx], "top") - posts[idx].fallingSpeed;
                if(this.cssPos(posts[idx], "top") + posts[idx].clientHeight < 0){
                    posts[idx].parentNode.removeChild(posts[idx]);
                    idx--;
                }
            }
            else{
                posts[idx].style.top = this.cssPos(posts[idx], "top") + posts[idx].fallingSpeed;
                if(this.cssPos(posts[idx], "top") > windowHeight){
                    posts[idx].parentNode.removeChild(posts[idx]);
                    idx--;
                }
            }
        }
        if(cyberBirdDom.style.display !== "none"){
            if(this.cssPos(cyberBirdDom, "top") > windowHeight){
                cyberBirdDom.style.display = "none";
            }
            else{
                cyberBirdDom.rotation += 5;
                cyberBirdDom.style.transform = "rotate(" + cyberBirdDom.rotation + "deg)";
                cyberBirdDom.fallingSpeed = cyberBirdDom.fallingSpeed + ratios.gravityAccel;
                cyberBirdDom.style.top = this.cssPos(cyberBirdDom, "top") + cyberBirdDom.fallingSpeed;
            }
        }

        var fallingTextNodes = document.getElementsByClassName("gameFallingText")
        for(let idx = 0; idx < fallingTextNodes.length; idx ++){
            fallingTextNodes[idx].style.top = this.cssPos(fallingTextNodes[idx], "top") + fallingTextNodes[idx].fallingSpeed;
            fallingTextNodes[idx].fallingSpeed += ratios.gravityAccel;
            if(this.cssPos(fallingTextNodes[idx], "top") > windowHeight){
                fallingTextNodes[idx].parentNode.removeChild(fallingTextNodes[idx])
                idx--;
            }
        }

        if(cyberBirdDom.style.display !== "none" || posts[0] || fallingTextNodes[0]) requestAnimationFrame(this.endGame);
        else{
            this.nearestPosts = [];
            setTimeout(function(){this.gameJustEnded = false}.bind(this), 500);
        }
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

    updateBPM = () => {
        let bpmDom = this.bpmDom;
        let newBPM = this.bpmDom.min + Math.floor((this.soundLogic.perfect.count * (this.soundLogic.perfect.postsCleared / 3)) / 10)
        bpmDom.textContent = newBPM;
        bpmDom.current = newBPM;
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
