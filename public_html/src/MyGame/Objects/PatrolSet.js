/* File: PatrolSet.js 
 *
 * Support for working with a set of GameObjects
 */

/*jslint node: true, vars: true */
/*global gEngine: false, GameObjectSet: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function PatrolSet(minionSprite) {
    this.kMinionSprite = minionSprite;
    this.autoSpawn = false;
    this.spawnTime = (2 + Math.random()) * 60;
    this.timer = 0;
    this.showBound = false;
    this.mSet = [];
}
gEngine.Core.inheritPrototype(PatrolSet, GameObjectSet);


PatrolSet.prototype.update = function () {
    if(this.timer >= this.spawnTime) {
        this.timer -= this.spawnTime;
        if(this.autoSpawn) {
            var mPatrol = new Patrol(this.kMinionSprite);
            this.addToSet(mPatrol);
        }
    } else {
        this.timer += 1;
    }
    var newMSet = this.mSet;
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].toggleBound(this.showBound);
        this.mSet[i].update();
        if(this.mSet[i].timeForDeath()) {
            newMSet.splice(newMSet.indexOf(this.mSet[i]), 1);
        }
    }
    this.mSet = newMSet;
};

PatrolSet.prototype.setautoSpawn = function() {
    this.autoSpawn = !this.autoSpawn;
};

PatrolSet.prototype.spawnNew = function() {
   var mPatrol = new Patrol(this.kMinionSprite);
   this.addToSet(mPatrol);
};

PatrolSet.prototype.toggleBound = function() {
    this.showBound = !this.showBound;
};


PatrolSet.prototype.isAutoSpawnOn = function() {
    return this.autoSpawn;
};

PatrolSet.prototype.patrolSize = function() {
    return this.mSet.length;
};


PatrolSet.prototype.checkCollision = function(pack) {
    var i;
    var toReturn = -1;
    var pixelCol = false;
    for (i = 0; i < this.mSet.length; i++) {
        var patrol = this.mSet[i];
        var otherBbox = pack.getBBox();
        if(otherBbox.boundCollideStatus(patrol.getBB()) !== 0) {
            if (otherBbox.boundCollideStatus(patrol.getHeadBB()) !== 0) {
                if ((typeof patrol.mHead.pixelTouches === "function") && (typeof pack.getRenderable().pixelTouches === "function")) {
                    patrol.mHead.setColorArray();
                    pack.getRenderable().setColorArray();
                    var wcTouchPos = [];
                    var touched = patrol.mHead.pixelTouches(pack.getRenderable(), wcTouchPos);
                    if(touched) {
                        this.mSet[i].headHit();
                        pixelCol = true;
                    }
                }
            } 
            if (otherBbox.boundCollideStatus(patrol.getTWBB()) !== 0) {
                console.log("in top wing");
                if ((typeof patrol.mTopWing.pixelTouches === "function") && (typeof pack.getRenderable().pixelTouches === "function")) {
                    patrol.mTopWing.setColorArray();
                    pack.getRenderable().setColorArray();
                    var wcTouchPos = [];
                    var touched = patrol.mTopWing.pixelTouches(pack.getRenderable(), wcTouchPos);
                    if(touched) {
                        this.mSet[i].TWHit();
                        pixelCol = true;
                    }
                }
            } 
            if (otherBbox.boundCollideStatus(patrol.getBWBB()) !== 0) {
                console.log("in bottom wing");
                if ((typeof patrol.mBottomWing.pixelTouches === "function") && (typeof pack.getRenderable().pixelTouches === "function")) {
                    patrol.mBottomWing.setColorArray();
                    pack.getRenderable().setColorArray();
                    var wcTouchPos = [];
                    var touched = patrol.mBottomWing.pixelTouches(pack.getRenderable(), wcTouchPos);
                    if(touched) {
                        this.mSet[i].BWHit();
                        pixelCol = true;
                    }
                }
            } 
            if(pixelCol) {
                return 1;
            } else {
                toReturn = 0;
            }
        }
    }
    return toReturn;
};

PatrolSet.prototype.simulateHit = function() {
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].headHit();
    }
};