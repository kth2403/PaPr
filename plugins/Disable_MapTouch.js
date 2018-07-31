/*:
 * Disable_MapTouch.js
 * @plugindesc Disable processMapTouch and isMenuCalled
 * @author biud436
 */
 
(function() {
 
  Scene_Map.prototype.isMenuCalled = function() {
      // Overrride
      return Input.isTriggered('menu');
  };
 
  Scene_Map.prototype.processMapTouch = function() {
      // Overrride
  }
 
})();