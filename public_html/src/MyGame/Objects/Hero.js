/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hero(spriteTexture) {
    this.heroHit = false;
    this.heroHitTime = 0;
    this.heroHitInterval = 0;
    this.heroHitAmplitude = null;
    this.heroHitFrequency = null;
    this.heroHitDuration = null;
    
    this.kDelta = 0.3;

    this.mSrite = new SpriteRenderable(spriteTexture);
    this.mSrite.setColor([1, 1, 1, 0]);
    this.mSrite.getXform().setPosition(35, 50);
    this.mSrite.getXform().setSize(9, 12);
    this.mSrite.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.mSrite);
}

gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    if(this.heroHit){
        console.log(Date.now() - this.heroHitTime);
        if(Date.now() - this.heroHitTime < this.heroHitDuration){
            var sizeX = this.getXform().getWidth() * Math.sin(Date.now() /  this.heroHitFrequency);
            console.log(sizeX);
            
        }else{
            this.heroHit = false;
            this.heroHitTime = 0;
            this.heroHitAmplitude = null;
            this.heroHitFrequency = null;
            this.heroHitDuration = null;
        }
    }
    
    
    
    // control by WASD
    var xform = this.getXform();
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W)) {
        xform.incYPosBy(this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S)) {
        xform.incYPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A)) {
        xform.incXPosBy(-this.kDelta);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        xform.incXPosBy(this.kDelta);
    }
};

Hero.prototype.checkBounds = function(center, size){
    var heroPos = this.getXform().getPosition();
    var camW = size[0] / 2;
    var camH = size[1] / 2;
    
    if(heroPos[0] >= (center[0] - camW) && heroPos[0] <= (center[0] + camW) &&
       heroPos[1] <= (center[1] + camH) && heroPos[1] >= (center[1] - camH)){
        return true;
    }
    
    return false;
};

Hero.prototype.hit = function(amplitude, frequency, duration){
    this.heroHit = true;
    this.heroHitTime = Date.now();
    this.heroHitAmplitude = amplitude;
    this.heroHitFrequency = frequency;
    this.heroHitDuration = duration;
    
};