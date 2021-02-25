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
        var mainCameraSize = camera.getWCWidth();
        var mainCameraPos = camera.getWCCenter()[0];
        var firstDyePackPos = this.mSet[0].getXform().getPosition();
        var firstDyePackSize = this.mSet[0].getXform().getSize();
        // if dye pack is out of frame, remove from array
        if (firstDyePackPos[0] - firstDyePackSize[0] / 2 >= mainCameraPos + mainCameraSize / 2) {
            this.mSet.splice(i, 1);
            i = 0;
        }
    }
    GameObjectSet.prototype.update.call(this);
}

DyePackSet.prototype.createDyePack = function(spawnPos) {
    var packClone = new DyePack(this.kMinionSprite);
    packClone.getXform().setPosition(spawnPos[0], spawnPos[1]);
    packClone.getXform().setSize(2, 3.25);
    GameObjectSet.prototype.addToSet.call(this, packClone);
};

