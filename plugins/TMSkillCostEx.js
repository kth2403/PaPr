﻿//=============================================================================
// TMVplugin - スキルコスト拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.22b
// 最終更新日: 2016/06/13
//=============================================================================

/*:
 * @plugindesc ＭＰやＴＰの代わりにＨＰやアイテムを消費するスキルを
 * 設定できるようになります。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param hpVNumberId
 * @desc スキル使用時にコスト消費前の残りHPを代入する変数番号。
 * 初期値: 0 ( 1 以上を指定すると有効になります)
 * @default 0
 *
 * @param mpVNumberId
 * @desc スキル使用時にコスト消費前の残りMPを代入する変数番号。
 * 初期値: 0 ( 1 以上を指定すると有効になります)
 * @default 0
 *
 * @param ignoreEnemyItemCost
 * @desc 敵がスキルを使用する際にアイテムコストを無視するかどうか
 * 初期値: 1 ( 0 = パーティのアイテムを消費 / 1 = 無視)
 * @default 1
 *
 * @help
 * 使い方:
 *   スキルのメモ欄にタグを書き込むことでコストを追加できます。
 *
 *   データベースで 消耗しない に設定したアイテムをコストとした場合、
 *   スキル使用時に必要だが消費はしないという扱いになります。
 *
 *   ＨＰをコストとして設定した場合、残りＨＰがコストと同値では
 *   使用できません。ただし、スキルに hpCostNoSafety タグがある場合は
 *   残りＨＰがコスト以下でもスキルが使用できます。
 *   当然使用したアクターは戦闘不能になります。
 *
 *   経験値をコストとして設定し、一緒に expCostNoLevelDown タグを
 *   設定している場合、コストの支払いによってレベルが下がる状況では
 *   スキルの使用ができなくなります。
 *
 * プラグインパラメータ:
 *   コスト消費前の残りHP(MP)を指定した変数に代入し、これにより
 *   消費したHP(MP)の量をダメージ計算式に反映させることができます。
 *   hpVNumberId の値を 1 にすると、ゲーム変数１番にコスト消費前の
 *   残りHPが代入されます。ダメージ計算式に $gameVariables.value(1) と
 *   書けばゲーム変数１番の値を参照することができます。
 *
 * メモ欄タグ（スキル）:
 *   <hpCost:10>          # スキルのコストとしてＨＰ１０を設定
 *   <hpRateCost:50>      # スキルのコストとして最大ＨＰの５０％を設定
 *   <hpCRateCost:25>     # スキルのコストとして残りＨＰの２５％を設定
 *   <hpCostNoSafety>     # ＨＰコスト支払いによる戦闘不能を許可する
 *   <mpRateCost:100>     # スキルのコストとして最大ＭＰの１００％を設定
 *   <mpCRateCost:50>     # スキルのコストとして残りＭＰの５０％を設定
 *   <mpCostNoMcr>        # ＭＰコストから特徴『ＭＰ消費率』の効果を除外
 *   <itemCost:I1*2>      # スキルのコストとしてアイテム１番２個を設定
 *   <itemCost:W2*1>      # スキルのコストとして武器２番１個を設定
 *   <itemCost:A5*1>      # スキルのコストとして防具５番１個を設定
 *   <expCost:50>         # スキルのコストとして経験値５０を設定
 *   <expCostNoLevelDown> # 経験値コストによるレベルダウンを禁止
 *   <goldCost:100>       # スキルのコストとしてお金１００Ｇを設定
 *   <vnCost:3*1>         # スキルのコストとしてゲーム変数３番の値１を設定
 *
 * vnCostタグの特殊な使い方:
 *   メモ欄タグ vnCost のみ制御文字を利用して変数の中身をパラメータとして
 *   設定することができます。
 *   <vnCost:\V[14]*\V[15]>
 *   たとえば上記のようなタグがついたスキルを使用する際に、変数１４番の
 *   値が 16 、変数１５番の値が 3 だった場合は、変数１６番の値を３消費
 *   することになります。
 *
 * プラグインコマンドはありません。
 * 
 */

var Imported = Imported || {};
Imported.TMSkillCostEx = true;

