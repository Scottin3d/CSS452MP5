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
    
    this.heroState = new HeroState(this.mSrite.getXform().getPosition(), this.mSrite.getXform().getSize());
    this.heroShake = null;
    GameObject.call(this, this.mSrite);
}

gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    if (this.heroShake !== null) {
        if (this.heroShake.shakeDone()) {
            this.heroShake = null;
        } else {
            this.heroShake.setRefCenter(this.mSrite.getXform().getPosition());
            this.heroShake.updateShakeState();
        }
    }
    this.heroState.updateHeroState();
    
    // Q
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)){
        this.hit([2, 2], 4, 60);
        
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
    
    this.heroShake = new HeroShake(this.heroState, amplitude[0], amplitude[1], frequency, duration);
    
};