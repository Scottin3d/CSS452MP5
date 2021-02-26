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
    
    this.mOrigLocation = null;
    this.kSpeed = 2;
    this.kDelta = 0.3;

    this.mSrite = new SpriteRenderable(spriteTexture);
    this.mSrite.setColor([1, 1, 1, 0]);
    this.mSrite.getXform().setPosition(35, 50);
    this.mSrite.getXform().setSize(9, 12);
    this.mSrite.setElementPixelPositions(0, 120, 0, 180);
    
    
    //this.heroState = new HeroState(this.mSrite.getXform().getPosition(), this.mSrite.getXform().getSize());
    this.heroShake = null;
    this.xInterp = new Interpolate();
    
    this.topInterpX = new Interpolate(this.mSrite.getXform().getXPos(), 120, 0.05);
    this.topInterpY = new Interpolate(this.mSrite.getXform().getYPos(), 120, 0.05);
    
    GameObject.call(this, this.mSrite);
};

gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    if (this.heroShake !== null) {
        if (!this.heroShake.shakeDone()) {
            var newResults = this.heroShake.getShakeResults();
            var newSize = [this.mOrigLocation[0] + newResults[0],
                this.mOrigLocation[1] + newResults[1]];
            this.getXform().setSize(newSize[0], newSize[1]);
        }else{
            this.heroShake = null;  
        }
    }
    
    // Q
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)){
        this.hit([2, 2], 4, 60);
        
    }
    
    
    
    
};

Hero.prototype.updatePostion = function(mousePos){
    this.topInterpX.setFinalValue(mousePos[0] + 10);
    this.topInterpX.updateInterpolation();
    
    this.topInterpY.setFinalValue(mousePos[1] + 6);
    this.topInterpY.updateInterpolation();
    
    this.getXform().setPosition(this.topInterpX.getValue(), this.topInterpY.getValue());
    //this.updateAnimation();

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
    
    //this.heroShake = new HeroShake(this.heroState, amplitude[0], amplitude[1], frequency, duration);
    this.heroShake = new ShakePosition(amplitude[0], amplitude[1], frequency, duration);
    this.mOrigLocation = vec2.clone(this.getXform().getSize());
    this.kSpeed = 0;
    
};