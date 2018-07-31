//=============================================================================
// TMPlugin - アイテムショートカット
// バージョン: 1.0.3
// 最終更新日: 2017/11/07
// 配布元    : http://hikimoki.sakura.ne.jp/
//-----------------------------------------------------------------------------
// Copyright (c) 2016 tomoaky
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc マップシーンで直接アイテムを使用する機能を追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param shortCutKey
 * @type string
 * @desc 단축 창 호출 키.
 * 初期値: S
 * @default S
 *
 * @param slotNumber
 * @type number
 * @desc 아이템 슬롯의 수입니다.
 * 初期値: 8
 * @default 8
 *
 * @param windowX
 * @type string
 * @desc 단축키 창의 X 좌표.
 * 初期値: 408 ( -1 에서 플레이어의 머리 위에 표시 )
 * @default 408
 *
 * @param windowY
 * @type string
 * @desc 단축키 창 Y 좌표.
 * 初期値: 0
 * @default 0
 *
 * @param windowWidth
 * @type number
 * @desc 단축키 창 너비.
 * 初期値: 408
 * @default 408
 *
 * @param windowHeight
 * @type number
 * @desc 단축 창 높이.
 * 初期値: 64
 * @default 64
 *
 * @param backgroundType
 * @type select
 * @option 通常
 * @value 0
 * @option 暗くする
 * @value 1
 * @option 透明
 * @value 2
 * @desc 단축 창 배경 타입.
 * 初期値: 0 ( 0 = 보통 / 1 = 어둡게 / 2 = 투명)
 * @default 0
 *
 * @param windowHide
 * @type boolean
 * @desc 작업 중 이외는 단축키 창을 숨긴다.
 * 初期値: ON（false = OFF 숨기지 않는다 / true = ON 숨기기)
 * @default true
 *
 * @help
 * TMPlugin - 항목 바로 가기 ver1.0.3
 *
 * 사용법 :
 *
 * 상품 장면에서 항목을 선택한 상태에서 S 키를 누르면 바로 가기
 * 창이 열립니다. 이 창이 열려있는 동안 ← / → 키로
 * 슬롯을 선택하고 결정 키 (enter / space / Z)를 누르면 아이템
 * 단축키에 등록 할 수 있습니다.
 *
 * 위의 방법 이외에도 플러그인 명령을 사용하여 등록 할 수 있습니다.
 *
 * 단축 창은지도 장면에서 S 키를 눌러도 열 수
 * 수 있습니다 등록시와 동일한 조작으로 아이템을 사용할 수 있습니다.
 *
 *이 플러그인은 RPG 만들기 MV Version 1.5.1에서 동작 확인을하고 있습니다.
 *
 *
 * 플러그인 명령 :
 *
 * setItemSC 0 1
 * 상품 1 번 슬롯 0 번에 등록합니다.
 *
 * stopItemSC
 * 상품 바로 가기 기능을 일시적으로 비활성화합니다.
 *
 * startItemSC
 * stopItemSC 의한 비활성화를 해제합니다.
 */

var Imported = Imported || {};
Imported.TMItemShortCut = true;

