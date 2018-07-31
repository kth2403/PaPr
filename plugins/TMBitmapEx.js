//=============================================================================
// TMVplugin - ビットマップ拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.1
// 最終更新日: 2016/04/18
//=============================================================================

/*:
 * @plugindesc 角丸の矩形を描画する機能を追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help
 * 使い方:
 *   Bitmapに以下のメソッドを追加します。
 *
 *   fillRoundRect(x, y, width, height, radius, color)
 *   座標(x, y)を左上として幅width、高さheightの角丸矩形を描画します、
 *   radiusは丸部分の半径、colorは塗りつぶす色を文字列で指定してください。
 *   例）bitmap.fillRoundRect(0, 0, 200, 48, 6, '#000000');
 *
 *   gradientFillRoundRect(x, y, width, height, radius, color1, color2, vertical)
 *   グラデーション付きの角丸矩形を描画します。verticalが真ならグラデーションの
 *   向きが縦方向になります。
 *
 *   fillStar(x, y, width, height, color)
 *   座標(x, y)を左上として幅width、高さheightの範囲に内接する星を描画します。
 *   例）bitmap.fillStar(0, 0, 48, 48, '#ffff00');
 *
 *   gradientFillStar(x, y, width, height, color1, color2, vertical)
 *   グラデーション付きの星を描画します。verticalが真ならグラデーションの向きが
 *   縦方向になります。
 *
 *
 */

var Imported = Imported || {};
Imported.TMBitmapEx = true;

(function() {

  Bitmap.prototype.fillRoundRect = function(x, y, width, height, radius, color) {
    var context = this._context;
    var pi = Math.PI;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x + radius, y + radius, radius, -pi, -0.5 * pi, false);
    context.arc(x + width - radius, y + radius, radius, -0.5 * pi, 0, false);
    context.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * pi, false);
    context.arc(x + radius, y + height - radius, radius, 0.5 * pi, pi, false);
    context.fill();
    context.restore();
    this._setDirty();
  };

  Bitmap.prototype.gradientFillRoundRect = function(x, y, width, height, radius,
                                                    color1, color2, vertical) {
    var context = this._context;
    var pi = Math.PI;
    var grad = vertical ? context.createLinearGradient(x, y, x, y + height) :
               context.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.beginPath();
    context.arc(x + radius, y + radius, radius, -pi, -0.5 * pi, false);
    context.arc(x + width - radius, y + radius, radius, -0.5 * pi, 0, false);
    context.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * pi, false);
    context.arc(x + radius, y + height - radius, radius, 0.5 * pi, pi, false);
    context.fill();
    context.restore();
    this._setDirty();
  };

  Bitmap.prototype.fillStar = function(x, y, width, height, color) {
    var context = this._context;
    var pi = Math.PI;
    var cx = x + width / 2;
    var cy = y + height / 2;
    var r = pi + pi / 2;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(Math.cos(r) * width / 2 + cx, Math.sin(r) * height / 2 + cy);
    for (var i = 0; i < 5; i++) {
      r += pi * 4 / 5;
      context.lineTo(Math.cos(r) * width / 2 + cx, Math.sin(r) * height / 2 + cy);
    }
    context.fill();
    context.restore();
    this._setDirty();
  };

  Bitmap.prototype.gradientFillStar = function(x, y, width, height, color1, color2,
                                               vertical) {
    var context = this._context;
    var pi = Math.PI;
    var cx = x + width / 2;
    var cy = y + height / 2;
    var r = pi + pi / 2;
    var grad = vertical ? context.createLinearGradient(x, y, x, y + height) :
               context.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.beginPath();
    context.moveTo(Math.cos(r) * width / 2 + cx, Math.sin(r) * height / 2 + cy);
    for (var i = 0; i < 5; i++) {
      r += pi * 4 / 5;
      context.lineTo(Math.cos(r) * width / 2 + cx, Math.sin(r) * height / 2 + cy);
    }
    context.fill();
    context.restore();
    this._setDirty();
  };

})();
