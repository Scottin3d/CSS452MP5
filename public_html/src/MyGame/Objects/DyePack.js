/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObject: false, SpriteRenderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function DyePack(spriteTexture) {
    this.kRefWidth = 80;
    this.kRefHeight = 130;
    this.kSpeed = 2;
    this.mShakePack = null;
    this.mAlive = true;
    this.mSpawnTime = new Date().getTime();
    this.mActive = true;
    this.mOrigLocation = null;
    this.mDeceleration = 0;

    this.mDyePack = new SpriteRenderable(spriteTexture);
    this.mDyePack.setColor([1, 1, 1, 0]);
    this.mDyePack.setElementPixelPositions(510, 595, 23, 153);
    GameObject.call(this, this.mDyePack);
}
gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.update = function () {
    var currentTime = new Date();
    if (currentTime.getTime() - this.mSpawnTime >= 5000) {
        this.mAlive = false;
    }
    
    if (this.mShakePack !== null) {
        if (!this.mShakePack.shakeDone()) {
            var newResults = this.mShakePack.getShakeResults();
            var newPos = [this.mOrigLocation[0] + newResults[0],
                this.mOrigLocation[1] + newResults[1]];
            this.getXform().setPosition(newPos[0], newPos[1]);
        }else {
            this.mAlive = false;
        }
    } else {
        if (this.kSpeed > 0){
            this.kSpeed -= this.mDeceleration;
        }else {
            this.kSpeed = 0;
        }

        if (this.kSpeed === 0) {
            this.mAlive = false;
        }
    }
    
    
    var xform = this.getXform();    

    if (this.isVisible()) {
        xform.incXPosBy(this.kSpeed);
    }
};

DyePack.prototype._checkBound = function(camera) {
    var mainCameraSize = camera.getWCWidth();
    var mainCameraPos = camera.getWCCenter()[0];
    var dyePackPos = this.getXform().getPosition();
    var dyePackSize = this.getXform().getSize();
    // if dye pack is out of frame, remove from array
    if (dyePackPos[0] - dyePackSize[0] / 2 >= mainCameraPos + mainCameraSize / 2) {
        this.mAlive = false;
    }
};

DyePack.prototype.draw = function (camera) {
    this.mLifeSpan++;
    this.mDyePack.draw(camera);
};

DyePack.prototype.shake = function() {
    if (this.mActive){
        this.mShakePack = new ShakePosition(4, 0.2, 20, 300);
        this.mOrigLocation = vec2.clone(this.getXform().getPosition());
        this.kSpeed = 0;
    }
};

DyePack.prototype.isAlive = function() {
    return this.mAlive;
};

DyePack.prototype.getActive = function() {
    return this.mActive;
};

DyePack.prototype.possibleHit = function(value) {
    if (value == 1) {
        this.shake();
        this.mActive = false;
    }else if (value == 0) {
        this.mDeceleration = 0.1;
    } else {
        this.mDeceleration = 0
    }
};