/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function DyePackSet(minionSprite) {
    GameObjectSet.call(this);
    this.kMinionSprite = minionSprite;
    this.mTotalDecelaration = 0;
    
}

gEngine.Core.inheritPrototype(DyePackSet, GameObjectSet);

DyePackSet.prototype.update = function(camera) {
    
    for (var i = 0; i < this.mSet.length; i++) {
        var dyePack = this.mSet[i];
        if (!dyePack.isAlive()) {
           this.mSet.splice(i, 1);
           i = 0; 
        }else {
            dyePack._checkBound(camera);
        }
    }
    GameObjectSet.prototype.update.call(this);
};

DyePackSet.prototype.createDyePack = function(spawnPos) {
    var packClone = new DyePack(this.kMinionSprite);
    packClone.getXform().setPosition(spawnPos[0], spawnPos[1]);
    packClone.getXform().setSize(2, 3.25);
    GameObjectSet.prototype.addToSet.call(this, packClone);
};

DyePackSet.prototype.hitEvent = function(index) {
    
};

DyePackSet.prototype.hitAllEvent = function() {
    for (var i = 0; i < this.mSet.length; i++) {
        this.hitEvent(i);
    }
};