(function() {

  var parameters = PluginManager.parameters('TMSkillCostEx');
  var hpVNumberId = +parameters['hpVNumberId'];
  var mpVNumberId = +parameters['mpVNumberId'];
  var ignoreEnemyItemCost = parameters['ignoreEnemyItemCost'] === '1' ? true : false;
  
  //-----------------------------------------------------------------------------
  // Game_BattleBase
  //

  Game_BattlerBase.prototype.skillHpCost = function(skill) {
    var result = 0;
    if (skill.meta.hpCost) {
      result += +skill.meta.hpCost;
    }
    if (skill.meta.hpRateCost) {
      result += +skill.meta.hpRateCost * this.mhp / 100;
    }
    if (skill.meta.hpCRateCost) {
      result += +skill.meta.hpCRateCost * this._hp / 100;
    }
    return Math.floor(result);
  };
  
  Game_BattlerBase.prototype.skillMpCost = function(skill) {
    var result = skill.mpCost;
    if (skill.meta.mpRateCost) {
      result += +skill.meta.mpRateCost * this.mmp / 100;
    }
    if (skill.meta.mpCRateCost) {
      result += +skill.meta.mpCRateCost * this._mp / 100;
    }
    if (!skill.meta.mpCostNoMcr) {
      result *= this.mcr;
    }
    return Math.floor(result);
  };

  Game_BattlerBase.prototype.skillItemCost = function(skill) {
    if (!this.isActor() && ignoreEnemyItemCost) {
      return null;
    }
    if (skill.meta.itemCost) {
      var re = /(i|w|a)(\d+)\*(\d+)/i;
      var match = re.exec(skill.meta.itemCost);
      if (match) {
        var itemCost = {};
        var s = match[1].toUpperCase();
        if (s === 'I') {
          itemCost.item = $dataItems[+match[2]];
        } else if (s === 'W') {
          itemCost.item = $dataWeapons[+match[2]];
        } else {
          itemCost.item = $dataArmors[+match[2]];
        }
        itemCost.num = +match[3];
        return itemCost;
      }
    }
    return null;
  };

  Game_BattlerBase.prototype.skillExpCost = function(skill) {
    return !this.isEnemy() && skill.meta.expCost ? +skill.meta.expCost : 0;
  };
  
  Game_BattlerBase.prototype.skillGoldCost = function(skill) {
    return !this.isEnemy() && skill.meta.goldCost ? +skill.meta.goldCost : 0;
  };
  
  Game_BattlerBase.prototype.skillVNumberCost = function(skill) {
    if (skill.meta.vnCost) {
      var result = {};
      var vnCost = skill.meta.vnCost.split('*');
      var re = /\\V\[(\d+)\]/i;
      var match = re.exec(vnCost[0]);
      result.index = match ? $gameVariables.value(+match[1]) : +vnCost[0];
      var match = re.exec(vnCost[1]);
      result.num = match ? $gameVariables.value(+match[1]) : +vnCost[1];
      return result;
    }
    return null;
  };

  var _Game_BattleBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
  Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    if (!this.canPaySkillHpCost(skill) ||
        !this.canPaySkillItemCost(skill) ||
        !this.canPaySkillExpCost(skill) ||
        !this.canPaySkillGoldCost(skill) ||
        !this.canPaySkillVNumberCost(skill)) {
      return false;
    }
    return _Game_BattleBase_canPaySkillCost.call(this, skill);
  };

  Game_BattlerBase.prototype.canPaySkillHpCost = function(skill) {
    return skill.meta.hpCostNoSafety || this._hp > this.skillHpCost(skill);
  };
  Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
	  if(!(this._mp >= this.skillMpCost(skill)) ) {
		  $gameTemp.reserveCommonEvent(12);
	  }
	    return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
	};
  Game_BattlerBase.prototype.canPaySkillItemCost = function(skill) {
    var itemCost = this.skillItemCost(skill);
    return !itemCost || $gameParty.numItems(itemCost.item) >= itemCost.num;
  };
  
  Game_BattlerBase.prototype.canPaySkillExpCost = function(skill) {
    var expCost = this.skillExpCost(skill);
    return expCost === 0 || (this.currentExp() >= expCost &&
           (!skill.meta.expCostNoLevelDown || this.currentExp() - expCost >=
           this.currentLevelExp()));
  };
  
  Game_BattlerBase.prototype.canPaySkillGoldCost = function(skill) {
    return $gameParty.gold() >= this.skillGoldCost(skill);
  };
  
  Game_BattlerBase.prototype.canPaySkillVNumberCost = function(skill) {
    var vnCost = this.skillVNumberCost(skill);
    return !vnCost || $gameVariables.value(vnCost.index) >= vnCost.num;
  };
  
  var _Game_BattleBase_paySkillCost = Game_BattlerBase.prototype.paySkillCost;
  Game_BattlerBase.prototype.paySkillCost = function(skill) {
    if (hpVNumberId > 0) $gameVariables.setValue(hpVNumberId, this._hp);
    if (mpVNumberId > 0) $gameVariables.setValue(mpVNumberId, this._mp);
    this._hp -= Math.min(this.skillHpCost(skill), this._hp);
    var itemCost = this.skillItemCost(skill);
    if (itemCost && this.isItemCostValid(itemCost.item)) {
      $gameParty.loseItem(itemCost.item, itemCost.num, false)
    }
    var expCost = this.skillExpCost(skill);
    if (expCost) {
      var newExp = this.currentExp() - expCost;
      this.changeExp(newExp, this.shouldDisplayLevelUp());
    }
    $gameParty.loseGold(this.skillGoldCost(skill));
    var vnCost = this.skillVNumberCost(skill);
    if (vnCost) {
      var n = $gameVariables.value(vnCost.index) - vnCost.num;
      $gameVariables.setValue(vnCost.index, n);
    }
    _Game_BattleBase_paySkillCost.call(this, skill);
  };
  
  Game_BattlerBase.prototype.isItemCostValid = function(item) {
    return !DataManager.isItem(item) || item.consumable;
  };

})();
