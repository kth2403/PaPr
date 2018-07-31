//=============================================================================
// Helladen Engine - Screen Manager
// HE_ScreenManager.js
// Version: 1.0.3
//=============================================================================

var Imported = Imported || {};
var Helladen = Helladen || {};

Helladen.ScreenManager = Helladen.ScreenManager || {};
Helladen.ScrRes = Helladen.ScrRes || {};

//=============================================================================
 /*:
 * @plugindesc v1.0.3 make your game screen dynamically clamp sizes for different screen sizes.
 * @author Helladen, special thanks to Yanfly and Moghunter.
 *
 *
 * @param Max Resolution Height
 * @desc The maximum height you want your game to have.
 * Default: 768
 * @default 768
 * 
 * @param Max Resolution Width
 * @desc The maximum width you want your game to have.
 * Default: 1336
 * @default 1336
 * 
 * @param Min Resolution Height
 * @desc The minimum height you want your game to have.
 * Default: 576
 * @default 576
 * 
 * @param Min Resolution Width
 * @desc The minimum width you want your game to have.
 * Default: 1024
 * @default 1024
 * 
 * @param Rescale
 * @desc Draw more tiles or stretch screen? (false or true)
 * Default: false
 * @default false
 *
 *
 * @param Fullscreen
 * @desc Automatically fullscreen window? (false or true)
 * Default: false
 * @default false
 *
 * @help
 * Adjust the parameters to change the size of how you want your game's
 * screen ratio to appear. Place above Yanfly Core Engine and disable
 * Resolution plugin if it is enabled. This is based on that plugin.
 */
//=============================================================================

Helladen.Parameters = PluginManager.parameters('ScreenManager');
Helladen.Param = Helladen.Param || {};

Helladen.Param.Max_Width = eval(String(Helladen.Parameters['Max Resolution Width'] || "1336"));
Helladen.Param.Max_Height = eval(String(Helladen.Parameters['Max Resolution Height'] || "768"));

Helladen.Param.Min_Width = eval(String(Helladen.Parameters['Min Resolution Width'] || "1024"));
Helladen.Param.Min_Height = eval(String(Helladen.Parameters['Min Resolution Height'] || "576"));

Helladen.Param.Rescale = eval(String(Helladen.Parameters['Rescale'] || "0"));
Helladen.Param.Fullscreen = eval(String(Helladen.Parameters['Fullscreen'] || "0"));

//=============================================================================
// Scene_Manager
//=============================================================================
function Helladen_ScreenManager()
{
	Imported.ScreenManager = true;

	// Minimum resolution supported is 1024x576.
	Helladen.screenHeight = clamp(screen.availHeight, Helladen.Param.Min_Height, Helladen.Param.Max_Height)
	Helladen.screenWidth  = clamp(screen.availWidth, Helladen.Param.Min_Width, Helladen.Param.Max_Width)

	// Stretch the screen?
	if (!Helladen.Param.Rescale == "1")
	{
		SceneManager._screenWidth  = Helladen.screenWidth;
		SceneManager._screenHeight = Helladen.screenHeight;
		SceneManager._boxWidth     = Helladen.screenWidth;
		SceneManager._boxHeight    = Helladen.screenHeight;
	}
};

Helladen.ScrRes.SceneManager_run = SceneManager.run;
SceneManager.run = function(sceneClass) {
	Helladen_ScreenManager();

	Helladen.ScrRes.SceneManager_run.call(this, sceneClass);

	if (!Imported.ScreenResolution) {
		// Compatability with Yanfly Resolution in Core Engine.
		Imported.ScreenResolution = true;

		if (Utils.isMobileDevice()) return;
		if (Utils.isMobileSafari()) return;
		if (Utils.isAndroidChrome()) return;
		
		resizeScreen(Helladen.screenWidth, Helladen.screenHeight)

		if (Helladen.Param.Fullscreen)
		{
			Graphics._switchFullScreen();
		}
	}
};

function resizeScreen(width, height)
{
	window.moveBy(-1 * width / 2, -1 * height  / 2);
	window.resizeBy(width, height );
}

// Useful for clamping numbers
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

//=============================================================================
// End of File
//=============================================================================