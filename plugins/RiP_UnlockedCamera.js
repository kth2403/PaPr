//=============================================================================
// Rehtinor Plugin - Unlocked Camera
// RiP_UnlockedCamera.js
//=============================================================================

var Imported = Imported || {};
Imported.RiP_UnlockedCamera = true;

var Rehtinor = Rehtinor || {};
Rehtinor.UC = Rehtinor.UC || {};
Rehtinor.UC.version = 1.0;

//=============================================================================
 /*:
 * @plugindesc v1.0 Unlock the camera from map edges.
 * @author Rehtinor
 * 
 * @param Camera Default
 * @desc The default camera mode.
 * (0 Locked | 1 Unlocked)
 * @default 1
 * 
 * @help
 * Allows control over whether or not the camera will lock on map edges. If the
 * camera does not lock on map edges then the player will always be centered.
 * This helps bypass the need to surround your map with empty tiles to ensure
 * the camera will always be centered on the player.
 * 
 * You can specify a default which applies to every map AND notetag specific
 * maps.
 * 
 * To make a specific behave as normal simply add the following notetag.
 * <Camera: 0>
 * 
 * To make the camera not lock on map edges add this notetag instead.
 * <Camera: 1>
 * 
 * If a notetag is used it takes priority over the 'Camera Default' parameter.
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Rehtinor.Parameters = PluginManager.parameters('RiP_UnlockedCamera');
Rehtinor.Param = Rehtinor.Param || {};

Rehtinor.Param.UCCameraDefault = Number(Rehtinor.Parameters['Camera Default']);

//=============================================================================
// Game_Map
//=============================================================================

Rehtinor.UC.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
	this._zoomScale = 1;
	Rehtinor.UC.Game_Map_initialize.call(this);
}


Rehtinor.UC.Game_Map_scrollDown = Game_Map.prototype.scrollDown;
Game_Map.prototype.scrollDown = function(distance)
{
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY() / this._zoomScale) {
        var lastY = this._displayY;
        this._displayY = Math.min(this._displayY + distance,
            this.height() + this.screenTileY() * ((this._zoomScale - 1) / 4 - 1) );
        this._parallaxY += this._displayY - lastY;
    }
}

Rehtinor.UC.Game_Map_scrollLeft = Game_Map.prototype.scrollLeft;
Game_Map.prototype.scrollLeft = function(distance)
{
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX() / this._zoomScale) {
        var lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, - this.screenTileX() * (this._zoomScale-1) / 4);
        this._parallaxX += this._displayX - lastX;
    }
}

Rehtinor.UC.Game_Map_scrollRight = Game_Map.prototype.scrollRight;
Game_Map.prototype.scrollRight = function(distance)
{
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX() / this._zoomScale) {
        var lastX = this._displayX;
        this._displayX = Math.min(this._displayX + distance,
            this.width() + this.screenTileX() * ((this._zoomScale - 1) / 4 - 1));
        this._parallaxX += this._displayX - lastX;
    }
}

Rehtinor.UC.Game_Map_scrollUp = Game_Map.prototype.scrollUp;
Game_Map.prototype.scrollUp = function(distance)
{
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY() / this._zoomScale) {
        var lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, - this.screenTileY() * (this._zoomScale-1) / 4 );
        this._parallaxY += this._displayY - lastY;
    }
}


//=============================================================================
// End of File
//=============================================================================