(function() {
  
  var parameters = PluginManager.parameters('TMItemShortCut');
  var shortCutKey = parameters['shortCutKey'] || 'S';
  var slotNumber = +(parameters['slotNumber'] || 8);
  var windowX = +(parameters['windowX'] || 408);
  var windowY = +(parameters['windowY'] || 0);
  var windowWidth = +(parameters['windowWidth'] || 408);
  var windowHeight = +(parameters['windowHeight'] || 64);
  var backgroundType = +(parameters['backgroundType'] || 0);
  var windowHide = JSON.parse(parameters['windowHide']);

  //-----------------------------------------------------------------------------
  // Input
  //

  Input.keyMapper[shortCutKey.charCodeAt()] = 'shortCut';
  
  //-----------------------------------------------------------------------------
  // Game_System
  //

  Game_System.prototype.isItemShortCutEnabled = function() {
    if (this._itemShortCutEnabled == null) this._itemShortCutEnabled = true;
    return this._itemShortCutEnabled;
  };

  Game_System.prototype.setItemShortCutEnabled = function(flag) {
    this._itemShortCutEnabled = flag;
  };

  //-----------------------------------------------------------------------------
  // Game_Party
  //

  // 객체의 초기화
  var _Game_Party_initialize = Game_Party.prototype.initialize;
  Game_Party.prototype.initialize = function() {
    _Game_Party_initialize.call(this);
    this.initShortCut();
  };
  
  // 바로 가기 초기화
  Game_Party.prototype.initShortCut = function() {
    this._shortCut = [];
    for (var i = 0; i < slotNumber; i++) {
      this._shortCut[i] = 0;
    }
  };
  
  // 단축키 세트
  Game_Party.prototype.setShortCut = function(index, itemId) {
    this._shortCut[index] = itemId;
  };

  //-----------------------------------------------------------------------------
  // Game_Player
  //
  
  // 移動が可能かどうかを返す
  var _Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (Input.isPressed(shortCutKey) && $gameSystem.isItemShortCutEnabled()) return false;
    return _Game_Player_canMove.call(this);
  };
  
  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //

  var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'setItemSC') {
      $gameParty.setShortCut(+args[0], +args[1]);
    } else if (command === 'stopItemSC') {
      $gameSystem.setItemShortCutEnabled(false);
    } else if (command === 'startItemSC') {
      $gameSystem.setItemShortCutEnabled(true);
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_Item
  //
  
  var _Window_ItemList_processHandling = Window_ItemList.prototype.processHandling;
  Window_ItemList.prototype.processHandling = function() {
    _Window_ItemList_processHandling.call(this);
    if (this.isOpen() && this.active && Input.isTriggered('shortCut')) {
      this.playOkSound();
      //this.updateInputData();
      this.deactivate();
      this.callHandler('menu');
    }
  };
  
  //-----------------------------------------------------------------------------
  // Window_ShortCut
  //
  
  function Window_ShortCut() {
    this.initialize.apply(this, arguments);
  }
  
  Window_ShortCut.prototype = Object.create(Window_Selectable.prototype);
  Window_ShortCut.prototype.constructor = Window_ShortCut;
  
  // 객체의 초기화
  Window_ShortCut.prototype.initialize = function(mapFlag) {
    Window_Selectable.prototype.initialize.call(this, windowX, windowY,
                                                windowWidth, windowHeight);
    this._mapFlag = mapFlag;
    this._itemIds = [];
    this._data = [];
    this.refresh();
    this.setBackgroundType(backgroundType);
    if (this._mapFlag) {
      if (windowHide || !$gameSystem.isItemShortCutEnabled()) this.openness = 0;
    } else {
      this.hide();
    }
    this.select(0);
  };
  
  // 표준 패딩을 취득
  Window_ShortCut.prototype.standardPadding = function() {
    return 12;
  };

  // 렬수의 취득
  Window_ShortCut.prototype.maxCols = function() {
    return slotNumber;
  };
  
  // 항목 수의 취득
  Window_ShortCut.prototype.maxItems = function() {
    return slotNumber;
  };
  
  // 항목의 간격
  Window_ShortCut.prototype.spacing = function() {
    return 0;
  };

  // 항목의 높이
  Window_ShortCut.prototype.itemHeight = function() {
    return 40;
  };

  // 현재 선택된 항목
  Window_ShortCut.prototype.item = function() {
    return $dataItems[$gameParty._shortCut[this.index()]];
  };

  // 항목 그리기
  Window_ShortCut.prototype.drawItem = function(index) {
    Window_Selectable.prototype.drawItem.call(this, index);
    var item = $dataItems[$gameParty._shortCut[index]];
    if (item) {
      var rect = this.itemRect(index);
      var n = $gameParty.numItems(item);
      this.changePaintOpacity(n > 0);
      this.drawIcon(item.iconIndex, rect.x + rect.width / 2 - 16,
                    rect.y + rect.height / 2 - 16);
      if (n > 0) {
        this.contents.fontSize = 20;
        this.contents.drawText('' + n, rect.x, rect.y + 16, rect.width - 2,
                               24, 'right');
      }
      this._itemIds[index] = item.id;
      this._data[index] = n;
    } else {
      this._itemIds[index] = 0;
      this._data[index] = 0;
    }
  };
  
  // 프레임 업데이트
  Window_ShortCut.prototype.update = function() {
	  Window_Base.prototype.update.call(this);
	  //this.updateArrows();
	  this.processHandling();
	  this.processTouch();
	  this._stayCount++;
    if (this._mapFlag) {
      if (windowX === -1) {
        this.x = $gamePlayer.screenX() - this.width / 2;
        this.x = this.x.clamp(0, Graphics.width - this.width);
        this.y = $gamePlayer.screenY() - 64 - this.height;
        this.y = this.y.clamp(0, Graphics.height - this.height);
      }
      if (!$gameMap.isEventRunning() && !$gameMessage.isBusy() &&
          (Input.isPressed('#q') && $gameSystem.isItemShortCutEnabled())) {
        this.activate();
      } else {
        this.deactivate();
      }
      this.updateVisiblity();
      var index = Graphics.frameCount % slotNumber;
      var item = $dataItems[$gameParty._shortCut[index]];
      var id = item ? item.id : 0;
      if (this._data[index] !== $gameParty.numItems(item) ||
          this._itemIds[index] !== id) {
        this.redrawItem(index);
      }
    }
  };

  Window_ShortCut.prototype.updateVisiblity = function() {
    if (this.active) {
      this.open();
    } else {
      if (windowHide || !$gameSystem.isItemShortCutEnabled()) {
        this.close();
      } else if ($gameSystem.isItemShortCutEnabled()) {
        this.open();
      }
    }
  };
  
  Window_ShortCut.prototype.playOkSound = function() {
  };

  //-----------------------------------------------------------------------------
  // Scene_Map
  //
  
  // 표시 물 만들기
  var _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
  Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);
    this.createShortCutWindow();
  };
  
  // 단축 창 만들기
  Scene_Map.prototype.createShortCutWindow = function() {
    this._shortCutWindow = new Window_ShortCut(true);
    this._shortCutWindow.setHelpWindow(this._helpWindow);
    this._shortCutWindow.setHandler('ok', this.onShortCutOk.bind(this));
    this.addChild(this._shortCutWindow);
  };

  // 해방
  var _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function() {
    if (!SceneManager.isNextScene(Scene_Battle)) {
      this._shortCutWindow.hide();
    }
    _Scene_Map_terminate.call(this);
  };
  
  // メニュー呼び出し判定
  /*Scene_Map.prototype.isMenuCalled = function() {
    return Input.isTriggered('cancel') || TouchInput.isCancelled();
  };*/
  
  // 바로 가기 실행
  Scene_Map.prototype.onShortCutOk = function() {
    var item = this._shortCutWindow.item();
    var actor = $gameParty.leader();
    if (actor.canUse(item) && (item.scope === 0 || this.isItemEffectsValid())) {
      actor.useItem(item);
      var action = new Game_Action(actor);
      action.setItemObject(item);
      this.itemTargetActors().forEach(function(target) {
        for (var i = 0; i < action.numRepeats(); i++) {
          action.apply(target);
        }
      }, this);
      $gamePlayer.requestAnimation(item.animationId);
      action.applyGlobal();
    } else {
      SoundManager.playBuzzer();
    }
  };

  Scene_Map.prototype.itemTargetActors = function() {
    var item = this._shortCutWindow.item();
    var actor = $gameParty.leader();
    var action = new Game_Action(actor);
    action.setItemObject(item);
    if (!action.isForFriend()) {
      return [];
    } else if (action.isForAll()) {
      return $gameParty.members();
    } else {
      return [actor];
    }
  };

  Scene_Map.prototype.isItemEffectsValid = function() {
    var item = this._shortCutWindow.item();
    var actor = $gameParty.leader();
    var action = new Game_Action(actor);
    action.setItemObject(item);
    return this.itemTargetActors().some(function(target) {
      return action.testApply(target);
    }, this);
  };

  //-----------------------------------------------------------------------------
  // Scene_Item
  //

  var _Scene_Item_create = Scene_Item.prototype.create;
  Scene_Item.prototype.create = function() {
    _Scene_Item_create.call(this);
    this.createShortCutWindow();
  };

  var _Scene_Item_createItemWindow = Scene_Item.prototype.createItemWindow;
  Scene_Item.prototype.createItemWindow = function() {
    _Scene_Item_createItemWindow.call(this);
    this._itemWindow.setHandler('menu', this.onItemShortCut.bind(this));
  };

  Scene_Item.prototype.createShortCutWindow = function() {
    this._shortCutWindow = new Window_ShortCut(false);
    this._shortCutWindow.setHandler('ok',     this.onShortCutOk.bind(this));
    this._shortCutWindow.setHandler('cancel', this.onShortCutCancel.bind(this));
    this.addChild(this._shortCutWindow);
  };

  Scene_Item.prototype.onItemShortCut = function() {
    this._shortCutWindow.show();
    this._shortCutWindow.activate();
    this._shortCutWindow.select(0);
    var index = this._itemWindow.index();
    var rect = this._itemWindow.itemRect(index);
    this._shortCutWindow.x = this._itemWindow.x + this._itemWindow.padding + rect.x +
                             rect.width / 2 - this._shortCutWindow.width / 2;
    this._shortCutWindow.x = this._shortCutWindow.x.clamp(0, Graphics.boxWidth -
                             this._shortCutWindow.width);
    this._shortCutWindow.y = this._itemWindow.y + this._itemWindow.padding + rect.y -
                             this._shortCutWindow.height - 4;
  };

  Scene_Item.prototype.onShortCutOk = function() {
    if (this.isShortCutOk()) {
      SoundManager.playEquip();
      $gameParty.setShortCut(this._shortCutWindow.index(), this.item().id);
      this._shortCutWindow.refresh();
    } else {
      SoundManager.playBuzzer();
    }
    this._shortCutWindow.activate();
  };

  Scene_Item.prototype.isShortCutOk = function() {
    var item = this.item();
    return DataManager.isItem(item) ? item.occasion !== 1 : false;
  };
  
  Scene_Item.prototype.onShortCutCancel = function() {
    this.hideSubWindow(this._shortCutWindow);
  };

})();
