/*:
 * @plugindesc v1.00 A simple plug-in designed to allow multiple loading screens
 * @author Hikitsune-Red 火狐
 *
 * @param Number of Loading Images
 * @desc (Just like it says)
 * @default 0
 *
 * @help
 * ================================================================================
 * SETUP:
 * Make sure each screen in the 'img/system' folder is named 'Loading#.png' where #
 * is a number starting/going up from 1.
 * 
 * There should also be a base one called just 'Loading.png' 
 *
 * ================================================================================
 * COMMANDS:
 * setLoadingScreen # #
 * ~~~Allows you to manually set the next loading screen range, pick a desert themed
 *    range if you're headed to a desert map, for instance.
 *    Use 0 0 to just use the 'Loading.png'
 *    Double the number (i.e. 1 1) for just the single loading screen
 *
 * ================================================================================
 * TERMS OF USE
 * Free for any commercial or non-commercial project!
 * Just credit Hikitsune-Red 火狐 in your project
 */

(function() {
	
	var parameters = PluginManager.parameters('RED_RandomLoadingScreen');
	var liranmax = Number(parameters['Number of Loading Images'] || 0);
	var liranset = null;
	var liransetmax = null;
	
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command.toLowerCase() === 'setloadingscreen')
		{
			if (args.length >= 0)
			{
				liranset = Number(args[0]);
				if (args.length >= 1)
				{
					liransetmax = Number(args[1]);
				}
			}
		}
	};
	
	var startLoading_leftovers = Graphics.startLoading;
	Graphics.startLoading = function() {
		var liran = Math.randomInt(liranmax + 1);
		var newlimg = 'img/system/Loading.png';
		if (liranset !== null)
		{
			if (liransetmax !== liranset)
			{
				liran = Math.randomInt(liransetmax + 1, liranset)
			}
			else
			{
				liran = liranset;
			}
			liranset = null;
			liransetmax = null;
		}
		if (liran > 0)
		{
			newlimg = 'img/system/Loading' + liran + '.png';
		}
		Graphics.setLoadingImage(newlimg);
		startLoading_leftovers.call(this);
	};
	
}) ();