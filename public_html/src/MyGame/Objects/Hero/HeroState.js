/* 
 * File: CameraState.js
 * Defines the state of a camera to faciliate the manipulation of this state
 */

/*jslint node: true, vars: true, bitwise: true */
/*global gEngine, Interpolate, InterpolateVec2 */
/* find out more about jslint: http://www.jslint.com/help.html */
"use strict";

//
function HeroState(center, size) {
    this.kCycles = 300;  // number of cycles to complete the transition
    this.kRate = 0.1;  // rate of change for each cycle
    this.mCenter = new InterpolateVec2(center, this.kCycles, this.kRate);
    this.mWidth = new Interpolate(size[0], this.kCycles, this.kRate);
    this.mHeight = new Interpolate(size[1], this.kCycles, this.kRate);

}

// <editor-fold desc="Public Methods">
HeroState.prototype.getCenter = function () { return this.mCenter.getValue(); };
HeroState.prototype.getWidth = function () { return this.mWidth.getValue(); };
HeroState.prototype.getHeight = function () { return this.mHeight.getValue(); };

HeroState.prototype.setCenter = function (c) { this.mCenter.setFinalValue(c); };
HeroState.prototype.setWidth = function (w) { this.mWidth.setFinalValue(w); };
HeroState.prototype.setHeight = function (w) { return this.mHeight.setFinalValue(w); };

HeroState.prototype.updateHeroState = function () {
    this.mCenter.updateInterpolation();
    this.mWidth.updateInterpolation();
    this.mHeight.updateInterpolation();
};

HeroState.prototype.configInterpolation = function (stiffness, duration) {
    this.mCenter.configInterpolation(stiffness, duration);
    this.mWidth.configInterpolation(stiffness, duration);
    this.mHeight.configInterpolation(stiffness, duration);
};
// </editor-fold>