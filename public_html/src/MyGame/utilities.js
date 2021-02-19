
fontSprite = "assets/Consolas-72.png";
minionSprite = "assets/minion_sprite.png";
boundSprite = "assets/bounds.png";
font32 = "assets/fonts/Consolas-32";
font24 = "assets/fonts/Consolas-24";
font16 = "assets/fonts/Consolas-16";

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
    a: 1
  } : null;
}