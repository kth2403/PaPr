//=============================================================================
// SAN_IntervalMapScene.js
//=============================================================================
// Copyright (c) 2016 Sanshiro
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc SAN_IntervalMapScene ver1.00
 * Prevent frame jump at starting map scene.
 * @author Sanshiro https://twitter.com/rev2nym
 * 
 * @help
 * Prevent frame jump when characters move at starting map scene
 * by waiting interval.
 * 
 * There is no plugin commands.
 * 
 * It's possible to commercial use, distribute, and modify under the MIT license.
 * But, don't eliminate and don't alter a comment of the beginning.
 * If it's good, please indicate an author name on credit.
 * 
 * Author doesn't shoulder any responsibility in all kind of damage by using this.
 * And please don't expect support. X(
 * 
 * @param IntervalFrame
 * @desc Waiting frame at starting map scene.
 * @default 20
 */

/*:ja
 * @plugindesc インターバルマップシーン ver1.00
 * マップシーン開始直後の移動のカクつきを抑えます。
 * @author サンシロ https://twitter.com/rev2nym
 * @version 1.00 2016/04/02 公開
 * 
 * @help
 * マップシーン開始時に待機時間を設けキャラクター移動のカクつきを抑えます。
 * 
 * プラグインコマンドはありません。
 * 
 * MITライセンスのもと、商用利用、改変、再配布が可能です。
 * ただし冒頭のコメントは削除や改変をしないでください。
 * よかったらクレジットに作者名を記載してください。
 * 
 * これを利用したことによるいかなる損害にも作者は責任を負いません。
 * サポートは期待しないでください＞＜。
 * 
 * @param IntervalFrame
 * @desc マップシーン開始の待機フレーム数です。
 * @default 20
 */

var Imported = Imported || {};
Imported.SAN_IntervalMapScene = true;

var Sanshiro = Sanshiro || {};
Sanshiro.IntervalMapScene = Sanshiro.IntervalMapScene || {};

//-----------------------------------------------------------------------------
// Scene_Map
//
// シーンマップ

Sanshiro.IntervalMapScene.Scene_Map_initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
    Sanshiro.IntervalMapScene.Scene_Map_initialize.call(this);
    this._intervalFrame = PluginManager.parameters('SAN_IntervalMapScene')['IntervalFrame'];
    this._intervalCount = 0;
    this._isEndInterval = false;
};

Scene_Map.prototype.isEndInterval = function() {
    return this._isEndInterval;
}

Scene_Map.prototype.updateIntervalCount = function() {
    if (this._intervalCount >= this._intervalFrame) {
        this._isEndInterval = true;
    } else {
        this._isEndInterval = false;
        this._intervalCount += 1;
    }
}

Sanshiro.IntervalMapScene.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    Sanshiro.IntervalMapScene.Scene_Map_start.call(this);
    this._intervalCount = 0;
};

Sanshiro.IntervalMapScene.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    Sanshiro.IntervalMapScene.Scene_Map_update.call(this);
    this.updateIntervalCount();
};

//-----------------------------------------------------------------------------
// Game_CharacterBase
//
// キャラクターベース

Sanshiro.IntervalMapScene.Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
    if (!SceneManager._scene.isEndInterval()){
        return;
    }
    Sanshiro.IntervalMapScene.Game_CharacterBase_update.call(this);
};
