/* File: Brain.js 
 *
 * Creates and initializes a simple Brain object
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false, vec2: false, SpriteAnimateRenderable: false, LineRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Patrol(spriteTexture) {
    this.mHead = new SpriteRenderable(spriteTexture);
    this.mHead.setColor([1, 1, 1, 0]);
    this.mHead.getXform().setPosition(Math.random() * 125, -42.5 + (Math.random() * 85)); // gross hardcoding values in based on main camera width height, and pos in world space
    this.mHead.getXform().setSize(7.5, 7.5);
    this.mHead.setElementPixelPositions(600, 700, 0, 180);
    
    this.mTopWing = new SpriteAnimateRenderable(spriteTexture);
    this.mTopWing.setColor([1, 1, 1, 0]);
    this.mTopWing.getXform().setPosition(this.mHead.getXform().getXPos(), this.mHead.getXform().getYPos());
    this.mTopWing.getXform().setSize(10, 8);
    this.mTopWing.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mTopWing.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mTopWing.setAnimationSpeed(30);
    
    this.mBottomWing = new SpriteAnimateRenderable(spriteTexture);
    this.mBottomWing.setColor([1, 1, 1, 0]);
    this.mBottomWing.getXform().setPosition(this.mHead.getXform().getXPos(), this.mHead.getXform().getYPos());
    this.mBottomWing.getXform().setSize(10, 8);
    this.mBottomWing.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
                                    204, 164,   // widthxheight in pixels
                                    5,          // number of elements in this sequence
                                    0);         // horizontal padding in between
    this.mBottomWing.setAnimationType(SpriteAnimateRenderable.eAnimationType.eAnimateSwing);
    this.mBottomWing.setAnimationSpeed(30);
    
    this.topInterpX = new Interpolate(this.mTopWing.getXform().getXPos(), 120, 0.05);
    this.topInterpY = new Interpolate(this.mTopWing.getXform().getYPos(), 120, 0.05);
    
    this.bottomInterpX = new Interpolate(this.mBottomWing.getXform().getXPos(), 120, 0.05);
    this.bottomInterpY = new Interpolate(this.mBottomWing.getXform().getYPos(), 120, 0.05);
    
    this.headBox = new BoundingBox(this.mHead.getXform().getPosition(), this.mHead.getXform().getWidth(), this.mHead.getXform().getHeight());
    this.topWingBox = new BoundingBox(this.mTopWing.getXform().getPosition(), this.mTopWing.getXform().getWidth(), this.mTopWing.getXform().getHeight());
    this.bottomWingBox = new BoundingBox(this.mBottomWing.getXform().getPosition(), this.mBottomWing.getXform().getWidth(), this.mBottomWing.getXform().getHeight());
    this.BBwidth = this.topWingBox.maxX() - this.headBox.minX();
    this.BBheight = (this.topWingBox.maxY() - this.bottomWingBox.minY()) * 1.5;
    this.BBcenterX = this.headBox.minX() + (this.BBwidth / 2);
    this.BBcenterY = this.bottomWingBox.minY() + (this.BBheight / 2);
    var center = vec2.fromValues(this.BBcenterX, this.BBcenterY);
    this.bigBox = new BoundingBox(center, this.BBwidth, this.BBheight);
    //console.log(this.bigBox.minX(), this.bigBox.minY(), this.bigBox.maxX(), this.bigBox.maxY());
    this.speed = (5 + (5 * Math.random())) / 60;
    this.dir = 90 * Math.random();
    this.verticalSpeed = Math.sin(this.dir) * this.speed;
    this.horizontalSpeed = Math.cos(this.dir) * this.speed;
    if(Math.random() < 0.25) {
        this.horizontalSpeed *= -1;
        this.verticalSpeed *= -1;
    } else if (Math.random() < 0.5) {
        this.horizontalSpeed *= -1;
    } else if (Math.random() < 0.75) {
        this.verticalSpeed *= -1;
    }
    
    //console.log(this.bigBox.minX(), this.bigBox.minY(), this.bigBox.maxX(), this.bigBox.minY());
    this.BBBB = new LineRenderable(this.bigBox.minX(), this.bigBox.minY(), this.bigBox.maxX(), this.bigBox.minY());
    this.BBBB.setPointSize(10);
    this.BBTB = new LineRenderable(this.bigBox.minX(), this.bigBox.maxY(), this.bigBox.maxX(), this.bigBox.maxY());
    this.BBTB.setPointSize(10);
    this.BBLB = new LineRenderable(this.bigBox.minX(), this.bigBox.minY(), this.bigBox.minX(), this.bigBox.maxY());
    this.BBLB.setPointSize(10);
    this.BBRB = new LineRenderable(this.bigBox.maxX(), this.bigBox.minY(), this.bigBox.maxX(), this.bigBox.maxY());
    this.BBRB.setPointSize(10);
    //this.mBottomWing = new SpriteRenderable(wingTexture);
    //this.mTopBound = new LineRenderable();
    //this.mBottomBound = null;
    //this.mLeftBound = null;
    //this.mRightBound = null;


    //GameObject.call(this, this.mHead);

    //this.setSpeed(0.3);
}
gEngine.Core.inheritPrototype(Patrol, GameObject);

Patrol.prototype.draw = function (camera) {
    this.mHead.draw(camera);
    this.mTopWing.draw(camera);
    this.mBottomWing.draw(camera);
    this.BBBB.draw(camera);
    this.BBTB.draw(camera);
    this.BBLB.draw(camera);
    this.BBRB.draw(camera);
};
Patrol.prototype.update = function () {
    
    this.mHead.getXform().setPosition(this.mHead.getXform().getXPos() + this.horizontalSpeed, this.mHead.getXform().getYPos() + this.verticalSpeed);

    
    
    this.topInterpX.setFinalValue(this.mHead.getXform().getXPos() + 10);
    this.topInterpX.updateInterpolation();
    
    this.topInterpY.setFinalValue(this.mHead.getXform().getYPos() + 6);
    this.topInterpY.updateInterpolation();
    
    
    this.mTopWing.getXform().setPosition(this.topInterpX.getValue(), this.topInterpY.getValue());
    this.mTopWing.updateAnimation();
    
    this.bottomInterpX.setFinalValue(this.mHead.getXform().getXPos() + 10);
    this.bottomInterpX.updateInterpolation();
    
    this.bottomInterpY.setFinalValue(this.mHead.getXform().getYPos() - 6);
    this.bottomInterpY.updateInterpolation();
    
    this.mBottomWing.getXform().setPosition(this.bottomInterpX.getValue(), this.bottomInterpY.getValue());
    this.mBottomWing.updateAnimation();
    
    this.headBox.setBounds(this.mHead.getXform().getPosition(), this.mHead.getXform().getWidth(), this.mHead.getXform().getHeight());
    this.topWingBox.setBounds(this.mTopWing.getXform().getPosition(), this.mTopWing.getXform().getWidth(), this.mTopWing.getXform().getHeight());
    this.bottomWingBox.setBounds(this.mBottomWing.getXform().getPosition(), this.mBottomWing.getXform().getWidth(), this.mBottomWing.getXform().getHeight());
    
    this.BBwidth = this.topWingBox.maxX() - this.headBox.minX();
    this.BBheight = (this.topWingBox.maxY() - this.bottomWingBox.minY()) * 1.5;
    this.BBcenterX = this.headBox.minX() + (this.BBwidth / 2);
    this.BBcenterY = this.bottomWingBox.minY() + (this.BBheight / 2);
    var center = vec2.fromValues(this.BBcenterX, this.BBcenterY)
    this.bigBox.setBounds(center, this.BBwidth, this.BBheight);
    
    this.BBBB.setVertices(this.bigBox.minX(), this.bigBox.minY(), this.bigBox.maxX(), this.bigBox.minY());
    this.BBTB.setVertices(this.bigBox.minX(), this.bigBox.maxY(), this.bigBox.maxX(), this.bigBox.maxY());
    this.BBLB.setVertices(this.bigBox.minX(), this.bigBox.minY(), this.bigBox.minX(), this.bigBox.maxY());
    this.BBRB.setVertices(this.bigBox.maxX(), this.bigBox.minY(), this.bigBox.maxX(), this.bigBox.maxY());
//    var xf = this.getXform();
//    var fdir = this.getCurrentFrontDir();
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
//        xf.incRotationByDegree(this.kDeltaDegree);
//        vec2.rotate(fdir, fdir, this.kDeltaRad);
//    }
//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right)) {
//        xf.incRotationByRad(-this.kDeltaRad);
//        vec2.rotate(fdir, fdir, -this.kDeltaRad);
//    }
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Up)) {
//        this.incSpeedBy(this.kDeltaSpeed);
//    }
//    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Down)) {
//        this.incSpeedBy(-this.kDeltaSpeed);
//    }
};
