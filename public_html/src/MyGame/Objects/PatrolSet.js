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
    if(this.autoSpawn && this.timer >= this.spawnTime) {
        this.timer -= this.spawnTime;
        var mPatrol = new Patrol(this.kMinionSprite);
        this.addToSet(mPatrol);
    } else {
        this.timer += 1;
    }
    var i;
    for (i = 0; i < this.mSet.length; i++) {
        this.mSet[i].toggleBound(this.showBound);
        this.mSet[i].update();
    }
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