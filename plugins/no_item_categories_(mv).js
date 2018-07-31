//=============================================================================
// No Item Categories
// by Shaz
// Last Updated: 2016.01.20
//=============================================================================

/*:
 * @plugindesc Removes category list from Items window
 * @author Shaz
 *
 * @help This plugin has no plugin commands
 *
 * Note - this plugin overwrites a number of functions from Scene_Item and
 * Scene_Shop.  It will likely not be compatible with other plugins if they
 * overwrite or alias the same functions.
 *
 */

(function() {
  Window_ItemList.prototype.includes = function(item) {
    return !DataManager.isItem(item) || [1,2].contains(item.itypeId);
  };

  Scene_Item.prototype.createCategoryWindow = function() {
    return;
  };

  Scene_Item.prototype.createItemWindow = function() {
      var wy = this._helpWindow.height;
      var wh = Graphics.boxHeight - wy;
      this._itemWindow = new Window_ItemList(0, wy, Graphics.boxWidth, wh);
      this._itemWindow.setHelpWindow(this._helpWindow);
      this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
      this._itemWindow.setHandler('cancel', this.popScene.bind(this));
      this.addWindow(this._itemWindow);
      this._itemWindow.refresh();
      this._itemWindow.activate();
  };

  Scene_Shop.prototype.createCategoryWindow = function() {
    return;
  };

  Scene_Shop.prototype.createSellWindow = function() {
      var wy = this._dummyWindow.y;
      var wh = Graphics.boxHeight - wy;
      this._sellWindow = new Window_ShopSell(0, wy, Graphics.boxWidth, wh);
      this._sellWindow.setHelpWindow(this._helpWindow);
      this._sellWindow.hide();
      this._sellWindow.setHandler('ok',     this.onSellOk.bind(this));
      this._sellWindow.setHandler('cancel', this.onSellCancel.bind(this));
      this.addWindow(this._sellWindow);
  };

  Scene_Shop.prototype.commandSell = function() {
      this._dummyWindow.hide();
      this._sellWindow.show();
      this._sellWindow.activate();
      this._sellWindow.refresh();
  };

  Scene_Shop.prototype.onSellOk = function() {
      this._item = this._sellWindow.item();
      this._sellWindow.hide();
      this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
      this._numberWindow.setCurrencyUnit(this.currencyUnit());
      this._numberWindow.show();
      this._numberWindow.activate();
      this._statusWindow.setItem(this._item);
      this._statusWindow.show();
  };

  Scene_Shop.prototype.onSellCancel = function() {
    this._commandWindow.activate();
    this._dummyWindow.show();
    this._sellWindow.hide();
    this._statusWindow.setItem(null);
    this._helpWindow.clear();
  };

  Scene_Shop.prototype.activateSellWindow = function() {
      this._sellWindow.refresh();
      this._sellWindow.show();
      this._sellWindow.activate();
      this._statusWindow.hide();
  };

})();