/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function UIelement() {
    this.element = new Renderable();
    this.element.setColor([1, 1, 1, 0]);
    this.element.getXform().setPosition(35, 50);
    this.element.getXform().setSize(9, 12);
    this.element.setElementPixelPositions(0, 120, 0, 180);
    GameObject.call(this, this.element);
}

UIelement.prototype._mouseDCX = function () {
    return gEngine.Input.getMousePosX() - this.element.getXform().getXPos();
};
UIelement.prototype._mouseDCY = function () {
    return gEngine.Input.getMousePosY() - this.element.getXform().getYPos();
};

