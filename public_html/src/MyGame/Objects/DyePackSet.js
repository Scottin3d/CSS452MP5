/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function DyePackSet() {
    this.mSet = [];
    this.mTotalDecelaration = 0;
    
}

gEngine.Core.inheritPrototype(PatrolSet, GameObjectSet);

DyePackSet.prototype.createDyePack = function(spawnPos) {
    var packClone = new DyePack(this.kMinionSprite);
    packClone.getXform().setPosition(spawnPos[0], spawnPos[1]);
    packClone.getXform().setSize(2, 3.25);
    this.mSet.push(packClone);
};

