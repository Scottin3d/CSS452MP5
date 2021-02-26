
"use strict";

//
////
// damped simple harmonic shake motion
//
// state is the CameraState to be shaked.
function HeroShake(state, xDelta, yDelta, shakeFrequency, shakeDuration) {
    this.mOrgCenter = vec2.clone(state.getCenter());
    this.mShakeCenter = vec2.clone(this.mOrgCenter);
    this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
}

HeroShake.prototype.updateShakeState = function () {
    var s = this.mShake.getShakeResults();
    vec2.add(this.mShakeCenter, this.mOrgCenter, s);
};

HeroShake.prototype.shakeDone = function () {
    return this.mShake.shakeDone();
};

HeroShake.prototype.getCenter = function () {
    return this.mShakeCenter; 
};

HeroShake.prototype.setRefCenter = function (c) {
    this.mOrgCenter[0] = c[0];
    this.mOrgCenter[1] = c[1];
};