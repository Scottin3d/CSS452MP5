/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function UIelement(element, callback) {
    //callback();
    this.element = element;
    this.myCallback = callback;
};
UIelement.prototype.getElement = function() {
    return this.element;
};
UIelement.prototype.runCallback = function() {
    //console.log("should be calling back");
    this.myCallback();
};


